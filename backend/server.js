// Configure dotenv FIRST before any other imports
import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cookieParser from "cookie-parser";
import path from "path";

// Import external libraries/hosts
import { connectDB } from "./lib/db.js";

// Import routers
import authRoutes from "./routes/auth.route.js";
import productRoutes from "./routes/product.route.js";
import cartRoutes from "./routes/cart.route.js";
import couponRoutes from "./routes/coupon.route.js";
import paymentRoutes from "./routes/payment.route.js";
import analyticsRoutes from "./routes/analytics.route.js";

const app = express();
const PORT = process.env.PORT || 5000;

const __dirname = path.resolve();

// Middleware
app.use(express.json({ limit: "10mb" })); // allow req.body to be parsed
app.use(cookieParser()); // to parse cookies from incoming requests

// Mount routes
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/coupons", couponRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/analytics", analyticsRoutes);

if (process.env.NODE_ENV === "production") {
  const distPath = path.join(__dirname, "frontend", "dist");

  app.use(express.static(distPath));

  // Catch-all to send index.html for any non-API routes
  app.get("*", (req, res, next) => {
    if (req.path.startsWith("/api/"))
      return res.status(404).json({ message: "API route not found" });
    res.sendFile(path.join(distPath, "index.html"));
  });
}
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
  // connect to database
  connectDB();
});
