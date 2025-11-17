import * as service from "../service/testSessionService.js";
import { asyncHandler } from "../middlewares/asyncHandler.js";

export const getTestSessionById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const session = await service.getTestSessionById(id);
  res.status(200).json(session);
});

export const createTestSession = asyncHandler(async (req, res) => {
  const session = await service.createTestSession(req.body);
  res.status(201).json(session);
});

export const updateTestSession = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const session = await service.updateTestSession(id, req.body);
  res.status(200).json(session);
});

export const deleteTestSession = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const session = await service.deleteTestSession(id);
  res.status(200).json(session);
});

export const getTestSessionsByTestAndStudent = asyncHandler(
  async (req, res) => {
    const { testId } = req.params;
    const studentId = req.user._id;
    const sessions = await service.getTestSessionsByTestAndStudent(
      testId,
      studentId
    );
    res.status(200).json(sessions);
  }
);
