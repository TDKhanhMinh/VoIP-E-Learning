import * as service from "../service/onlineTestService.js";
import { asyncHandler } from "../middlewares/asyncHandler.js";
export const getAllOnlineTests = asyncHandler(async (req, res) => {
  const tests = await service.getAll();
  res.status(200).json(tests);
});

export const getClassOnlineTests = asyncHandler(async (req, res) => {
  const { classId } = req.params;
  const tests = await service.getClassTests(classId);
  res.status(200).json(tests);
});

export const getStudentOnlineTests = asyncHandler(async (req, res) => {
  const studentId = req.user._id;
  const tests = await service.getStudentTests(studentId);
  res.status(200).json(tests);
});

export const getOnlineTestById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const test = await service.getById(id);
  res.status(200).json(test);
});

export const createOnlineTest = asyncHandler(async (req, res) => {
  const teacher = req.user._id;
  req.body.teacher = teacher;
  const test = await service.createTest(req.body);
  res.status(201).json(test);
});

export const updateOnlineTest = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const test = await service.updateTest(id, req.body);
  res.status(200).json(test);
});

export const updateOnlineTestQuestions = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { questions } = req.body;
  await service.updateTestQuestions(id, questions);
  res.status(200).json({ message: "Cập nhật câu hỏi thành công" });
});

export const deleteOnlineTest = asyncHandler(async (req, res) => {
  const { id } = req.params;
  await service.deleteTest(id);
  res.status(204).send();
});
