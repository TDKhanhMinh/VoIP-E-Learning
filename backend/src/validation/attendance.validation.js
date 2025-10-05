import Joi from "joi";

export const createAttendanceSchema = Joi.object({
  class: Joi.string().required(),
  student: Joi.string().required(),
  lession: Joi.number().min(1),
  status: Joi.string().valid("present", "absent", "late").default("absent"),
});

export const updateAttendanceSchema = Joi.object({
  status: Joi.string().valid("present", "absent", "late").required(),
});
