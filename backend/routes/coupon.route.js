import express from "express";
import {
  protectRoute,
  requireVerifiedEmail,
} from "../middleware/auth.middleware.js";
import { getCoupon, validateCoupon } from "../controllers/coupon.controller.js";

const router = express.Router();

router.get("/", protectRoute, requireVerifiedEmail, getCoupon);
router.get("/", protectRoute, requireVerifiedEmail, validateCoupon);
export default router;
