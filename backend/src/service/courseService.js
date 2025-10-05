import Course from "../model/course.js";

export const getAll = async () => {
  const courses = await Course.find().sort({ createdAt: -1 });
  return courses;
};

export const getCourseById = async (id) => {
  const course = await Course.findById(id);
  if (!course) {
    const error = new Error(`Course with id ${id} not found`);
    error.statusCode = 404;
    throw error;
  }
  return course;
};

export const getCourseByCode = async (code) => {
  const course = await Course.findOne({ code });
  if (!course) {
    const error = new Error(`Course with cod ${code} not found`);
    error.statusCode = 404;
    throw error;
  }
  return course;
};

export const createCourse = async (data) => {
  const course = await Course.create({ ...data });
  return course;
};

export const updateCourse = async (id, data) => {
  const updates = { ...data };
  Object.keys(updates).forEach(
    (key) => updates[key] == null && delete updates[key]
  );

  const course = await Course.findByIdAndUpdate(
    id,
    { $set: updates },
    { new: true }
  );
  if (!course) {
    const error = new Error("Course not found");
    error.statusCode = 404;
    throw error;
  }
  return course;
};

export const deleteCourse = async (id) => {
  const course = await Course.findByIdAndDelete(id);
  if (!course) {
    const error = new Error("Course not found");
    error.statusCode = 404;
    throw error;
  }
  return course;
};
