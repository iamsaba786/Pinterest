import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const connectDb = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL, {
      dbName: "pinterest",
    });

    console.log("MONGO_URL from env:", process.env.MONGO_URL);

    console.log("mongodb is connected");

    // Connection events
    mongoose.connection.on("error", (err) => {
      console.error("❌ MongoDB Error:", err);
    });

    return true; // Success signal
  } catch (error) {
    console.error("❌ MongoDB Connection Failed:", error);
    process.exit(1); // Exit if DB fails
  }
};

export default connectDb;
