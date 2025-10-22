import User from "../model/user.js";
import { syncUserToAsterisk } from './asteriskSyncService.js';

export const getAllUser = async (role = "") => {
  const query = role ? { role } : {};
  const users = await User.find(query).sort({ createdAt: -1 });
  return users;
};

export const createUser = async (data) => {
  await checkUsedEmail(data.email);
  let user = await User.create({ ...data });
  await syncUserToAsterisk({
    _id: user._id,
    email: user.email,
    passwordPlain: data.password,
  })
  user = user.toObject();
  delete user.password;
  return user;
};

export const updateUser = async (id, data) => {
  const updates = { ...data };
  Object.keys(updates).forEach(
    (key) => updates[key] == null && delete updates[key]
  );

  const user = await User.findByIdAndUpdate(
    id,
    { $set: updates },
    { new: true }
  ).select("-password");

  if (!user) {
    const error = new Error("User not found");
    error.statusCode = 404;
    throw error;
  }
  return user;
};

export const deleteUser = async (id) => {
  const user = await User.findByIdAndUpdate(id, { available: false });

  if (!user) {
    const error = new Error("User not found");
    error.statusCode = 404;
    throw error;
  }

  return user;
};

export const findByEmail = async (email) => {
  const user = await User.findOne({ email });
  if (!user) {
    const error = new Error(`User with email ${email} not found`);
    error.statusCode = 404;
    throw error;
  }
  return user;
};

const checkUsedEmail = async (email) => {
  const user = await User.findOne({ email });
  if (user) {
    const error = new Error(`Email has been used`);
    error.statusCode = 404;
    throw error;
  }
  return;
};

const checkAvailable = async (email) => {
  const user = await User.findOne({ email });
  if (!user.available) {
    const error = new Error("Account not availabe");
    error.statusCode = 404;
    throw error;
  }
  return user;
};
