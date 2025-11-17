import TestQuestion from "../model/testQuestion.js";

export const getAll = async () => {
  const testQuestions = await TestQuestion.find().sort({ createdAt: -1 });
  return testQuestions;
};

export const getQuestionByTestId = async (testId) => {
  const questions = await TestQuestion.find({ test: testId }).sort({
    createdAt: -1,
  });
  return questions;
};

export const createQuestion = async (data) => {
  const newQuestion = new TestQuestion(data);
  await newQuestion.save();
  return newQuestion;
};

export const updateQuestion = async (id, data) => {
  const updatedQuestion = await TestQuestion.findByIdAndUpdate(id, data, {
    new: true,
  });
  return updatedQuestion;
};

export const deleteQuestion = async (id) => {
  const deletedQuestion = await TestQuestion.findByIdAndDelete(id);
  return deletedQuestion;
};

export const deleteQuestionsByTestId = async (testId) => {
  const result = await TestQuestion.deleteMany({ test: testId });
  return result;
};
