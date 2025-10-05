import Joi from "joi";

export const createUserSchema = Joi.object({
  full_name: Joi.string().required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  role: Joi.valid("teacher", "student").default("student"),
});

export const updateUserSchema = Joi.object({
  full_name: Joi.string().allow(null),
  email: Joi.string().email().allow(null),
  password: Joi.string().min(6).allow(null),
  available: Joi.bool().allow("null"),
  role: Joi.valid("student", "teacher").default("student").allow(null),
});
