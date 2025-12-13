import request from "supertest";
// 1. IMPORT APP THẬT
import app from "../../../src/server.js";
import {
  connectTestDB,
  closeTestDB,
  clearTestDB,
  createAuthToken,
  createTestUser,
} from "../setup.js";
import mongoose from "mongoose";

describe("Class Routes", () => {
  beforeAll(async () => await connectTestDB());
  afterAll(async () => await closeTestDB());
  afterEach(async () => await clearTestDB());

  let adminToken, adminUser;

  const mockSchedule = [
    { dayOfWeek: 2, shift: 1, type: "theory", room: "A101" },
  ];

  beforeEach(async () => {
    adminUser = await createTestUser("admin");
    adminToken = createAuthToken(adminUser._id, adminUser.email, "admin");
  });

  describe("GET /api/class", () => {
    it("should get all classes", async () => {
      const res = await request(app).get("/api/class");
      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
    });
  });

  describe("POST /api/class", () => {
    it("should create class as admin", async () => {
      const Course = (await import("../../../src/model/course.js")).default;
      const Semester = (await import("../../../src/model/semester.js")).default;
      
      const teacherUser = await createTestUser("teacher");
      
      const testCourse = await Course.create({
        title: "Test Course",
        code: "TC101",
        credit: 3,
      });

      const testSemester = await Semester.create({
        name: "Fall 2025",
        start_date: new Date(),
        end_date: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
      });

      const classData = {
        name: "Math 101",
        course: testCourse._id.toString(),
        teacher: teacherUser._id.toString(),
        semester: testSemester._id.toString(),
        schedule: mockSchedule,
        theoryWeeks: 15,
        practiceWeeks: 0,
      };

      const res = await request(app)
        .post("/api/class")
        .set("Authorization", `Bearer ${adminToken}`)
        .send(classData);

      if (res.status === 400) console.log("Create Class Error:", res.body);

      expect(res.status).toBe(201);
    });
  });

  describe("GET /api/class/:id", () => {
    it("should get class by id", async () => {
      const Class = (await import("../../../src/model/class.js")).default;

      // 3. SỬA DỮ LIỆU TẠO GIẢ (Thêm schedule)
      const classDoc = await Class.create({
        name: "Test Class",
        course: new mongoose.Types.ObjectId(),
        teacher: adminUser._id,
        semester: new mongoose.Types.ObjectId(),
        theoryWeeks: 3,
        practiceWeeks: 2,
        schedule: mockSchedule,
      });

      const res = await request(app).get(`/api/class/${classDoc._id}`);
      expect(res.status).toBe(200);
    });
  });

  describe("PUT /api/class/:id", () => {
    it("should update class as admin", async () => {
      const Class = (await import("../../../src/model/class.js")).default;
      const classDoc = await Class.create({
        name: "Test Class",
        course: new mongoose.Types.ObjectId(),
        teacher: adminUser._id,
        semester: new mongoose.Types.ObjectId(),
        theoryWeeks: 3,
        practiceWeeks: 2,
        schedule: mockSchedule,
      });

      const res = await request(app)
        .put(`/api/class/${classDoc._id}`)
        .set("Authorization", `Bearer ${adminToken}`)
        .send({ name: "Updated Class" });

      expect(res.status).toBe(200);
    });
  });

  describe("POST /api/class/:classId/absence", () => {
    it("should add absence date as teacher", async () => {
      const Class = (await import("../../../src/model/class.js")).default;
      const classDoc = await Class.create({
        name: "Test Class",
        course: new mongoose.Types.ObjectId(),
        teacher: adminUser._id,
        semester: new mongoose.Types.ObjectId(),
        theoryWeeks: 3,
        practiceWeeks: 2,
        schedule: mockSchedule,
      });

      const res = await request(app)
        .post(`/api/class/${classDoc._id}/absence`)
        .set("Authorization", `Bearer ${adminToken}`)
        .send({ date: new Date(), reason: "Holiday" });

      expect(res.status).toBe(200);
    });
  });
});
