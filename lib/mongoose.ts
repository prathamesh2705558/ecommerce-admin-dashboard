import mongoose from "mongoose";

export const connectDB = async () => {
  // If already connected, reuse the connection
  if (mongoose.connection.readyState >= 1) {
    return;
  }

  try {
    const uri = process.env.MONGODB_URI;
    if (!uri) throw new Error("MONGODB_URI is missing in .env file");

    await mongoose.connect(uri);
    console.log("✅ Connected to MongoDB (Mongoose)");
  } catch (error) {
    console.error("❌ Mongoose connection error:", error);
  }
};