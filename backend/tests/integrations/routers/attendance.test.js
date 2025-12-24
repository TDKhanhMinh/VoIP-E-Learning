import request from "supertest";
import app from "../../../src/server.js";
import {
  connectTestDB,
  closeTestDB,
  clearTestDB,
  createAuthToken,
  createTestUser,
} from "../setup.js";
import mongoose from "mongoose";


describe("Attendance Routes", () => {
  beforeAll(async () => await connectTestDB());
  afterAll(async () => await closeTestDB());
  afterEach(async () => await clearTestDB());

  let teacherToken, studentUser;
  const mockClassId = new mongoose.Types.ObjectId();

  beforeEach(async () => {
    const teacher = await createTestUser("teacher");
    studentUser = await createTestUser("student");
    teacherToken = createAuthToken(teacher._id, teacher.email, "teacher");
  });

  describe("GET /api/attendance", () => {
    it("should get all attendance records", async () => {
      const res = await request(app).get("/api/attendance");
      expect(res.status).toBe(200);
    });
  });

  describe("POST /api/attendance", () => {
    it("should create attendance as teacher", async () => {
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

      const attendanceData = {
        class: testClass._id.toString(),
        attendances: [
          {
            student: studentUser._id.toString(),
            status: "present",
          },
        ],
      };

      const res = await request(app)
        .post("/api/attendance")
        .set("Authorization", `Bearer ${teacherToken}`)
        .send(attendanceData);

      if (res.status === 400 || res.status === 500)
        console.log("Create Attendance Error:", res.body);

      expect(res.status).toBe(201);
    });
  });

  describe("GET /api/attendance/student/:id", () => {
    it("should get attendance by student id", async () => {
      const res = await request(app).get(
        `/api/attendance/student/${studentUser._id}`
      );
      expect(res.status).toBe(200);
    });
  });

  describe("PUT /api/attendance/:id", () => {
    it("should update attendance as teacher", async () => {
      const Attendance = (await import("../../../src/model/attendance.js"))
        .default;

      const attendance = await Attendance.create({
        student: studentUser._id,
        class: mockClassId, 
        date: new Date(),
        status: "present",
      });

      const res = await request(app)
        .put(`/api/attendance/${attendance._id}`)
        .set("Authorization", `Bearer ${teacherToken}`)
        .send({ status: "absent" });

      expect(res.status).toBe(201);
    });
  });
});
