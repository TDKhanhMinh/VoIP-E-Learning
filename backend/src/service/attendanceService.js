import Attendance from "../model/attendance.js";
import Class from "../model/class.js";
import User from "../model/user.js";

export const getAll = async () => {
  const attendances = await Attendance.find().sort({ createdAt: -1 });
  return attendances;
};

export const findById = async (id) => {
  const attendance = await Attendance.findById(id);
  if (!attendance) {
    const error = new Error("Announcement with id ${id} not found");
    error.statusCode = 404;
    throw error;
  }
  return attendance;
};

export const createAttendance = async (data) => {
  const [attendingClass, student] = await Promise.all([
    Class.findById(data.class),
    User.findById(data.student),
  ]);
  if (!attendingClass || !student) {
    const error = new Error("Invalid class or student");
    error.statusCode = 404;
    throw error;
  }
  const attendance = await Attendance.create({
    ...data,
    attend_at: new Date(),
  });

  return attendance;
};

export const updateAttendance = async (id, data) => {
  const updates = { ...data };
  Object.keys(updates).forEach((key) => {
    updates[key] == null && delete updates[key];
  });

  const attendance = await Attendance.findByIdAndUpdate(
    id,
    { $set: updates },
    { new: true }
  );

  if (!attendance) {
    const error = new Error("Attendance not found");
    error.statusCode = 404;
    throw error;
  }

  return attendance;
};

export const deleteAttendance = async (id) => {
  const attendance = await Attendance.findByIdAndDelete(id);
  if (!attendance) {
    const error = new Error(`Attendance with id ${id} not found`);
    error.statusCode = 404;
    throw error;
  }
  return attendance;
};
