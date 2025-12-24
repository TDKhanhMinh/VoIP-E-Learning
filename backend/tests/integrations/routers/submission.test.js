import request from "supertest";
import app from "../../../src/server.js";
import mongoose from "mongoose";
import {
  connectTestDB,
  closeTestDB,
  clearTestDB,
  createAuthToken,
  createTestUser,
} from "../setup.js";

describe("Submission Routes", () => {
  beforeAll(async () => await connectTestDB());
  afterAll(async () => await closeTestDB());
  afterEach(async () => await clearTestDB());

  let studentToken, studentUser;
  const mockAssignmentId = new mongoose.Types.ObjectId();

  beforeEach(async () => {
    studentUser = await createTestUser("student");
    studentToken = createAuthToken(
      studentUser._id,
      studentUser.email,
      "student"
    );
  });

  describe("GET /api/submission", () => {
    it("should get all submissions", async () => {
      const res = await request(app)
        .get("/api/submission")
        .set("Authorization", `Bearer ${studentToken}`);

      expect(res.status).toBe(200);
    });
  });

  describe("POST /api/submission", () => {
    it("should create submission", async () => {
      const Class = (await import("../../../src/model/class.js")).default;
      const Assignment = (await import("../../../src/model/assignment.js")).default;
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

      const testAssignment = await Assignment.create({
        title: "Test Assignment",
        description: "Test Description",
        due_at: new Date(Date.now() + 86400000),
        class: testClass._id,
      });

      const submissionData = {
        assignment: testAssignment._id,
        student: studentUser._id,
        file_url: "http://example.com/submission.pdf",
        file_name: "submission.pdf",
      };

      const res = await request(app)
        .post("/api/submission")
        .set("Authorization", `Bearer ${studentToken}`)
        .send(submissionData);

      if (res.status === 400) console.log("POST Error:", res.body);

      expect(res.status).toBe(201);
    });
  });

  describe("GET /api/submission/assignment/:assignmentId", () => {
    it("should get submissions by assignment", async () => {
      // Dùng ID hợp lệ
      const res = await request(app)
        .get(`/api/submission/assignment/${mockAssignmentId}`)
        .set("Authorization", `Bearer ${studentToken}`);

      expect(res.status).toBe(200);
    });
  });

  describe("PUT /api/submission/:id", () => {
    it("should update submission", async () => {
      const Submission = (await import("../../../src/model/submission.js"))
        .default;

      const submission = await Submission.create({
        assignment: mockAssignmentId,
        student: studentUser._id,
        file_url: "http://example.com/file.pdf",
        file_name: "file.pdf",
      });

      const res = await request(app)
        .put(`/api/submission/${submission._id}`)
        .set("Authorization", `Bearer ${studentToken}`)
        .send({ graded: true, score: 5, feedback: "Good work" }); 

      expect(res.status).toBe(200);
    });
  });
});
