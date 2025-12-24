import request from "supertest";
import app from "../../../src/server.js";
import {
  connectTestDB,
  closeTestDB,
  clearTestDB,
  createAuthToken,
  createTestUser,
} from "../setup.js";

describe("User Routes", () => {
  beforeAll(async () => await connectTestDB());
  afterAll(async () => await closeTestDB());
  afterEach(async () => await clearTestDB());

  let adminToken, adminUser;

  beforeEach(async () => {
    adminUser = await createTestUser("admin");
    adminToken = createAuthToken(adminUser._id, adminUser.email, "admin");
  });

  describe("GET /api/user", () => {
    it("should get all users", async () => {
      const res = await request(app)
        .get("/api/user")
        .set("Authorization", `Bearer ${adminToken}`);

      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
    });
  });

  describe("POST /api/user", () => {
    it("should reject without admin role", async () => {
      const studentUser = await createTestUser("student");
      const studentToken = createAuthToken(studentUser._id, "student");

      const res = await request(app)
        .post("/api/user")
        .set("Authorization", `Bearer ${studentToken}`)
        .send({ full_name: "test" });

      expect(res.status).toBe(403);
    });
  });

  describe("PUT /api/user/:id", () => {
    it("should update user as admin", async () => {
      const user = await createTestUser("student");

      const res = await request(app)
        .put(`/api/user/${user._id}`)
        .set("Authorization", `Bearer ${adminToken}`)
        .send({ full_name: "Updated Name" });

      expect(res.status).toBe(200);
    });
  });

  describe("DELETE /api/user/:id", () => {
    it("should delete user as admin", async () => {
      const user = await createTestUser("student");

      const res = await request(app)
        .delete(`/api/user/${user._id}`)
        .set("Authorization", `Bearer ${adminToken}`);

      expect(res.status).toBe(200);
    });
  });
});
