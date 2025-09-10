import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

export const protectRoute = async (req, res, next) => {
  try {
    const accessToken = req.cookies.accessToken;

    // If there's no access token in the current browser, return a 401 response
    if (!accessToken) {
      return res
        .status(401)
        .json({ message: "Unauthorized - No Token Provided." });
    }

    try {
      // Find the user linked to the token
      const decoded = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);
      // console.log("Decoded token:", decoded); // Check what field contains the user ID
      const user = await User.findById(decoded.userId).select("-password"); // everything but the password

      if (!user) {
        return res
          .status(401)
          .json({ message: "Token not linked with any user." });
      }

      req.user = user;

      next();
    } catch (error) {
      if (error.name === "TokenExpiredError") {
        return res
          .status(401)
          .json({ message: "Unauthorized - Access Token Expired." });
      }
      throw error;
    }
  } catch (error) {
    console.log("Error in protectRoute authMiddleware", error.message);
    return res
      .status(401)
      .json({ message: "Unauthorized - Invalid access token" });
  }
};

export const adminRoute = (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    next();
  } else {
    return res.status(403).json({ message: "Access Denied - Admin Only." });
  }
};

export const requireVerifiedEmail = (req, res, next) => {
  if (req.user && !req.user.isVerified) {
    return res.status(403).json({
      message: "Email verification required. Please check your email.",
      requiresVerification: true,
    });
  }
  next();
};
