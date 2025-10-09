import * as service from "../service/classService.js";
import { asyncHandler } from "../middlewares/asyncHandler.js";

export const getAll = asyncHandler(async (req, res) => {
  const classes = await service.getAll();
  res.status(200).json(classes);
});

export const findById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const announcement = await service.findById(id);
  res.status(200).json(announcement);
});

export const createClass = asyncHandler(async (req, res) => {
  const data = req.body;
  console.log(data);
  const newClass = await service.createClass(data);
  res.status(201).json(newClass);
});

export const updateClass = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const data = req.body;
  const updatedClass = await service.updateClass(id, data);
  res.status(200).json(updatedClass);
});

export const deleteClass = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const deletedClass = await service.deleteClass(id);
  res.status(200).json(deletedClass);
});
