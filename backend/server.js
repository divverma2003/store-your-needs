// Configure dotenv FIRST before any other imports
import dotenv from "dotenv";
import express from "express";

// Import external libraries/hosts
import { connectDB } from "./lib/db.js";

dotenv.config();

// Import routers
import authRoutes from "./routes/auth.route.js";

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json()); // allow req.body to be parsed

// Mount routes
app.use("/api/auth", authRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
  // connect to database
  connectDB();
});
