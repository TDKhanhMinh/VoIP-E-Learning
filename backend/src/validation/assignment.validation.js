import Joi from "joi";

export const createAssignmentSchema = Joi.object({
  title: Joi.string().required(),
  description: Joi.string().required(),
  class: Joi.string().required(),
  due_at: Joi.date().required(),
});

export const updateAssignmentSchema = Joi.object({
  title: Joi.string().allow(null),
  description: Joi.string().allow(null),
  class: Joi.string().allow(null),
  due_at: Joi.date().allow(null),
});
