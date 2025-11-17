import * as service from "../service/testAttemptService.js";
import { asyncHandler } from "../middlewares/asyncHandler.js";

export const getAllTestAttempts = asyncHandler(async (req, res) => {
  const attempts = await service.getAll();
  res.status(200).json(attempts);
});

export const getAttemptsByStudentAndTest = asyncHandler(async (req, res) => {
  const { testId } = req.params;
  const studentId = req.user._id;
  const attempts = await service.getAttemptsByStudentAndTest(studentId, testId);
  res.status(200).json(attempts);
});

export const createTestAttempt = asyncHandler(async (req, res) => {
  const { sessionId } = req.params;
  const attempt = await service.createTestAttempt(sessionId);
  res.status(201).json(attempt);
});

export const getAttemptById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const attempt = await service.getAttemptById(id);
  res.status(200).json(attempt);
});

export const getAttemptsByTest = asyncHandler(async (req, res) => {
  const { onlineTestId } = req.params;
  const attempts = await service.getAttemptsByTest(onlineTestId);
  res.status(200).json(attempts);
});

export const getAttemptsByStudent = asyncHandler(async (req, res) => {
  const { studentId } = req.params;
  const attempts = await service.getAttemptsByStudent(studentId);
  res.status(200).json(attempts);
});
