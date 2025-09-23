import dotenv from "dotenv";
import mongoose from "mongoose";

dotenv.config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB connected...", mongoose.connection.name);
  } catch (err) {
    console.error(err.message);
    process.exit(1);
  }
};

export default connectDB;
