import Joi from "joi";

export const createAnnouncementSchema = Joi.object({
  class: Joi.string().required(),
  title: Joi.string().required(),
  content: Joi.string().required(),
  created_by: Joi.string().optional()
});

export const updateAnnouncementSchema = Joi.object({
  title: Joi.string().allow(null),
  content: Joi.string().allow(null),
});

