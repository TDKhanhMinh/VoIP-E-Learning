import User from "../model/user.js";

export const initAdmin = async () => {
  const adminExists = await User.findOne({ role: "admin" });

  if (adminExists) {
    console.log("Admin already exists");
    return;
  }

  const admin = new User({
    full_name: "Quản trị viên",
    email: "50000000@tdtu.edu.vn",
    password: "123456",
    role: "admin",
    sipPassword: "123456",
    available: true,
  });

  await admin.save();
};
