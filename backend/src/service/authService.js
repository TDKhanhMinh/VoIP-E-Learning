import client from "../config/googleConfig.js";
import jwt from "jsonwebtoken";
import User from "../model/user.js";
import { generateToken } from "../utils/token.js";

export const getGoogleAuthUrl = () => {
  const url = client.generateAuthUrl({
    access_type: "offline",
    prompt: "consent",
    scope: ["openid", "profile", "email"],
  });
  return url;
};

export const getGoogleUser = async (code) => {
  const { tokens } = await client.getToken(code);
  const ticket = await client.verifyIdToken({
    idToken: tokens.id_token,
    audience: process.env.GOOGLE_CLIENT_ID,
  });
  const payload = ticket.getPayload();
  return { payload, tokens };
};

export const generateAppToken = async (data) => {
  const user = await User.findOne({ email: data.email });
  if (!user) {
    const error = new Error("Email not registered");
    error.statusCode = 400;
    throw error;
  }
  return {
    _id: user._id,
    full_name: user.full_name,
    email: user.email,
    token: generateToken(user._id, user.email, user.role),
  };
};

export const login = async (email, password) => {
  const user = await User.findOne({ email });
  if (user && (await user.matchPassword(password))) {
    return {
      _id: user._id,
      full_name: user.full_name,
      email: user.email,
      role: user.role,
      token: generateToken(user._id),
    };
  } else {
    const error = new Error("Invalid email or password");
    error.statusCode = 400;
    throw error;
  }
};
