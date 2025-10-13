import User from '../model/user.js';
import Assignment from './../model/assignment.js';
import Submission from './../model/submission.js';
export const getAll = async () => {
  const submissions = await Submission.find()
    .populate("assignment", "title deadline")
    .populate("student", "full_name email")
    .sort({ createdAt: -1 });

  return submissions;
};

export const findById = async (id) => {
  const submission = await Submission.findById(id)
    .populate("assignment", "title deadline")
    .populate("student", "full_name email");

  if (!submission) {
    const error = new Error(`Submission with id ${id} not found`);
    error.statusCode = 404;
    throw error;
  }
  return submission;
};

export const createSubmission = async (data) => {
  const [assignment, student] = await Promise.all([
    Assignment.findById(data.assignment),
    User.findById(data.student),
  ]);

  if (!assignment || !student) {
    const error = new Error("Invalid assignment or student");
    error.statusCode = 404;
    throw error;
  }

  const existed = await Submission.findOne({
    assignment: data.assignment,
    student: data.student,
  });
  if (existed) {
    const error = new Error("You have already submitted this assignment");
    error.statusCode = 400;
    throw error;
  }

  const submission = await Submission.create({ ...data });
  return submission;
};

export const updateSubmission = async (id, data) => {
  const updates = { ...data };
  Object.keys(updates).forEach((key) => updates[key] == null && delete updates[key]);

  const submission = await Submission.findByIdAndUpdate(id, { $set: updates }, { new: true })
    .populate("assignment", "title")
    .populate("student", "full_name email");

  if (!submission) {
    const error = new Error(`Submission with id ${id} not found`);
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

export const findByAssignment = async (assignmentId) => {
  const submissions = await Submission.find({ assignment: assignmentId })
    .populate("student", "full_name email")
    .sort({ createdAt: -1 });

  return submissions;
};

export const findByStudent = async (studentId) => {
  const submissions = await Submission.find({ student: studentId })
    .populate("assignment", "title deadline")
    .sort({ createdAt: -1 });

  return submissions;
};