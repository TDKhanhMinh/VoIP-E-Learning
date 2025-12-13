import { describe, it, expect, vi, beforeEach } from "vitest";
import * as voipService from "../../../src/service/voipService.js";
import User from "../../../src/model/user.js";

// --- 1. SỬ DỤNG vi.hoisted ĐỂ KHẮC PHỤC LỖI HOISTING ---
const mocks = vi.hoisted(() => {
  const mockFindById = vi.fn();

  return {
    mockFindById,
  };
});

// --- 2. Setup Mocks ---
vi.mock("../../../src/model/user.js", () => ({
  default: {
    findById: mocks.mockFindById,
  },
}));

describe("VoIP Service", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("getSipCredentials", () => {
    it("should return SIP credentials for valid user", async () => {
      const mockUser = {
        _id: "user123",
        email: "student@tdtu.edu.vn",
        full_name: "Test Student",
        sipPassword: "password123",
      };

      mocks.mockFindById.mockResolvedValue(mockUser);

      const result = await voipService.getSipCredentials("user123");

      expect(User.findById).toHaveBeenCalledWith("user123");
      expect(result).toEqual({
        sipId: "student",
        sipPassword: "password123",
        displayName: "Test Student",
      });
    });

    it("should throw error if user not found", async () => {
      mocks.mockFindById.mockResolvedValue(null);

      await expect(voipService.getSipCredentials("invalid-id")).rejects.toThrow(
        "User không tồn tại"
      );
    });

    it("should throw error if sipPassword is missing (not synced)", async () => {
      const mockUser = {
        _id: "user123",
        email: "student@tdtu.edu.vn",
        full_name: "Test Student",
        sipPassword: null, // Thiếu password
      };

      mocks.mockFindById.mockResolvedValue(mockUser);

      await expect(voipService.getSipCredentials("user123")).rejects.toThrow(
        "User chưa được đồng bộ sang Asterisk (thiếu sipPassword)"
      );
    });

    it("should extract sipId correctly from email (split @)", async () => {
      const mockUser = {
        _id: "user123",
        email: "teacher.complex.name@university.edu.vn",
        full_name: "Teacher Name",
        sipPassword: "pass",
      };

      mocks.mockFindById.mockResolvedValue(mockUser);

      const result = await voipService.getSipCredentials("user123");

      expect(result.sipId).toBe("teacher.complex.name");
    });
  });
});
