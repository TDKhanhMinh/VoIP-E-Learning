import Joi from "joi";

export const createSemesterSchema = Joi.object({
  name: Joi.string().required(),
  start_date: Joi.date().required(),
  end_date: Joi.date().required(),
});

export const updateSemesterSchema = Joi.object({
  name: Joi.string().allow(null),
  start_date: Joi.date().allow(null),
  end_date: Joi.date().allow(null),
});
