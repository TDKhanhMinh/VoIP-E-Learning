import request from "supertest";
import express from "express";
import onlineTestRoutes from "../../../src/router/testOnlineRouter.js";
import {
  connectTestDB,
  closeTestDB,
  clearTestDB,
  createAuthToken,
  createTestUser,
} from "../setup.js";
import { errorHandler } from "../../../src/middlewares/errorHandler.js";
const app = express();
app.use(express.json());
app.use("/api/online-test", onlineTestRoutes);
app.use(errorHandler);

describe("Online Test Routes", () => {
  beforeAll(async () => await connectTestDB());
  afterAll(async () => await closeTestDB());
  afterEach(async () => await clearTestDB());

  let teacherToken, studentToken;

  beforeEach(async () => {
    const teacher = await createTestUser("teacher");
    const student = await createTestUser("student");
    teacherToken = createAuthToken(teacher._id, teacher.email, "teacher");
    studentToken = createAuthToken(student._id, student.email, "student");
  });

  describe("GET /api/online-test", () => {
    it("should get all online tests", async () => {
      const res = await request(app).get("/api/online-test");
      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
    });
  });

  describe("POST /api/online-test", () => {
    it("should create test as teacher", async () => {
      const testData = {
        title: "Test Quiz",
        description: "Test Description",
        available: true,
        start: new Date(),
        end: new Date(Date.now() + 86400000),
        time: "60",
        attempts: 1,
      };

      const res = await request(app)
        .post("/api/online-test")
        .set("Authorization", `Bearer ${teacherToken}`)
        .send(testData);

      expect(res.status).toBe(201);
    });

    it("should reject student creating test", async () => {
      const res = await request(app)
        .post("/api/online-test")
        .set("Authorization", `Bearer ${studentToken}`)
        .send({ title: "Test" });

      expect(res.status).toBe(403);
    });
  });

  describe("GET /api/online-test/student", () => {
    it("should get student tests", async () => {
      const res = await request(app)
        .get("/api/online-test/student")
        .set("Authorization", `Bearer ${studentToken}`);

      expect(res.status).toBe(200);
    });
  });

  describe("PUT /api/online-test/:id/questions", () => {
    it("should update test questions as teacher", async () => {
      const OnlineTest = (await import("../../../src/model/online_test.js"))
        .default;
      const teacher = await createTestUser("teacher");
      const test = await OnlineTest.create({
        title: "Test",
        teacher: teacher._id,
        start: new Date(),
        end: new Date(Date.now() + 86400000),
        time: "60",
        attempts: 1,
      });

      const questions = [
        {
          question: "Q1",
          options: [
            { answer: "A", isCorrect: true },
            { answer: "B", isCorrect: false },
          ],
        },
      ];

      const res = await request(app)
        .put(`/api/online-test/${test._id}/questions`)
        .set("Authorization", `Bearer ${teacherToken}`)
        .send({ questions });

      expect(res.status).toBe(200);
    });
  });
});
