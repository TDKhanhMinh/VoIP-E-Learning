import Annoucement from "../model/announcement.js";
import Class from "../model/class.js";
import User from "../model/user.js";

export const getAll = async () => {
  const announcements = await Annoucement.find().sort({ createdAt: -1 });
  return announcements;
};

export const findById = async (id) => {
  const announcement = await Annoucement.findById(id);
  if (!announcement) {
    const error = new Error("Announcement with id ${id} not found");
    error.statusCode = 404;
    throw error;
  }
  return announcement;
};

export const createAnnouncement = async (data) => {
  const [announcingClass, creator] = await Promise.all([
    Class.findById(data.class),
    User.findById(data.created_by),
  ]);
  if (!announcingClass || !creator) {
    const error = new Error("Invalid class or creator");
    error.statusCode = 404;
    throw error;
  }
  const announcement = await Annoucement.create({ ...data });
  return announcement;
};

export const updateAnnouncement = async (id, data) => {
  const updates = { ...data };
  Object.keys(updates).forEach((key) => {
    updates[key] == null && delete updates[key];
  });

  const announcement = await Annoucement.findByIdAndUpdate(
    id,
    { $set: updates },
    { $new: true }
  );
  if (!announcement) {
    const error = new Error(`Announcement with id ${id} not found`);
    error.statusCode = 404;
    throw error;
  }
  return announcement;
};

export const deleteAnnouncement = async (id) => {
  const announcement = await Annoucement.findByIdAndDelete(id);
  if (!announcement) {
    const error = new Error(`Announcement with id ${id} not found`);
    error.statusCode = 404;
    throw error;
  }
  return announcement;
};
