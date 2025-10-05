import Joi from "joi";

export const createMaterialSchema = Joi.object({
  title: Joi.string().required(),
  file_url: Joi.string().required(),
  class: Joi.string().required(),
});
