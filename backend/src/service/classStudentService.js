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

export const createClassStudent = async (data) => {
  const [joiningClass, student] = await Promise.all([
    Class.findById(data.class),
    User.findOne({ _id: data.student, available: true }),
  ]);
  if (!joiningClass || !student) {
    const error = new Error("Invalid class or student id");
    error.statusCode = 404;
    throw error;
  }
  const existed = await ClassStudent.findOne({
    class: joiningClass._id,
    student: student._id,
  });
  console.log(existed);
  if (existed) {
    const error = new Error("Student already joined class");
    error.statusCode = 400;
    throw error;
  }
  const classStudent = await ClassStudent.create({
    ...data,
    joined_at: Date.now(),
  });
  return classStudent;
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
