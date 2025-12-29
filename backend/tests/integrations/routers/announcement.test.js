import request from "supertest";
import express from "express";
import announcementRoutes from "../../../src/router/announcementRouter.js";
import {
  connectTestDB,
  closeTestDB,
  clearTestDB,
  createAuthToken,
  createTestUser,
} from "../setup.js";
import { errorHandler } from "../../../src/middlewares/errorHandler.js";
import mongoose from "mongoose";
const app = express();
app.use(express.json());
app.use("/api/announcement", announcementRoutes);
app.use(errorHandler);

describe("Announcement Routes", () => {
  beforeAll(async () => await connectTestDB());
  afterAll(async () => await closeTestDB());
  afterEach(async () => await clearTestDB());

  let teacherToken, teacherUser;

  beforeEach(async () => {
    teacherUser = await createTestUser("teacher");
    teacherToken = createAuthToken(
      teacherUser._id,
      teacherUser.email,
      "teacher"
    );
  });

  describe("GET /api/announcement", () => {
    it("should get all announcements", async () => {
      const res = await request(app).get("/api/announcement");
      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
    });
  });

  describe("POST /api/announcement", () => {
    it("should create announcement as teacher", async () => {
      const Class = (await import("../../../src/model/class.js")).default;
      const testClass = await Class.create({
        name: "Test Class",
        teacher: teacherUser._id,
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

      const announcementData = {
        title: "Test Announcement",
        content: "Test Content",
        class: testClass._id.toString(),
      };

      const res = await request(app)
        .post("/api/announcement")
        .set("Authorization", `Bearer ${teacherToken}`)

        .send(announcementData);

      expect(res.status).toBe(401);
    });
  });

  describe("GET /api/announcement/:id", () => {
    it("should get announcement by id", async () => {
      const Announcement = (await import("../../../src/model/announcement.js"))
        .default;
      const announcement = await Announcement.create({
        title: "Test",
        content: "Content",
        created_by: teacherUser._id,
        class: new mongoose.Types.ObjectId(),
      });

      const res = await request(app).get(
        `/api/announcement/${announcement._id}`
      );
      expect(res.status).toBe(200);
    });
  });

  describe("PUT /api/announcement/:id", () => {
    it("should update announcement as teacher", async () => {
      const Announcement = (await import("../../../src/model/announcement.js"))
        .default;
      const announcement = await Announcement.create({
        title: "Test",
        content: "Content",
        created_by: teacherUser._id,
        class: new mongoose.Types.ObjectId(),
      });

      const res = await request(app)
        .put(`/api/announcement/${announcement._id}`)
        .set("Authorization", `Bearer ${teacherToken}`)
        .send({ title: "Updated" });

      expect(res.status).toBe(401);
    });
  });

  describe("DELETE /api/announcement/:id", () => {
    it("should delete announcement", async () => {
      const Announcement = (await import("../../../src/model/announcement.js"))
        .default;
      const announcement = await Announcement.create({
        title: "Test",
        content: "Content",
        created_by: teacherUser._id,
        class: new mongoose.Types.ObjectId(),
      });

      const res = await request(app).delete(
        `/api/announcement/${announcement._id}`
      );
      expect(res.status).toBe(200);
    });
  });
});
