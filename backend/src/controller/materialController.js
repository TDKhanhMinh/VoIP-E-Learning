import { asyncHandler } from "../middlewares/asyncHandler.js";
import * as service from "../service/materialService.js";

export const getAll = asyncHandler(async (req, res) => {
  const materials = await service.getAll();
  res.status(200).json(materials);
});

export const getClassMaterial = asyncHandler(async (req, res) => {
  const { class_id } = req.params;
  const materials = await service.getClassMaterial(class_id);
  res.status(200).json(materials);
});

export const createMaterial = asyncHandler(async (req, res) => {
  const data = req.body;
  const user_id = req.user._id;
  data.upload_by = user_id;
  const material = await service.createMaterial(data);
  res.status(201).json(material);
});

export const deleteMaterial = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const material = await service.deleteMaterial(id);
  res.status(200).json(material);
});
