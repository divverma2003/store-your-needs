import express from "express";
import {
  adminRoute,
  protectRoute,
  requireVerifiedEmail,
} from "../middleware/auth.middleware.js";
import {
  getAnalyticsData,
  getDailySalesData,
} from "../controllers/analytics.controller.js";
const router = express.Router();

router.get(
  "/",
  protectRoute,
  requireVerifiedEmail,
  adminRoute,
  async (req, res) => {
    try {
      const analyticsData = await getAnalyticsData();

      // we'll track our analytics data across the course of 7 days
      // starting from the current date, we'll track the last week
      const endDate = new Date();
      startDate.setDate(endDate.getTime() - 7 * 24 * 60 * 60 * 1000);

      const dailySalesData = await getDailySalesData(startDate, endDate);

      res.status(200).json({
        message: "Analytics data fetched successfully",
        data: { analyticsData, dailySalesData },
      });
    } catch (error) {
      console.error("Error fetching analytics data:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
);
export default router;
