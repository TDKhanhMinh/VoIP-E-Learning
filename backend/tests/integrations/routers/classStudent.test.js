import request from "supertest";
import express from "express";
import classStudentRoutes from "../../../src/router/classStudentRouter.js";
import {
  connectTestDB,
  closeTestDB,
  clearTestDB,
  createAuthToken,
  createTestUser,
} from "../setup.js";
import mongoose from "mongoose";
import { errorHandler } from "../../../src/middlewares/errorHandler.js";
const app = express();
app.use(express.json());
app.use("/api/class-student", classStudentRoutes);
app.use(errorHandler);

describe("ClassStudent Routes", () => {
  beforeAll(async () => await connectTestDB());
  afterAll(async () => await closeTestDB());
  afterEach(async () => await clearTestDB());

  let teacherToken, studentUser;

  beforeEach(async () => {
    const teacher = await createTestUser("teacher");
    studentUser = await createTestUser("student");
    teacherToken = createAuthToken(teacher._id, teacher.email, "teacher");
  });

  describe("GET /api/class-student", () => {
    it("should get all class students", async () => {
      const res = await request(app).get("/api/class-student");
      expect(res.status).toBe(200);
    });
  });

  describe("POST /api/class-student", () => {
    it("should create class student as teacher", async () => {
      const Class = (await import("../../../src/model/class.js")).default;
      const teacher = await createTestUser("teacher");
      const testClass = await Class.create({
        name: "Test Class",
        teacher: teacher._id,
        schedule: [
          {
            dayOfWeek: 2,
            shift: 1,
            type: "theory",
            room: "A101",
          },
        ],
        semester: new mongoose.Types.ObjectId(),
        course: new mongoose.Types.ObjectId(),
        theoryWeeks: 15,
        practiceWeeks: 0,
      });

      const classStudentData = {
        student: studentUser._id,
        class: testClass._id,
      };

      const res = await request(app)
        .post("/api/class-student")
        .set("Authorization", `Bearer ${teacherToken}`)
        .send(classStudentData);

      expect(res.status).toBe(201);
    });
  });

  describe("GET /api/class-student/class/:class_id", () => {
    it("should get students by class id", async () => {
      const res = await request(app).get(
        `/api/class-student/class/${new mongoose.Types.ObjectId()}`
      );
      expect(res.status).toBe(200);
    });
  });

  describe("GET /api/class-student/student/:id", () => {
    it("should get classes by student id", async () => {
      const res = await request(app).get(
        `/api/class-student/student/${studentUser._id}`
      );
      expect(res.status).toBe(200);
    });
  });
});
