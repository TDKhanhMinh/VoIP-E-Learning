import request from "supertest";
import express from "express";
import mongoose from "mongoose"; 
import testQuestionRoutes from "../../../src/router/testQuestionRouter.js";
import { connectTestDB, closeTestDB, clearTestDB } from "../setup.js";

const app = express();
app.use(express.json());
app.use("/api/test-question", testQuestionRoutes);

describe("Test Question Routes", () => {
  beforeAll(async () => await connectTestDB());
  afterAll(async () => await closeTestDB());
  afterEach(async () => await clearTestDB());

  const mockTestId = new mongoose.Types.ObjectId();

  describe("GET /api/test-question", () => {
    it("should get all test questions", async () => {
      const res = await request(app).get("/api/test-question");
      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
    });
  });

  describe("GET /api/test-question/test/:testId", () => {
    it("should get questions by test id", async () => {
      const res = await request(app).get(
        `/api/test-question/test/${mockTestId}`
      );
      expect(res.status).toBe(200);
    });
  });

  describe("POST /api/test-question", () => {
    it("should create test question", async () => {
      const questionData = {
        test: mockTestId,
        question: "What is 2+2?",
        options: [
          { answer: "3", isCorrect: false },
          { answer: "4", isCorrect: true },
          { answer: "5", isCorrect: false },
        ],
      };

      const res = await request(app)
        .post("/api/test-question")
        .send(questionData);

      expect(res.status).toBe(201);
      expect(res.body).toHaveProperty("_id");
      expect(res.body.question).toBe("What is 2+2?");
    });
  });

  describe("PUT /api/test-question/:id", () => {
    it("should update test question", async () => {
      const TestQuestion = (await import("../../../src/model/testQuestion.js"))
        .default;

      const question = await TestQuestion.create({
        test: mockTestId,
        question: "What is 2+2?",
        options: [
          { answer: "3", isCorrect: false },
          { answer: "4", isCorrect: true },
          { answer: "5", isCorrect: false },
        ],
      });

      const res = await request(app)
        .put(`/api/test-question/${question._id}`)
        .send({
          question: "What is 3+3?",
          options: [
            { answer: "5", isCorrect: false },
            { answer: "6", isCorrect: true },
            { answer: "7", isCorrect: false },
          ],
        });

      expect(res.status).toBe(200);
      expect(res.body.question).toBe("What is 3+3?");
    });
  });
});
