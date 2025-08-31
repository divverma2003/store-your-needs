import User from "../models/user.model.js";
import getTransporter from "../lib/nodemailer.js";
import { prepareVerificationEmail } from "../lib/utils.js";

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
      console.log("Verification email sent successfully to:", email);
      res.status(201).json({
        message:
          "Registration successful! Verification email sent successfully.",
        user,
      });
    } catch (emailError) {
      console.log(
        "Error occurred while sending verification email: ",
        emailError.message
      );

      // Delete the user if email fails
      await User.findByIdAndDelete(user._id);

      res.status(500).json({
        error:
          "Registration failed. Could not send verification email. Please try again.",
        error: emailError.message,
      });
    }
  } catch (error) {
    console.log("Error occurred in register auth controller:", error.message);
    res.status(500).json({ message: `Registration failed: ${error.message}` });
  }
};

export const login = async (req, res) => {
  res.send("Login route called.");
};

export const logout = async (req, res) => {
  res.send("Logout route called.");
};
