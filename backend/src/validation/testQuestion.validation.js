import Joi from "joi";

export const testQuestionSchema = Joi.object({
  test: Joi.string().required(),
  question: Joi.string().required(),
  options: Joi.array()
    .items(
      Joi.object({
        answer: Joi.string().required(),
        isCorrect: Joi.boolean().required(),
      })
    )
    .min(1)
    .custom((value, helpers) => {
      const hasCorrect = value.some((opt) => opt.isCorrect === true);

      if (!hasCorrect) {
        return helpers.error("array.noCorrectAnswer");
      }

      return value;
    })
    .messages({
      "array.noCorrectAnswer": "Phải có ít nhất một đáp án đúng.",
    })
    .required(),

  image: Joi.string().uri().optional().allow(null, ""),
});
