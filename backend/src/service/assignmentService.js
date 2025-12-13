import Assignment from "../model/assignment.js";
import Class from "../model/class.js";

export const getAll = async () => {
  const assignments = await Assignment.find().sort({ createdAt: -1 });
  return assignments;
};

export const findById = async (id) => {
  const assignment = await Assignment.findById(id);
  if (!assignment) {
    const error = new Error(`Assignment with id ${id} not found`);
    error.statusCode = 404;
    throw error;
  }
  return assignment;
};

export const getAssignmentByClassId = async (classId) => {
  const assignments = await Assignment.find({ class: classId })
    .populate("class", "name")
    .sort({ createdAt: -1 });

  return assignments || [];
};



export const createAssignment = async (data) => {
  const postingClass = await Class.findById(data.class);
  if (!postingClass) {
    const error = new Error(`Class with id ${data.class} not found`);
    error.statusCode = 404;
    throw error;
  }

  const assignment = await Assignment.create({ ...data });

  return assignment;
};

export const updateAssignment = async (id, data) => {
  const updates = { ...data };
  Object.keys(updates).forEach((key) => {
    updates[key] == null && delete updates[key];
  });

  const assignment = await Assignment.findByIdAndUpdate(
    id,
    { $set: updates },
    { new: true }
  );
  if (!assignment) {
    const error = new Error(`Assignment with id ${id} not found`);
    error.statusCode = 404;
    throw error;
  }
  return assignment;
};

export const deleteAssignment = async (id) => {
  const assignment = await Assignment.findByIdAndDelete(id);
  if (!assignment) {
    const error = new Error(`Assignment with id ${id} not found`);
    error.statusCode = 404;
    throw error;
  }
  return assignment;
};
