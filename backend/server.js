import express from "express";
import dotenv from "dotenv";

// Import external libraries/hosts
import { connectDB } from "./lib/db.js";

// Import routers
import authRoutes from "./routes/auth.route.js";

// Configure dotenv for use
dotenv.config();

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
