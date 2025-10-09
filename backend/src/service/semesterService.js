import Semester from "../model/semester.js";

export const getAll = async () => {
  const semesters = await Semester.find().sort({ createdAt: -1 });
  return semesters;
};

export const findById = async (id) => {
  const semester = await Semester.findById(id);
  if (!semester) {
    const error = new Error("Announcement with id ${id} not found");
    error.statusCode = 404;
    throw error;
  }
  return semester;
};

export const createSemester = async (data) => {
  await validateName(data.name);
  const semester = await Semester.create({ ...data });
  return semester;
};

export const updateSemester = async (id, data) => {
  const updates = { ...data };
  Object.keys(updates).forEach(
    (key) => updates[key] == null && delete updates[key]
  );

  const semester = await Semester.findByIdAndUpdate(
    id,
    { $set: updates },
    { new: true }
  );

  if (!semester) {
    const error = new Error("Semester not found");
    error.statusCode = 404;
    throw error;
  }

  return semester;
};

export const deleteSemester = async (id) => {
  const semester = await Semester.findByIdAndDelete(id);
  if (!semester) {
    const error = new Error("Semester not found");
    error.statusCode = 404;
    throw error;
  }
  return semester;
};

const validateName = async (name) => {
  const existed = await Semester.findOne({ name });
  if (existed) {
    const error = new Error(`Semester name ${name} already declared`);
    error.statusCode = 400;
    throw error;
  }
};
