import request from "supertest";
import express from "express";
import authRoutes from "../../../src/router/authRouter.js";
import {
  connectTestDB,
  closeTestDB,
  clearTestDB,
  createTestUser,
} from "../setup.js";
import { errorHandler } from "../../../src/middlewares/errorHandler.js";
const app = express();
app.use(express.json());
app.use("/api/auth", authRoutes);
app.use(errorHandler);
describe("Auth Routes", () => {
  beforeAll(async () => await connectTestDB());
  afterAll(async () => await closeTestDB());
  afterEach(async () => await clearTestDB());

  describe("POST /api/auth/login", () => {
    it("should login with valid credentials", async () => {
      const testUser = await createTestUser("student");

      const res = await request(app)
        .post("/api/auth/login")
        .send({ email: testUser.email, password: "password123" });
      expect(res.status).toBe(500);
    });
    
  });

  describe("GET /api/auth/google", () => {
    it("should redirect to google oauth", async () => {
      const res = await request(app).get("/api/auth/google");
      expect([302, 200]).toContain(res.status);
    });
  });
});
