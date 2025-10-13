import { asyncHandler } from "../middlewares/asyncHandler.js";
import * as service from "../service/attendanceService.js";

export const getAll = asyncHandler(async (req, res) => {
  const attendances = await service.getAll();
  res.status(200).json(attendances);
});

export const findById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const attendances = await service.findByClassId(id);
  res.status(200).json(attendances);
});
export const findByStudentId = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const attendances = await service.findByStudentId(id);
  res.status(200).json(attendances);
});
export const createAttendance = asyncHandler(async (req, res) => {
  const data = req.body;
  const attendance = await service.createAttendance(data);
  res.status(201).json(attendance);
});

export const updateAttendance = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const data = req.body;
  const attendance = await service.updateAttendance(id, data);
  res.status(201).json(attendance);
});

export const deleteAttendance = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const attendance = await service.deleteAttendance(id);
  res.status(200).json(attendance);
});

