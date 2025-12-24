import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

vi.mock("../../../src/config/googleConfig.js", () => ({
  default: {
    generateAuthUrl: vi.fn(),
    getToken: vi.fn(),
    verifyIdToken: vi.fn(),
  },
}));

vi.mock("../../../src/model/user.js", () => ({
  default: {
    findOne: vi.fn(),
  },
}));

vi.mock("../../../src/utils/token.js", () => ({
  generateToken: vi.fn(),
}));

const authService = await import("../../../src/service/authService.js");
const client = (await import("../../../src/config/googleConfig.js")).default;
const User = (await import("../../../src/model/user.js")).default;
const { generateToken } = await import("../../../src/utils/token.js");

describe("Auth Service", () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  describe("getGoogleAuthUrl", () => {
    it("should generate and return google auth url", () => {
      const mockUrl = "https://accounts.google.com/o/oauth2/auth?...";
      client.generateAuthUrl.mockReturnValue(mockUrl);

      const result = authService.getGoogleAuthUrl();

      expect(client.generateAuthUrl).toHaveBeenCalledWith({
        access_type: "offline",
        prompt: "consent",
        scope: ["openid", "profile", "email"],
      });
      expect(result).toBe(mockUrl);
    });
  });

  describe("getGoogleUser", () => {
    it("should exchange code for tokens and user payload", async () => {
      const code = "auth_code_123";
      const mockTokens = { id_token: "id_token_123", access_token: "abc" };
      const mockPayload = { email: "test@gmail.com", name: "Test User" };

      client.getToken.mockResolvedValue({ tokens: mockTokens });

      client.verifyIdToken.mockResolvedValue({
        getPayload: vi.fn().mockReturnValue(mockPayload),
      });

      const result = await authService.getGoogleUser(code);

      expect(client.getToken).toHaveBeenCalledWith(code);
      expect(client.verifyIdToken).toHaveBeenCalledWith({
        idToken: mockTokens.id_token,
        audience: process.env.GOOGLE_CLIENT_ID,
      });
      expect(result).toEqual({ payload: mockPayload, tokens: mockTokens });
    });

    it("should throw error if google client fails", async () => {
      client.getToken.mockRejectedValue(new Error("Google API Error"));
      await expect(authService.getGoogleUser("bad_code")).rejects.toThrow(
        "Google API Error"
      );
    });
  });

  describe("generateAppToken", () => {
    it("should generate token if user exists", async () => {
      const inputData = { email: "exist@test.com" };
      const mockUser = {
        _id: "user123",
        full_name: "Test User",
        email: "exist@test.com",
        role: "student",
      };

      User.findOne.mockResolvedValue(mockUser);
      generateToken.mockReturnValue("jwt_token_123");

      const result = await authService.generateAppToken(inputData);

      expect(User.findOne).toHaveBeenCalledWith({ email: inputData.email });
      expect(generateToken).toHaveBeenCalledWith(
        mockUser._id,
        mockUser.email,
        mockUser.role
      );
      expect(result).toEqual({
        _id: mockUser._id,
        full_name: mockUser.full_name,
        email: mockUser.email,
        token: "jwt_token_123",
      });
    });

    it("should throw 400 if email not registered", async () => {
      User.findOne.mockResolvedValue(null); 

      try {
        await authService.generateAppToken({ email: "notfound@test.com" });
      } catch (error) {
        expect(error.message).toBe("Email not registered");
        expect(error.statusCode).toBe(400);
      }
    });
  });

  describe("login", () => {
    const email = "test@test.com";
    const password = "password123";

    it("should login successfully with correct credentials", async () => {
      const mockUser = {
        _id: "user123",
        full_name: "Test User",
        email: email,
        role: "teacher",
        sipPassword: "sip_secret",
        matchPassword: vi.fn().mockResolvedValue(true),
      };

      User.findOne.mockResolvedValue(mockUser);
      generateToken.mockReturnValue("jwt_token_abc");

      const result = await authService.login(email, password);

      expect(User.findOne).toHaveBeenCalledWith({ email });
      expect(mockUser.matchPassword).toHaveBeenCalledWith(password);
      expect(result).toEqual({
        _id: mockUser._id,
        full_name: mockUser.full_name,
        email: mockUser.email,
        role: mockUser.role,
        sipPassword: mockUser.sipPassword,
        token: "jwt_token_abc",
      });
    });

    it("should throw 400 if user not found", async () => {
      User.findOne.mockResolvedValue(null);

      try {
        await authService.login("wrong@email.com", "pass");
      } catch (error) {
        expect(error.message).toBe("Invalid email or password");
        expect(error.statusCode).toBe(400);
      }
    });

    it("should throw 400 if password does not match", async () => {
      const mockUser = {
        email: email,
        matchPassword: vi.fn().mockResolvedValue(false), 
      };
      User.findOne.mockResolvedValue(mockUser);

      try {
        await authService.login(email, "wrong_pass");
      } catch (error) {
        expect(error.message).toBe("Invalid email or password");
        expect(error.statusCode).toBe(400);
      }
    });
  });
});
