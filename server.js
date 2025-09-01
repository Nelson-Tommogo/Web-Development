import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";

dotenv.config();

const app = express();
app.use(express.json());

app.get("/", (req, res) => {
  res.send("🚀 Backend is running");
});

const PORT = process.env.PORT || 5000;
const MONGO_URL =
  process.env.MONGO_URL ||
  "mongodb+srv://2004172:evd68rqhIujleLIo@web.6dk0btn.mongodb.net/?retryWrites=true&w=majority&appName=web";

const startServer = async () => {
  try {
    await mongoose.connect(MONGO_URL);
    console.log("✅ MongoDB Connected:", mongoose.connection.name);

    app.listen(PORT, () => {
      console.log(`🌐 Server running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("❌ MongoDB connection failed:", error.message);
    process.exit(1);
  }
};

startServer();
