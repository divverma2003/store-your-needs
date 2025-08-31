import User from "../models/user.model.js";
import getTransporter from "../lib/nodemailer.js";
import jwt from "jsonwebtoken";

import {
  prepareVerificationEmail,
  generateTokens,
  storeRefreshToken,
} from "../lib/utils.js";
import { redis } from "../lib/redis.js";
import { set } from "mongoose";

const setCookies = (res, accessToken, refreshToken) => {
  // we may set the name of our cookies to anything we'd like
  // this is how they'll be accessed from req.cookies."cookieName"
  // where we have: res.cookie("cookieName", params);
  res.cookie("accessToken", accessToken, {
    httpOnly: true, // prevent XSS (cross site scripting) attacks, can't be accessed via JS
    secure: process.env.NODE_ENV === "production", // only send over HTTPS in production
    sameSite: "strict", // prevent CSRF (cross-site request forgery) attacks
    maxAge: 15 * 60 * 1000, // 15 minutes
  });

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true, // prevent XSS (cross site scripting) attacks, can't be accessed via JS
    secure: process.env.NODE_ENV === "production", // only send over HTTPS in production
    sameSite: "strict", // prevent CSRF (cross-site request forgery) attacks
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });
};
export const register = async (req, res) => {
  try {
    const { email, name, password } = req.body;
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).send(`User with email: ${email} already exists.`);
    }
    const user = await User.create({ name, email, password });

    console.log(user.verificationToken);
    // send verification email
    const mailOptions = prepareVerificationEmail(
      user.verificationToken,
      user.email,
      user.name
    );

    try {
      const transporter = getTransporter();
      await transporter.sendMail(mailOptions);
      // After user is successfully created, authenticate them.
      const { accessToken, refreshToken } = generateTokens(user._id);
      await storeRefreshToken(user._id, refreshToken);

      setCookies(res, accessToken, refreshToken);

      console.log(
        "Verification email set successfully. User registered successfully:",
        user.email
      );
      res.status(201).json({
        message: "User registered successfully.",
        data: {
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          isVerified: user.isVerified,
        },
      });
    } catch (emailError) {
      // Delete the user if email verification fails
      await User.findByIdAndDelete(user._id);

      console.log(
        "Error occurred while sending verification email: ",
        emailError.message
      );
      res.status(500).json({
        message:
          "Registration failed. Could not send verification email. Please try again.",
        error: emailError.message,
      });
    }
  } catch (error) {
    console.log("Error occurred in register authController:", error.message);
    res
      .status(500)
      .json({ message: `Internal server error`, error: error.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (user) {
      // user found, continue
      const passwordMatch = await user.comparePassword(password);
      let serverMessage = user.isVerified
        ? "Login successful."
        : "Login Successful, but user is not verified.";

      if (passwordMatch) {
        const { accessToken, refreshToken } = generateTokens(user._id);
        await storeRefreshToken(user._id, refreshToken);
        setCookies(res, accessToken, refreshToken);
        res.status(200).json({
          message: serverMessage,
          data: {
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            isVerified: user.isVerified,
          },
        });
      } else {
        res.status(401).json({ message: "Invalid email or password." });
      }
    } else {
      res.status(401).json({ message: "Invalid email or password." });
    }
  } catch (error) {
    console.log("Error occurred in login authController:", error.message);
    res
      .status(500)
      .json({ message: `Internal server error`, error: error.message });
  }
};

export const logout = async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken;

    // Check if refresh token exists
    // we want to delete this because the user is logging out
    if (refreshToken) {
      // Verify the refresh token
      const decode = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
      // remove the refresh token from the database
      await redis.del(`refresh_token:${decode.userId}`);
    }

    // clear from browser
    res.clearCookie("accessToken");
    res.clearCookie("refreshToken");
    res.json({ message: "Logged out successfully." });
  } catch (error) {
    console.log("Error in logout authController:", error.message);
    res.status(500).json({
      message: `Internal server error.`,
      error: error.message,
    });
  }
};

// Email verification endpoint
export const verifyEmail = async (req, res) => {
  try {
    const { token } = req.params;
    console.log("Email verification requested with token:", token);

    const user = await User.findOne({
      verificationToken: token,
      verificationTokenExpires: { $gt: Date.now() },
    });

    if (!user) {
      console.log("Invalid or expired verification token:", token);
      return res.status(400).json({
        message:
          "Invalid or expired verification token. Please try verifying your email again.",
      });
    }

    // Verify the user and clear the verification token
    user.isVerified = true;
    user.verificationToken = null;
    user.verificationTokenExpires = null;

    // update the user
    await user.save();

    console.log("Email verified successfully for user:", user.email);

    res.status(200).json({
      message: "Email verified successfully! You can now log in.",
      data: {
        _id: user._id,
        fullName: user.fullName,
        email: user.email,
        isVerified: user.isVerified,
      },
    });
  } catch (error) {
    console.log("Error in verifyEmail controller:", error.message);
    res.status(500).json({ message: "Internal Server Error." });
  }
};

// this will refresh the access token
export const refreshToken = async (req, res) => {
  try {
    // use refresh token to generate new access token
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
      return res.status(401).json({ message: "Refresh token not provided." });
    }
    const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
    const storedToken = await redis.get(`refresh_token:${decoded.userId}`);

    if (storedToken !== refreshToken) {
      return res.status(401).json({ message: "Invalid refresh token." });
    }

    const accessToken = jwt.sign(
      { userId: decoded.userId },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "15m" }
    );
    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 15 * 60 * 1000, // 15 minutes
    });
    res.status(200).json({ message: "Access token refreshed successfully." });
  } catch (error) {
    console.log("Error in refreshToken controller:", error.message);
    res.status(500).json({ message: "Internal Server Error." });
  }
};

// we need access to the logged in user's profile
export const getProfile = async (req, res) => {
  try {
    res.status(200).json({
      message: "User profile retrieved successfully.",
      data: req.user,
    });
  } catch (error) {
    console.log("Error in getProfile controller:", error.message);
    res.status(500).json({ message: "Internal Server Error." });
  }
  res.send("getProfile");
};
