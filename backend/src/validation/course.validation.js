import Joi from "joi";

export const createCourseSchema = Joi.object({
  code: Joi.string().required(),
  title: Joi.string().required(),
  description: Joi.string().required(),
});

export const updateCourseSchema = Joi.object({
  code: Joi.string().allow(null),
  title: Joi.string().allow(null),
  description: Joi.string().allow(null),
});
