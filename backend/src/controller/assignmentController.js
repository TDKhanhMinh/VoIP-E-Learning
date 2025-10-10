import * as service from "../service/assignmentService.js";
import { asyncHandler } from "../middlewares/asyncHandler.js";

export const getAll = asyncHandler(async (req, res) => {
  const assignments = await service.getAll();
  res.status(200).json(assignments);
});

export const findById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const announcement = await service.findById(id);
  res.status(200).json(announcement);
});
export const findByClassId = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const announcement = await service.getAssignmentByClassId(id);
  res.status(200).json(announcement);
});
export const createAssignment = asyncHandler(async (req, res) => {
  const data = req.body;
  const assignment = await service.createAssignment(data);
  res.status(201).json(assignment);
});

export const updateAssignment = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const data = req.body;
  const assignment = await service.updateAssignment(id, data);
  res.status(200).json(assignment);
});

export const deleteAssignment = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const assignment = await service.deleteAssignment(id);
  res.status(200).json(assignment);
});
