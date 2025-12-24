import request from "supertest";
import app from "../../../src/server.js";
import {
  connectTestDB,
  closeTestDB,
  clearTestDB,
  createAuthToken,
  createTestUser,
} from "../setup.js";


describe("Course Routes", () => {
  beforeAll(async () => await connectTestDB());
  afterAll(async () => await closeTestDB());
  afterEach(async () => await clearTestDB());

  let adminToken;

  beforeEach(async () => {
    const adminUser = await createTestUser("admin");
    adminToken = createAuthToken(adminUser._id, adminUser.email, "admin");
  });

  describe("GET /api/course", () => {
    it("should get all courses", async () => {
      const res = await request(app).get("/api/course");
      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
    });
  });

  describe("POST /api/course", () => {
    it("should create course as admin", async () => {
      const courseData = {
        title: "Test Course",
        description: "This is a test course",
        code: "TC101",
        credit: 3,
      };

      const res = await request(app)
        .post("/api/course")
        .set("Authorization", `Bearer ${adminToken}`)
        .send(courseData);

      expect(res.status).toBe(201);
      expect(res.body.title).toBe(courseData.title);
    });
  });

  describe("GET /api/course/:id", () => {
    it("should get course by id", async () => {
      const Course = (await import("../../../src/model/course.js")).default;
      const course = await Course.create({
        description: "Test",
        code: "T101",
        credit: 3,
        title: "Test",
      });

      const res = await request(app).get(`/api/course/${course._id}`);
      expect(res.status).toBe(200);
      expect(res.body.title).toBe(course.title);
    });
  });

  describe("PUT /api/course/:id", () => {
    it("should update course as admin", async () => {
      const Course = (await import("../../../src/model/course.js")).default;
      const course = await Course.create({
        description: "Test",
        code: "T101",
        credit: 3,
        title: "Test",
      });

      const res = await request(app)
        .put(`/api/course/${course._id}`)
        .set("Authorization", `Bearer ${adminToken}`)
        .send({ title: "Updated Course" });

      expect(res.status).toBe(200);
    });
  });

  describe("DELETE /api/course/:id", () => {
    it("should delete course", async () => {
      const Course = (await import("../../../src/model/course.js")).default;
      const course = await Course.create({
        description: "Test",
        code: "T101",
        credit: 3,
        title: "Test",
      });

      const res = await request(app)
        .delete(`/api/course/${course._id}`)
        .set("Authorization", `Bearer ${adminToken}`);

      expect(res.status).toBe(200);
    });
  });
});
