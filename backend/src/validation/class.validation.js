import Joi from "joi";

const scheduleItemSchema = Joi.object({
  dayOfWeek: Joi.number()
    .integer()
    .valid(2, 3, 4, 5, 6, 7)
    .required()
    .messages({
      "any.required": "Vui lòng chọn thứ trong tuần",
      "any.only": "Giá trị thứ không hợp lệ (chỉ Thứ 2 đến Thứ 7)",
    }),

  shift: Joi.number().integer().valid(1, 2, 3, 4).required().messages({
    "any.required": "Vui lòng chọn ca học",
    "any.only": "Giá trị ca học không hợp lệ (chỉ từ Ca 1 đến Ca 4)",
  }),
  type: Joi.string().valid("theory", "practice").required().messages({
    "any.required": "Vui lòng chọn loại hình học",
    "any.only": "Loại ca học không hợp lệ",
  }),
  room: Joi.string().trim().required().messages({
    "any.required": "Vui lòng nhập phòng học",
  }),
});

export const createClassSchema = Joi.object({
  name: Joi.string().trim().required().messages({
    "any.required": "Tên lớp không được để trống",
  }),

  schedule: Joi.array().items(scheduleItemSchema).required().messages({
    "array.base": "Lịch học phải là danh sách hợp lệ",
  }),

  course: Joi.string().required().messages({
    "any.required": "Vui lòng chọn môn học",
  }),

  semester: Joi.string().required().messages({
    "any.required": "Vui lòng chọn học kỳ",
  }),

  theoryWeeks: Joi.number().integer().min(0).required().messages({
    "any.required": "Vui lòng nhập số tuần học lý thuyết",
    "number.base": "Số tuần học lý thuyết phải là một số",
    "number.min": "Số tuần học lý thuyết không được âm",
  }),
  practiceWeeks: Joi.number().integer().min(0).allow(null).messages({
    "any.required": "Vui lòng nhập số tuần học thực hành",
    "number.base": "Số tuần học thực hành phải là một số",
    "number.min": "Số tuần học thực hành không được âm",
  }),

  teacher: Joi.string().required().messages({
    "any.required": "Vui lòng chọn giảng viên",
  }),
});

export const updateClassSchema = Joi.object({
  name: Joi.string().allow(null, ""),

  schedule: Joi.array().items(scheduleItemSchema).allow(null).messages({
    "array.base": "Lịch học phải là danh sách hợp lệ",
  }),

  course: Joi.string().allow(null, ""),
  semester: Joi.string().allow(null, ""),
  teacher: Joi.string().allow(null, ""),
  theoryWeeks: Joi.number().integer().min(0).allow(null).messages({
    "number.base": "Số tuần học lý thuyết phải là một số",
    "number.min": "Số tuần học lý thuyết không được âm",
  }),

  practiceWeeks: Joi.number().integer().min(0).allow(null).messages({
    "number.base": "Số tuần học thực hành phải là một số",
    "number.min": "Số tuần học thực hành không được âm",
  }),
});
