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

  shift: Joi.number()
    .integer()
    .valid(1, 2, 3, 4)
    .required()
    .messages({
      "any.required": "Vui lòng chọn ca học",
      "any.only": "Giá trị ca học không hợp lệ (chỉ từ Ca 1 đến Ca 4)",
    }),
});

export const createClassSchema = Joi.object({
  name: Joi.string().trim().required().messages({
    "any.required": "Tên lớp không được để trống",
  }),

  schedule: Joi.array()
    .items(scheduleItemSchema)
    .length(1)
    .required()
    .messages({
      "array.base": "Lịch học phải là danh sách hợp lệ",
      "array.length": "Mỗi lớp chỉ được có 1 buổi học/tuần",
    }),

  course: Joi.string().required().messages({
    "any.required": "Vui lòng chọn môn học",
  }),

  semester: Joi.string().required().messages({
    "any.required": "Vui lòng chọn học kỳ",
  }),

  teacher: Joi.string().required().messages({
    "any.required": "Vui lòng chọn giảng viên",
  }),
});

export const updateClassSchema = Joi.object({
  name: Joi.string().allow(null, ""),

  schedule: Joi.array()
    .items(scheduleItemSchema)
    .max(1) 
    .allow(null)
    .messages({
      "array.base": "Lịch học phải là danh sách hợp lệ",
      "array.max": "Lớp học chỉ được có tối đa 1 buổi/tuần",
    }),

  course: Joi.string().allow(null, ""),
  semester: Joi.string().allow(null, ""),
  teacher: Joi.string().allow(null, ""),
});
