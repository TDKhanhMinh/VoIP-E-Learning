import request from "supertest";
import express from "express";
import app from "../../../src/server.js";
import mongoose from "mongoose";
import {
  connectTestDB,
  closeTestDB,
  clearTestDB,
  createAuthToken,
  createTestUser,
} from "../setup.js";
import { errorHandler } from "../../../src/middlewares/errorHandler.js";
import materialRoutes from "../../../src/router/materialRouter.js";

app.use(express.json());
app.use("/api/material", materialRoutes);
app.use(errorHandler);
describe("Material Routes", () => {
  beforeAll(async () => await connectTestDB());
  afterAll(async () => await closeTestDB());
  afterEach(async () => await clearTestDB());

  let teacherToken, teacherUser;
  const mockClassId = new mongoose.Types.ObjectId();

  beforeEach(async () => {
    teacherUser = await createTestUser("teacher");
    teacherToken = createAuthToken(
      teacherUser._id,
      teacherUser.email,
      "teacher"
    );
  });

  describe("GET /api/material", () => {
    it("should get all materials", async () => {
      const res = await request(app).get("/api/material");
      expect(res.status).toBe(200);
    });
  });

  describe("POST /api/material", () => {
    it("should create material as teacher", async () => {
      // Create a class first since service likely validates it exists
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

      const materialData = {
        title: "Test Material",
        class: testClass._id.toString(),
        file_url: "http://example.com/file.pdf", 
      };

      const res = await request(app)
        .post("/api/material")
        .set("Authorization", `Bearer ${teacherToken}`)
        .send(materialData);

      expect(res.status).toBe(201);
    });
  });

  describe("GET /api/material/class/:class_id", () => {
    it("should get materials by class id", async () => {
      const res = await request(app).get(`/api/material/class/${mockClassId}`);
      expect(res.status).toBe(200);
    });
  });

  describe("DELETE /api/material/:id", () => {
    it("should delete material as teacher", async () => {
      const Material = (await import("../../../src/model/material.js")).default;

      // 6. Fix: Tạo dữ liệu giả đúng Schema để không bị lỗi Validation
      const material = await Material.create({
        title: "Test Material to Delete",
        class: mockClassId, // Sửa: classId -> class
        file_url: "http://example.com/file.pdf", // Sửa: fileUrl -> file_url
        upload_by: teacherUser._id, // Fix: Thêm trường bắt buộc này
      });

      const res = await request(app)
        .delete(`/api/material/${material._id}`)
        .set("Authorization", `Bearer ${teacherToken}`);

      expect(res.status).toBe(200);
    });
  });
});
