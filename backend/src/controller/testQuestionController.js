import * as service from "../service/testQuestionService.js";
import { asyncHandler } from "../middlewares/asyncHandler.js";

export const getAllTestQuestions = asyncHandler(async (req, res) => {
  const questions = await service.getAll();
  res.status(200).json(questions);
});

export const getQuestionsByTestId = asyncHandler(async (req, res) => {
  const { testId } = req.params;
  const questions = await service.getQuestionByTestId(testId);
  res.status(200).json(questions);
});

export const createTestQuestion = asyncHandler(async (req, res) => {
  const question = await service.createQuestion(req.body);
  res.status(201).json(question);
});

export const updateTestQuestion = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const question = await service.updateQuestion(id, req.body);
  res.status(200).json(question);
});

export const deleteTestQuestion = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const question = await service.deleteQuestion(id);
  res.status(200).json(question);
});
