import request from "supertest";
import app from "../../../src/server.js";
import {
  connectTestDB,
  closeTestDB,
  clearTestDB,
  createAuthToken,
  createTestUser,
} from "../setup.js";

describe("Topic Routes", () => {
  beforeAll(async () => await connectTestDB());
  afterAll(async () => await closeTestDB());
  afterEach(async () => await clearTestDB());

  let teacherToken;

  beforeEach(async () => {
    const teacher = await createTestUser("teacher");
    teacherToken = createAuthToken(teacher._id, teacher.email, "teacher");
  });

  describe("GET /api/topic", () => {
    it("should get all topics", async () => {
      const res = await request(app).get("/api/topic");
      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
    });
  });

  describe("POST /api/topic", () => {
    it("should create topic as teacher", async () => {
      const topicData = {
        // 2. SỬA LỖI VALIDATION: Đổi 'name' thành 'title'
        title: "Test Topic",
        description: "Test Description",
      };

      const res = await request(app)
        .post("/api/topic")
        .set("Authorization", `Bearer ${teacherToken}`)
        .send(topicData);

      // Nếu vẫn lỗi 401, hãy kiểm tra xem middleware của bạn dùng Header hay Cookie
      if (res.status === 401) console.log("Auth Error:", res.body);
      if (res.status === 400) console.log("Validation Error:", res.body);

      expect(res.status).toBe(201);
      // Kiểm tra xem server trả về title đúng không
      expect(res.body.title).toBe("Test Topic");
    });
  });

  describe("PUT /api/topic/:id", () => {
    it("should update topic as teacher", async () => {
      const Topic = (await import("../../../src/model/topic.js")).default;

      // 3. SỬA LỖI TẠO DỮ LIỆU GIẢ: Phải dùng 'title'
      const topic = await Topic.create({
        title: "Test Topic Old",
        description: "Description",
      });

      const res = await request(app)
        .put(`/api/topic/${topic._id}`)
        .set("Authorization", `Bearer ${teacherToken}`)
        .send({ title: "Updated Topic" }); // Gửi field 'title'

      expect(res.status).toBe(200);
      expect(res.body.title).toBe("Updated Topic");
    });
  });

  describe("DELETE /api/topic/:id", () => {
    it("should delete topic as teacher", async () => {
      const Topic = (await import("../../../src/model/topic.js")).default;

      const topic = await Topic.create({
        title: "Test Topic To Delete",
        description: "Description",
      });

      const res = await request(app)
        .delete(`/api/topic/${topic._id}`)
        .set("Authorization", `Bearer ${teacherToken}`);

      expect(res.status).toBe(200);
    });
  });
});
