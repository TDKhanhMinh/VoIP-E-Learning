import Joi from "joi";

export const createSemesterSchema = Joi.object({
  name: Joi.string().required(),
  start_date: Joi.date().required(),
  end_date: Joi.date().required(),

  mid_term: Joi.object({
    start_date: Joi.date().required().min(Joi.ref("/start_date")),
    end_date: Joi.date()
      .required()
      .max(Joi.ref("/end_date"))
      .greater(Joi.ref("start_date")),
  }).required(),
});

export const updateSemesterSchema = Joi.object({
  name: Joi.string().allow(null),
  start_date: Joi.date().allow(null),
  end_date: Joi.date().allow(null),
  mid_term: Joi.object({
    start_date: Joi.date().allow(null),
    end_date: Joi.date().allow(null),
  }).allow(null),
});
