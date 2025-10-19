import { asyncHandler } from "../middlewares/asyncHandler.js";
import * as service from "../service/classStudentService.js";

export const getClassStudents = asyncHandler(async (req, res) => {
  const { class_id } = req.params;
  const classStudents = await service.getClassStudents(class_id);
  res.status(200).json(classStudents);
});
export const getAll = asyncHandler(async (req, res) => {
  const classStudents = await service.getAllEnrollments();
  res.status(200).json(classStudents);
});
export const findById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const announcement = await service.findById(id);
  res.status(200).json(announcement);
});
export const findByStudentId = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const announcement = await service.findByStudentId(id);
  res.status(200).json(announcement);
});

export const createClassStudent = asyncHandler(async (req, res) => {
  const data = req.body;
  const classStudent = await service.createClassStudent(data);
  res.status(201).json(classStudent);
});

export const deleteClassStudent = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const classStudent = await service.deleteClassStudent(id);
  res.status(200).json(classStudent);
});
