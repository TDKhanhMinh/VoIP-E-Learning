import * as service from "../service/submissionService.js";
import { asyncHandler } from "../middlewares/asyncHandler.js";

export const getAll = asyncHandler(async (req, res) => {
  const submission = await service.getAll();
  res.status(200).json(submission);
});

export const findById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const announcement = await service.findById(id);
  res.status(200).json(announcement);
});

export const createSubmission = asyncHandler(async (req, res) => {
  const data = req.body;
  const user_id = req.user._id;
  data.student = user_id;
  const submission = await service.creatSubmission(data);
  res.status(201).json(submission);
});

export const updateSubmission = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const data = req.body;
  const submission = await service.updateSubmission(id, data);
  res.status(200).json(submission);
});

export const deleteSubmission = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const submission = await service.deleteSubmission(id);
  res.status(200).json(submission);
});
