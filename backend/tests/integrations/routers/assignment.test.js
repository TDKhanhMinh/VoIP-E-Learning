import request from "supertest";
// 1. IMPORT APP THẬT (Thay vì express và router lẻ)
import app from "../../../src/server.js";
import {
  connectTestDB,
  closeTestDB,
  clearTestDB,
  createAuthToken,
  createTestUser,
} from "../setup.js";
import mongoose from "mongoose";

// 2. XÓA ĐOẠN KHỞI TẠO APP THỦ CÔNG
// const app = express();
// app.use(express.json());
// app.use("/api/assignment", assignmentRoutes);

describe("Assignment Routes", () => {
  beforeAll(async () => await connectTestDB());
  afterAll(async () => await closeTestDB());
  afterEach(async () => await clearTestDB());

  let teacherToken;

  beforeEach(async () => {
    const teacher = await createTestUser("teacher");
    teacherToken = createAuthToken(teacher._id, teacher.email, "teacher");
  });

  describe("GET /api/assignment", () => {
    it("should get all assignments", async () => {
      const res = await request(app).get("/api/assignment");
      expect(res.status).toBe(200);
    });
  });

  describe("POST /api/assignment", () => {
    it("should create assignment as teacher", async () => {
      // Create a class first since the service validates it exists
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

      const assignmentData = {
        title: "Assignment 1",
        description: "Description",
        due_at: new Date(),
        class: testClass._id,
      };

      const res = await request(app)
        .post("/api/assignment")
        .set("Authorization", `Bearer ${teacherToken}`)
        .send(assignmentData);

      if (res.status === 400) console.log("Assignment Create Error:", res.body);

      expect(res.status).toBe(201);
    });
  });
});
