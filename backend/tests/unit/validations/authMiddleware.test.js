import { jest } from "@jest/globals";

describe("Auth Middleware", () => {
  let req, res, next;
  let protect;
  let mockVerify;
  let mockUser;

  beforeAll(async () => {
    mockVerify = jest.fn();
    mockUser = {
      findById: jest.fn(),
    };

    const originalJwt = await import("jsonwebtoken");
    const originalUser = await import("../../../src/model/user.js");

    mockVerify = jest.fn();

    const middleware = await import(
      "../../../src/middlewares/authMiddleware.js"
    );
    protect = middleware.protect;
  });

  beforeEach(() => {
    req = {
      headers: {},
      user: null,
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    };
    next = jest.fn();
    jest.clearAllMocks();
  });

  describe("protect middleware", () => {
    it("should reject missing token", async () => {
      await protect(req, res, next);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(next).not.toHaveBeenCalled();
    });

    it("should reject token without Bearer prefix", async () => {
      req.headers.authorization = "invalid-format-token";

      await protect(req, res, next);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(next).not.toHaveBeenCalled();
    });

    it("should handle authorization header correctly", async () => {
      req.headers.authorization = "Bearer valid-token";

      await protect(req, res, next);

      expect(res.status).toHaveBeenCalled();
    });
  });
});
