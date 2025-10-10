import Joi from "joi";

export const createAttendanceSchema = Joi.object({
  class: Joi.string().required(),
  student: Joi.string().required(),
  lesson: Joi.number().min(1).default(1),
  status: Joi.string().valid("present", "absent", "late").default("present"),
});

export const updateAttendanceSchema = Joi.object({
  status: Joi.string().valid("present", "absent", "late").required(),
});
export const createMultipleAttendanceSchema = Joi.object({
  class: Joi.string().required(),
  attendances: Joi.array()
    .items(
      Joi.object({
        student: Joi.string().required(),
        lesson: Joi.number().min(1).optional(),
        status: Joi.string().valid("present", "absent", "late").default("present"),
      })
    )
    .min(1)
    .required(),
});