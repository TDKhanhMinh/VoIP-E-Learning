import Class from "../model/class.js";
import Course from "../model/course.js";
import Semester from "../model/semester.js";
import User from "../model/user.js";

export const getAll = async () => {
  const classes = await Class.find().sort({ createdAt: -1 });
  return classes;
};

export const createClass = async (data) => {
  console.log(data);
  const [semester, teacher, course] = await Promise.all([
    Semester.findById(data.semester),
    User.findOne({ _id: data.teacher, role: "teacher" }),
    Course.findById(data.course),
  ]);

  console.log(semester, teacher, course);

  if (!semester || !teacher || !course) {
    const error = new Error("Invalid semester, teacher or course");
    error.statusCode = 404;
    throw error;
  }
  const newClass = await Class.create({ ...data });
  return newClass;
};

export const updateClass = async (id, data) => {
  const updates = { ...data };
  Object.keys(updates).forEach(
    (key) => updates[key] == null && delete updates[key]
  );
  if (updates.teacher) {
    const teacher = await User.findOne({
      _id: updates.teacher,
      role: "teacher",
    });
    if (!teacher) {
      const error = new Error("Invalid teacher");
      error.statusCode = 404;
      throw error;
    }
  }
  const updateClass = await Class.findByIdAndUpdate(
    id,
    { $set: updates },
    { new: true }
  );
  if (!updateClass) {
    const error = new Error("Class not found");
    error.statusCode = 404;
    throw error;
  }
  return updateClass;
};

export const deleteClass = async (id) => {
  const deleteClass = await Class.findByIdAndDelete(id);
  if (!deleteClass) {
    const error = new Error("Class not found");
    error.statusCode = 404;
    throw error;
  }
  return deleteClass;
};
