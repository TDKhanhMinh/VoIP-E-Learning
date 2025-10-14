import Announcement from "../model/announcement.js";
import Class from "../model/class.js";
import User from "../model/user.js";

export const getAll = async () => {
  const announcements = await Announcement.find()
    .populate("class", "name code")
    .populate("created_by", "full_name email")
    .sort({ createdAt: -1 });
  return announcements;
};

export const findById = async (id) => {
  const announcement = await Announcement.findById(id)
    .populate("class", "name code")
    .populate("created_by", "full_name email");
  if (!announcement) {
    const error = new Error(`Announcement with id ${id} not found`);
    error.statusCode = 404;
    throw error;
  }
  return announcement;
};

export const getByClass = async (classId) => {
  const cls = await Class.findById(classId);
  if (!cls) {
    const error = new Error(`Class with id ${classId} not found`);
    error.statusCode = 404;
    throw error;
  }

  const announcements = await Announcement.find({ class: classId })
    .populate("class", "name code")
    .populate("created_by", "full_name email")
    .sort({ createdAt: -1 });

  return announcements || [];
};

export const getByCreator = async (creatorId) => {
  const creator = await User.findById(creatorId);
  if (!creator) {
    const error = new Error(`User with id ${creatorId} not found`);
    error.statusCode = 404;
    throw error;
  }

  const announcements = await Announcement.find({ created_by: creatorId })
    .populate("class", "name code")
    .populate("created_by", "full_name email").sort({ createdAt: -1 });

  return announcements || [];
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
  const announcement = await Announcement.create({ ...data });
  return announcement;
};

export const updateAnnouncement = async (id, data) => {
  const updates = { ...data };
  Object.keys(updates).forEach((key) => {
    if (updates[key] == null) delete updates[key];
  });

  const announcement = await Announcement.findByIdAndUpdate(
    id,
    { $set: updates },
    { new: true }
  );

  if (!announcement) {
    const error = new Error(`Announcement with id ${id} not found`);
    error.statusCode = 404;
    throw error;
  }
  return announcement;
};

export const deleteAnnouncement = async (id) => {
  const announcement = await Announcement.findByIdAndDelete(id);
  if (!announcement) {
    const error = new Error(`Announcement with id ${id} not found`);
    error.statusCode = 404;
    throw error;
  }
  return announcement;
};
