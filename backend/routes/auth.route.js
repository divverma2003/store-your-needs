import express from "express";
import {
  login,
  logout,
  register,
  verifyEmail,
  refreshToken,
  getProfile,
  resendVerification,
} from "../controllers/auth.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout);
router.post("/refresh-token", refreshToken);

router.get("/verify-email/:token", verifyEmail);
router.post("/resend-verification", protectRoute, resendVerification);
router.get("/profile", protectRoute, getProfile);

export default router;
