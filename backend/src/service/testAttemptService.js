import OnlineTest from "../model/online_test.js";
import TestAttempt from "../model/testAttempt.js";
import TestQuestion from "../model/testQuestion.js";
import TestSession from "../model/TestSession.js";

export const getAttemptsByStudentAndTest = async (studentId, onlineTestId) => {
  const attempts = await TestAttempt.find({
    student: studentId,
    onlineTest: onlineTestId,
  }).sort({ createdAt: -1 });
  return attempts;
};

export const checkAttempt = async (studentId, onlineTestId) => {
  const attempt = await TestAttempt.find({
    student: studentId,
    onlineTest: onlineTestId,
  });
  const test = await OnlineTest.findById(onlineTestId);

  if (!test) {
    throw new Error("Online test not found");
  }

  if (attempt && attempt.length >= test.attempts) {
    return false;
  }
  return true;
};

export const createTestAttempt = async (sessionId) => {
  const testSession = await TestSession.findById(sessionId);
  if (!testSession) {
    throw new Error("Test session not found");
  }

  const scoreData = await calculateScore(sessionId);

  const data = {
    onlineTest: testSession.test,
    student: testSession.student,
    score: scoreData.score,
    correctAnswers: scoreData.correctCount,
    totalQuestions: scoreData.totalQuestions,
    submitedAt: new Date(),
  };

  const attempt = new TestAttempt(data);
  await attempt.save();
  await TestSession.findByIdAndDelete(sessionId);
  return attempt;
};

export const getAttemptById = async (id) => {
  const attempt = await TestAttempt.findById(id)
    .populate("student", "full_name email")
    .populate("onlineTest", "title class");
  return attempt;
};

export const getAttemptsByTest = async (onlineTestId) => {
  const attempts = await TestAttempt.find({ onlineTest: onlineTestId })
    .populate("student", "full_name email")
    .sort({ createdAt: -1 });
  return attempts;
};

export const getAttemptsByStudent = async (studentId) => {
  const attempts = await TestAttempt.find({ student: studentId })
    .populate("onlineTest", "title class")
    .sort({ createdAt: -1 });
  return attempts;
};

const calculateScore = async (testSessionId) => {
  const session = await TestSession.findById(testSessionId);
  if (!session) throw new Error("Test session not found");

  const testQuestions = await TestQuestion.find({ test: session.test });

  let correctCount = 0;

  for (const userAnswer of session.questions) {
    const question = testQuestions.find(
      (q) => q._id.toString() === userAnswer.questionId.toString()
    );

    if (!question) continue;

    const correctOption = question.options.find((opt) => opt.isCorrect);
    if (
      correctOption &&
      correctOption._id.toString() === userAnswer.selectedOptionId?.toString()
    ) {
      correctCount++;
    }
  }

  const totalQuestions = testQuestions.length;
  const score = totalQuestions ? (correctCount / totalQuestions) * 10 : 0;

  return {
    totalQuestions,
    correctCount,
    score: Number(score.toFixed(2)),
  };
};
