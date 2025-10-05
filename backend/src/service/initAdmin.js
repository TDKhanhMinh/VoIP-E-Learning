import User from "../model/user.js";

export const initAdmin = async () => {
  const adminExists = await User.findOne({ role: "admin" });

  if (adminExists) {
    console.log("Admin already exists");
    return;
  }

  const admin = new User({
    full_name: "Administrator",
    email: "admin@gmail.com",
    password: "123456",
    role: "admin",
    available: true,
  });

  await admin.save();
};
