import Attendance from "../model/attendance.js";
import Class from "../model/class.js";

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

export const findByClassId = async (classId) => {
  const attendances = await Attendance.find({ class: classId })
    .populate("student", "full_name email")
    .populate("class", "name")
    .sort({ lesson: -1, attend_at: -1 });

  if (!attendances || attendances.length === 0) {
    const error = new Error(`No attendance records found for class ${classId}`);
    error.statusCode = 404;
    throw error;
  }

  return attendances;
};
export const findByStudentId = async (studentId) => {
  const attendances = await Attendance.find({ student: studentId })
    .populate("class", "name")
    .populate("student", "full_name email")
    .sort({ lesson: -1, attend_at: -1 });

  return attendances || [];
};
// export const createAttendance = async (data) => {
//   const [attendingClass, student] = await Promise.all([
//     Class.findById(data.class),
//     User.findById(data.student),
//   ]);
//   if (!attendingClass || !student) {
//     const error = new Error("Invalid class or student");
//     error.statusCode = 404;
//     throw error;
//   }
//   const attendance = await Attendance.create({
//     ...data,
//     attend_at: new Date(),
//   });

//   return attendance;
// };

export const createAttendance = async (data) => {
  const attendingClass = await Class.findById(data.class);
  if (!attendingClass) throw new Error("Invalid class ID");

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);

  const existingToday = await Attendance.findOne({
    class: data.class,
    attend_at: { $gte: today, $lt: tomorrow },
  });

  if (existingToday) {
    const error = new Error("Class has already been marked attendance today");
    error.statusCode = 400;
    throw error;
  }

  const lastAttendance = await Attendance.findOne({ class: data.class }).sort({
    lesson: -1,
  });
  const nextLesson = lastAttendance ? lastAttendance.lesson + 1 : 1;

  const docs = data.attendances.map((a) => ({
    class: data.class,
    student: a.student,
    status: a.status || "present",
    lesson: nextLesson,
    attend_at: new Date(),
  }));

  const created = await Attendance.insertMany(docs);
  return { lesson: nextLesson, count: created.length, data: created };
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
