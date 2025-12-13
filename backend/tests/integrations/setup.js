import User from "../../src/model/user.js";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";

let mongoServer;

export const connectTestDB = async () => {
  if (mongoose.connection.readyState !== 0) {
    await mongoose.disconnect();
  }
  if (mongoServer) {
    await mongoServer.stop();
  }
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  await mongoose.connect(uri);
};

export const closeTestDB = async () => {
  if (mongoose.connection.readyState !== 0) {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
  }
  if (mongoServer) {
    await mongoServer.stop();
  }
};
export const clearTestDB = async () => {
  const collections = mongoose.connection.collections;
  for (const key in collections) {
    await collections[key].deleteMany();
  }
};

export const createAuthToken = (userId, email, role = "student") => {
  return jwt.sign(
    { id: userId, email, role },
    process.env.JWT_SECRET || "test_secret",
    {
      expiresIn: "1d",
    }
  );
};

export const createTestUser = async (role = "student") => {
  const user = await User.create({
    username: `test_${role}_${Date.now()}`,
    email: `test_${role}_${Date.now()}@test.com`,
    password: "password123",
    role,
    firstName: "Test",
    lastName: "User",
    full_name: "Test User Fullname",
    sipPassword: "dummySipPassword123",
  });
  return user;
};
