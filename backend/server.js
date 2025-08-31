// Configure dotenv FIRST before any other imports
import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cookieParser from "cookie-parser";

// Import external libraries/hosts
import { connectDB } from "./lib/db.js";

// Import routers
import authRoutes from "./routes/auth.route.js";

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json()); // allow req.body to be parsed
app.use(cookieParser()); // to parse cookies from incoming requests

// Mount routes
app.use("/api/auth", authRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
  // connect to database
  connectDB();
});
