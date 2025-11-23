import User from "../model/user.js";
import Semester from "../model/semester.js";
import Class from "../model/class.js";
import mongoose from "mongoose";

export const getScheduleBySemester = async (user_id, semester_id) => {
  const user = await User.findById(user_id);
  if (!user) {
    const error = new Error("User not found");
    error.statusCode = 404;
    throw error;
  }
  let result;
  if (user.role === "teacher") {
    result = await Class.find({
      teacher: new mongoose.Types.ObjectId(user_id),
      semester: new mongoose.Types.ObjectId(semester_id),
    })
      .populate("course", "title")
      .populate("semester", "name start_date end_date mid_term")
      .lean();
  } else if (user.role === "student") {
    result = await Class.aggregate([
      {
        $match: { semester: new mongoose.Types.ObjectId(semester_id) },
      },
      {
        $lookup: {
          from: "classstudents",
          localField: "_id",
          foreignField: "class",
          as: "enrollments",
        },
      },
      {
        $match: { "enrollments.student": new mongoose.Types.ObjectId(user_id) },
      },
      {
        $lookup: {
          from: "courses",
          localField: "course",
          foreignField: "_id",
          as: "courseDetails",
        },
      },
      { $unwind: "$courseDetails" },
      {
        $lookup: {
          from: "semesters",
          localField: "semester",
          foreignField: "_id",
          as: "semesterDetails",
        },
      },
      { $unwind: "$semesterDetails" },
      {
        $project: {
          name: 1,
          schedule: 1,
          theoryWeeks: 1,
          practiceWeeks: 1,
          absent: 1,
          course: {
            _id: "$courseDetails._id",
            title: "$courseDetails.title",
          },
          semester: {
            _id: "$semesterDetails._id",
            name: "$semesterDetails.name",
            start_date: "$semesterDetails.start_date",
            end_date: "$semesterDetails.end_date",
            mid_term: "$semesterDetails.mid_term",
          },
        },
      },
    ]);
  } else {
    const error = new Error("Invalid user role");
    error.statusCode = 400;
    throw error;
  }
  return result;
};
