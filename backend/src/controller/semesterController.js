import * as service from "../service/semesterService.js";
import { asyncHandler } from "../middlewares/asyncHandler.js";

export const getAll = asyncHandler(async (req, res) => {
  const semesters = await service.getAll();
  res.status(200).json(semesters);
});

export const createSemester = asyncHandler(async (req, res) => {
  const data = req.body;
  const semester = await service.createSemester(data);
  res.status(201).json(semester);
});

export const updateSemester = asyncHandler(async (req, res) => {
  const data = req.body;
  const { id } = req.params;
  const semester = await service.updateSemester(id, data);
  res.status(200).json(semester);
});

export const deleteSemester = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const semester = await service.deleteSemester(id);
  res.status(200).json(semester);
});
