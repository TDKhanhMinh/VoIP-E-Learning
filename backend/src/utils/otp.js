import OTP from "../models/OTP.js";

export const generateOTP = async (email) => {
  const otpCode = Math.floor(100000 + Math.random() * 900000).toString();

  const expire_at = new Date(Date.now() + 1 * 60 * 1000);

  await OTP.findOneAndUpdate(
    { email },
    { otp: otpCode, expire_at },
    { upsert: true, new: true }
  );

  return otpCode;
};
