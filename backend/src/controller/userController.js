import * as service from "../service/userService.js";
import { asyncHandler } from "../middlewares/asyncHandler.js";

export const getAllUser = asyncHandler(async (req, res) => {
  const users = await service.getAllUser();
  res.status(200).json(users);
});

export const createUser = asyncHandler(async (req, res) => {
  const data = req.body;
  const user = await service.createUser(data);
  res.status(201).json(user);
});

export const updateUser = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const data = req.body;
  const user = await service.updateUser(id, data);
  res.status(200).json(user);
});

export const deleteUser = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const user = await service.deleteUser(id);
  res.status(200).json(user);
});
