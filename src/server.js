import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cors from "cors";

import authRoutes from "./routes/authRoutes.js";

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Basic Route
app.get("/", (req, res) => {
  res.json({
    message: "🚀 Backend is running",
    version: "1.0.0",
    routes: {
      auth: "/api/auth",
    }
  });
});

// API Routes
app.use("/api/auth", authRoutes);

// 404 Handler
app.use("*", (req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found"
  });
});

// Error Handling Middleware
app.use((error, req, res, next) => {
  console.error("🚨 Error:", error);
  res.status(500).json({
    success: false,
    message: "Internal server error",
    error: process.env.NODE_ENV === "development" ? error.message : "Something went wrong"
  });
});

const PORT = process.env.PORT || 5000;
const MONGO_URL = process.env.MONGO_URL || "mongodb+srv://2004172:evd68rqhIujleLIo@web.6dk0btn.mongodb.net/?retryWrites=true&w=majority&appName=web";

const startServer = async () => {
  try {
    await mongoose.connect(MONGO_URL);
    console.log("✅ MongoDB Connected:", mongoose.connection.name);

    app.listen(PORT, () => {
      console.log(`🌐 Server running on http://localhost:${PORT}`);
      console.log(`🔐 Auth routes available at http://localhost:${PORT}/api/auth`);
    });
  } catch (error) {
    console.error("❌ MongoDB connection failed:", error.message);
    process.exit(1);
  }
};

startServer();