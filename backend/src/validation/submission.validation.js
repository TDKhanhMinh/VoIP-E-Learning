import Joi from "joi";

export const createSubmissionSchema = Joi.object({
  assignment: Joi.string().required(),
  file_url: Joi.string().required(),
  file_name: Joi.string().optional(),
  student: Joi.string().required(),

});

export const updateSubmissionSchema = Joi.object({
  score: Joi.number().min(0).max(10).required(),
  feedback: Joi.string().required(),
});
