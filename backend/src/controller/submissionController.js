import * as service from "../service/submissionService.js";
import { asyncHandler } from "../middlewares/asyncHandler.js";

export const getAll = asyncHandler(async (req, res) => {
  const submissions = await service.getAll();
  res.status(200).json(submissions);
});

export const findById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const submission = await service.findById(id);
  res.status(200).json(submission);
});

export const createSubmission = asyncHandler(async (req, res) => {
  const data = req.body;
  const submission = await service.createSubmission(data);
  res.status(201).json({
    message: "Submission created successfully",
    submission,
  });
});

export const updateSubmission = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const data = req.body;
  const submission = await service.updateSubmission(id, data);
  res.status(200).json({
    message: "Submission updated successfully",
    submission,
  });
});

export const deleteSubmission = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const submission = await service.deleteSubmission(id);
  res.status(200).json({
    message: "Submission deleted successfully",
    submission,
  });
});

export const getByAssignment = asyncHandler(async (req, res) => {
  const { assignmentId } = req.params;
  const submissions = await service.findByAssignment(assignmentId);
  res.status(200).json(submissions);
});

export const getByStudent = asyncHandler(async (req, res) => {
  const { studentId } = req.params;
  const submissions = await service.findByStudent(studentId);
  res.status(200).json(submissions);
});
