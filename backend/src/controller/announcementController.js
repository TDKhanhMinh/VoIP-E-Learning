import { asyncHandler } from "../middlewares/asyncHandler.js";
import * as service from "../service/announcementService.js";

export const getAll = asyncHandler(async (req, res) => {
  const announcements = await service.getAll();
  res.status(200).json(announcements);
});

export const createAnnouncement = asyncHandler(async (req, res) => {
  const data = req.body;
  const user_id = req.user._id;
  data.created_by = user_id;
  const announcement = await service.createAnnouncement(data);
  res.status(201).json(announcement);
});

export const updateAnnouncement = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const data = req.body;
  const announcement = await service.updateAnnouncement(id, data);
  res.status(200).json(announcement);
});

export const deleteAnnouncement = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const announcement = await service.deleteAnnouncement(id);
  res.status(200).json(announcement);
});
