import Joi from "joi";

export const createClassStudentSchema = Joi.object({
  class: Joi.string().required(),
  student: Joi.string().required(),
});
