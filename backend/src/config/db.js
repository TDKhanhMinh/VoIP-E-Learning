import dotenv from "dotenv";
import mongoose from "mongoose";
import { initAdmin } from "../service/initAdmin.js";

dotenv.config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      maxPoolSize: 10,
      minPoolSize: 5,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
      family: 4,
      autoIndex: process.env.NODE_ENV !== "production",
    });
    await initAdmin();
    console.log("MongoDB connected...", mongoose.connection.name);
  } catch (err) {
    console.error(err.message);
    process.exit(1);
  }
};

export default connectDB;
