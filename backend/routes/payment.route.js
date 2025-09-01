import express from "express";
import {
  protectRoute,
  requireVerifiedEmail,
} from "../middleware/auth.middleware.js";
import {
  createCheckoutSession,
  checkoutSuccess,
} from "../controllers/payment.controller.js";

const router = express.Router();

// Payment routes go here
router.post(
  "/create-checkout-session",
  protectRoute,
  requireVerifiedEmail,
  createCheckoutSession
);
router.post(
  "/checkout-success",
  protectRoute,
  requireVerifiedEmail,
  checkoutSuccess
);

export default router;
