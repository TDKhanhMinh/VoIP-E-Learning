import Joi from "joi";

export const onlineTestSchema = Joi.object({
  class: Joi.string().allow(null, ""),
  title: Joi.string().required(),
  available: Joi.bool().default(true),
  start: Joi.date().required(),
  end: Joi.date().required(),
  time: Joi.string().required(),
  attempts: Joi.number().required(),
  description: Joi.string().allow(null, ""),
});
