import Material from "../model/material.js";
import Class from "../model/class.js";
import User from "../model/user.js";

export const getAll = async () => {
  const materials = await Material.find().sort({ createdAt: -1 });
  return materials;
};

export const findById = async (id) => {
  const material = await Material.findById(id);
  if (!material) {
    const error = new Error("Announcement with id ${id} not found");
    error.statusCode = 404;
    throw error;
  }
  return material;
};

export const getClassMaterial = async (class_id) => {
  const materials = await Material.find({ class: class_id }).sort({
    createdAt: -1,
  });
  return materials;
};

export const createMaterial = async (data) => {
  console.log(data);
  const [postingClass, poster] = await Promise.all([
    Class.findById(data.class),
    User.findOne({ _id: data.upload_by, available: "true" }),
  ]);
  console.log(postingClass, poster);

  if (!postingClass || !poster) {
    const error = new Error("Invalid class or user id");
    error.statusCode = 404;
    throw error;
    q;
  }

  const material = await Material.create({ ...data });

  return material;
};

export const deleteMaterial = async (id) => {
  const material = await Material.findByIdAndDelete(id);
  if (!material) {
    const error = new Error(`Material with id ${id} not found`);
    error.statusCode = 404;
    throw error;
  }
  return material;
};
