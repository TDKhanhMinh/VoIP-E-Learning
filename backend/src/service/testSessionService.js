import OnlineTest from "../model/online_test.js";
import mongoose from "mongoose";
import { createTestAttempt } from "./testAttemptService.js";
import { checkAttempt } from "./testAttemptService.js";
import TestSession from "../model/TestSession.js";

function shuffle(array) {
  let currentIndex = array.length;
  while (currentIndex !== 0) {
    const randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex],
      array[currentIndex],
    ];
  }
  return array;
}

export const createTestSession = async (data) => {
  const tests = await OnlineTest.aggregate([
    { $match: { _id: new mongoose.Types.ObjectId(data.test) } },
    {
      $lookup: {
        from: "testquestions",
        localField: "_id",
        foreignField: "test",
        as: "questions",
      },
    },
    { $limit: 1 },
  ]);

  const test = tests[0];
  if (!test) throw new Error("Test not found");

  const randomizedQuestions = shuffle(
    test.questions.map((q) => ({
      questionId: q._id,
      question: q.question,
      image: q.image,
      options: shuffle(
        q.options.map((o) => ({
          optionId: o._id,
          answer: o.answer,
          isCorrect: o.isCorrect,
        }))
      ),
      selectedOptionId: null,
    }))
  );

  const newSession = new TestSession({
    ...data,
    remainingTime: test.time * 60,
    questions: randomizedQuestions,
    startedAt: new Date(),
    finished: false,
  });

  await newSession.save();
  return newSession;
};

export const getTestSessionById = async (id) => {
  const session = await TestSession.findById(id);
  return session;
};

export const updateTestSession = async (id, data) => {
  const session = await TestSession.findById(id);
  if (!session) throw new Error("Test session not found");

  for (const q of data.questions) {
    const existing = session.questions.find(
      (item) => item.questionId.toString() === q.questionId
    );

    if (existing) {
      existing.selectedOptionId = q.selectedOptionId;
    }
  }

  await session.save();
  return session;
};

export const deleteTestSession = async (id) => {
  const deletedSession = await TestSession.findByIdAndDelete(id);
  return deletedSession;
};

export const getTestSessionsByTestAndStudent = async (testId, studentId) => {
  const testObjectId = new mongoose.Types.ObjectId(testId);
  const studentObjectId = new mongoose.Types.ObjectId(studentId);

  const canAttempt = await checkAttempt(studentId, testId);
  if (!canAttempt) {
    throw new Error("Maximum number of attempts reached");
  }

  let sessions = await TestSession.find({
    test: testObjectId,
    student: studentObjectId,
    finished: false,
  });

  if (sessions.length === 0) {
    const newSession = await createTestSession({
      test: testObjectId,
      student: studentObjectId,
      startedAt: new Date(),
      questions: [],
      finished: false,
    });
    sessions = [newSession];
  }

  return sessions;
};

export const autoSubmitExpiredSessions = async () => {
  const now = new Date();
  const sessions = await TestSession.find({ finished: false });

  for (const session of sessions) {
    const test = await OnlineTest.findById(session.test);
    if (!test) continue;

    const elapsed = (now - session.startedAt) / 1000;
    const totalTime = test.time * 60;

    if (elapsed >= totalTime) {
      try {
        await createTestAttempt(session._id);
        console.log(`Session ${session._id} auto-submitted`);
      } catch (err) {
        console.error(`Error auto-submitting session ${session._id}:`, err);
      }
    }
  }
};
