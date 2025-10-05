import Joi from "joi";

export const createClassSchema = Joi.object({
  name: Joi.string().required(),
  schedule: Joi.string().required(),
  course: Joi.string().required(),
  semester: Joi.string().required(),
  teacher: Joi.string().required(),
});

export const updateClassSchema = Joi.object({
  name: Joi.string().allow(null),
  schedule: Joi.string().allow(null),
  course: Joi.string().allow(null),
  semester: Joi.string().allow(null),
  teacher: Joi.string().allow(null),
});
