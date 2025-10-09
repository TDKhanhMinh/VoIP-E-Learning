import Submission from "../model/submission.js";
import Assignment from "../model/assignment.js";
import User from "../model/user.js";

export const getAll = async () => {
  const submission = await Submission.find().sort({ createdAt: -1 });
  return submission;
};

export const findById = async (id) => {
  const submission = await Submission.findById(id);
  if (!submission) {
    const error = new Error("Announcement with id ${id} not found");
    error.statusCode = 404;
    throw error;
  }
  return submission;
};

export const creatSubmission = async (data) => {
  const [assignment, student] = await Promise.all([
    Assignment.findById(data.assignment),
    User.findById(data.student),
  ]);
  if (!assignment || !student) {
    const error = new Error("Invalid assignment or student");
    error.statusCode = 404;
    throw error;
  }
  const submission = await Submission.create({ ...data });
  return submission;
};

export const updateSubmission = async (id, data) => {
  const updates = { ...data };
  Object.keys(updates).forEach(
    (key) => updates[key] == null && delete updates[key]
  );
  console.log(id);
  const submission = await Submission.findByIdAndUpdate(
    id,
    { $set: updates },
    { new: true }
  );
  if (!submission) {
    const error = new Error("Submission not found");
    error.statusCode = 404;
    throw error;
  }
  return submission;
};

export const deleteSubmission = async (id) => {
  const submission = await Submission.findByIdAndDelete(id);
  if (!submission) {
    const error = new Error(`Submission with id ${id} not found`);
    error.statusCode = 404;
    throw error;
  }
  return submission;
};
