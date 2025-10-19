import User from "../model/user.js";
import Class from "../model/class.js";
import ClassStudent from "../model/class_student.js";
import mongoose from "mongoose";

export const getClassStudents = async (class_id) => {
  const students = await ClassStudent.aggregate([
    { $match: { class: new mongoose.Types.ObjectId(class_id) } },
    {
      $lookup: {
        from: "users",
        localField: "student",
        foreignField: "_id",
        as: "studentInfo",
      },
    },
    { $unwind: "$studentInfo" },
    {
      $project: {
        student: {
          _id: "$studentInfo._id",
          full_name: "$studentInfo.full_name",
          email: "$studentInfo.email",
        },
        class: 1,
      },
    },
  ]);
  return students;
};
export const getAllEnrollments = async () => {
  const enrollments = await ClassStudent.find().sort({ createdAt: -1 });
  return enrollments;
};
export const findByStudentId = async (studentId) => {
  const enrollments = await ClassStudent.find({ student: studentId })
    .populate({
      path: "class",
      populate: { path: "course teacher semester" },
    })
    .populate("student")
    .sort({ joined_at: -1 });

  if (!enrollments || enrollments.length === 0) {
    const error = new Error(`No enrollment found for student ${studentId}`);
    error.statusCode = 404;
    throw error;
  }

  return enrollments || [];
};
export const findById = async (id) => {
  const classStudent = await ClassStudent.findById(id);
  if (!classStudent) {
    const error = new Error("Announcement with id ${id} not found");
    error.statusCode = 404;
    throw error;
  }
  return classStudent;
};

export const createClassStudent = async (data) => {
  const joiningClass = await Class.findById(data.class);
  if (!joiningClass) {
    const error = new Error("Invalid class id");
    error.statusCode = 404;
    throw error;
  }

  const studentIds = Array.isArray(data.student)
    ? data.student
    : [data.student];

  if (!studentIds || studentIds.length === 0) {
    const error = new Error("No student(s) provided");
    error.statusCode = 400;
    throw error;
  }

  const validStudents = await User.find({
    _id: { $in: studentIds },
    available: true,
  });

  if (validStudents.length === 0) {
    const error = new Error("No valid student found");
    error.statusCode = 404;
    throw error;
  }

  const existing = await ClassStudent.find({
    class: joiningClass._id,
    student: { $in: validStudents.map((s) => s._id) },
  });

  const existingIds = existing.map((e) => e.student.toString());

  const newStudents = validStudents.filter(
    (s) => !existingIds.includes(s._id.toString())
  );

  if (newStudents.length === 0) {
    const error = new Error("All students already joined this class");
    error.statusCode = 400;
    throw error;
  }

  const enrollments = newStudents.map((s) => ({
    class: joiningClass._id,
    student: s._id,
    joined_at: Date.now(),
  }));

  const created = await ClassStudent.insertMany(enrollments, { ordered: false });

  return {
    class: joiningClass._id,
    added: created.length,
    skipped: existingIds.length,
    message: `${created.length} student(s) added successfully`,
  };
};
export const deleteClassStudent = async (id) => {
  const classStudent = await ClassStudent.findByIdAndDelete(id);
  if (!classStudent) {
    const error = new Error("Class student not found");
    error.statusCode = 404;
    throw error;
  }
  return classStudent;
};
