const mongoose = require("mongoose");

async function connectDB() {
  try {
    console.log("⏳ Connecting to MongoDB Atlas...");
    await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 10000,
    });
    console.log("✅ Connected to MongoDB Atlas");
  } catch (err) {
    console.error("❌ MongoDB connection error:", err.message);
    console.error("   Full error:", err.reason || err);
    console.error("   MONGO_URI starts with:", process.env.MONGO_URI?.substring(0, 40) + "...");
    process.exit(1);
  }
}

module.exports = connectDB;
