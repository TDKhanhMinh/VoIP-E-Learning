import { describe, it, expect, vi, beforeEach } from "vitest";
import * as scheduleService from "../../../src/service/scheduleService.js";
import User from "../../../src/model/user.js";
import Class from "../../../src/model/class.js";
import mongoose from "mongoose";

// --- 1. SỬ DỤNG vi.hoisted ĐỂ KHẮC PHỤC LỖI HOISTING ---
const mocks = vi.hoisted(() => {
  // 1. Mock Chain cho Class (find -> populate -> populate -> lean)
  const mockLean = vi.fn();
  const mockPopulate2 = vi.fn(() => ({ lean: mockLean }));
  const mockPopulate1 = vi.fn(() => ({ populate: mockPopulate2 }));
  const mockFind = vi.fn(() => ({ populate: mockPopulate1 }));

  // 2. Mock ObjectId (Dùng function thường để hỗ trợ 'new')
  const mockObjectId = vi.fn(function (id) {
    return new String(id);
  });

  return {
    mockLean,
    mockPopulate2,
    mockPopulate1,
    mockFind,
    mockObjectId,
  };
});

// --- 2. Setup Mocks ---

// Mock Mongoose
vi.mock("mongoose", async () => {
  const actual = await vi.importActual("mongoose");
  return {
    ...actual,
    default: {
      ...actual.default,
      Types: {
        ...actual.default.Types,
        // Sử dụng mockObjectId từ biến hoisted
        ObjectId: mocks.mockObjectId,
      },
    },
  };
});

// Mock User Model
vi.mock("../../../src/model/user.js", () => ({
  default: {
    findById: vi.fn(),
  },
}));

// Mock Class Model
vi.mock("../../../src/model/class.js", () => ({
  default: {
    find: mocks.mockFind, // Truy cập qua mocks
    aggregate: vi.fn(),
  },
}));

// Mock Semester Model
vi.mock("../../../src/model/semester.js", () => ({
  default: {},
}));

describe("Schedule Service", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    // Reset behavior của chain mock thông qua mocks object
    mocks.mockFind.mockReturnValue({ populate: mocks.mockPopulate1 });
    mocks.mockPopulate1.mockReturnValue({ populate: mocks.mockPopulate2 });
    mocks.mockPopulate2.mockReturnValue({ lean: mocks.mockLean });

    // Reset ObjectId mock
    mocks.mockObjectId.mockClear();
  });

  describe("Structure Verification", () => {
    it("should export getScheduleBySemester function", () => {
      expect(scheduleService.getScheduleBySemester).toBeDefined();
      expect(typeof scheduleService.getScheduleBySemester).toBe("function");
    });
  });

  describe("getScheduleBySemester", () => {
    const userId = "user-123";
    const semesterId = "sem-456";

    it("should throw 404 error if user not found", async () => {
      vi.mocked(User.findById).mockResolvedValue(null);

      try {
        await scheduleService.getScheduleBySemester(userId, semesterId);
      } catch (error) {
        expect(error.statusCode).toBe(404);
        expect(error.message).toBe("User not found");
      }
      expect(User.findById).toHaveBeenCalledWith(userId);
    });

    it("should return schedule for TEACHER (using find/populate)", async () => {
      // Setup User là teacher
      vi.mocked(User.findById).mockResolvedValue({
        _id: userId,
        role: "teacher",
      });

      // Setup kết quả trả về từ Class.find chain
      const mockClasses = [{ name: "Math" }, { name: "Physics" }];
      mocks.mockLean.mockResolvedValue(mockClasses);

      const result = await scheduleService.getScheduleBySemester(
        userId,
        semesterId
      );

      // Verify logic
      expect(Class.find).toHaveBeenCalledWith({
        teacher: expect.anything(), // do mock ObjectId
        semester: expect.anything(),
      });

      // Verify chain calls
      expect(mocks.mockPopulate1).toHaveBeenCalledWith("course", "title");
      expect(mocks.mockPopulate2).toHaveBeenCalledWith(
        "semester",
        "name start_date end_date mid_term"
      );
      expect(mocks.mockLean).toHaveBeenCalled();

      expect(result).toEqual(mockClasses);
    });

    it("should return schedule for STUDENT (using aggregate)", async () => {
      // Setup User là student
      vi.mocked(User.findById).mockResolvedValue({
        _id: userId,
        role: "student",
      });

      // Setup kết quả trả về từ aggregate
      const mockSchedule = [
        {
          name: "Math",
          course: { title: "Advanced Math" },
          semester: { name: "Spring 2024" },
        },
      ];
      vi.mocked(Class.aggregate).mockResolvedValue(mockSchedule);

      const result = await scheduleService.getScheduleBySemester(
        userId,
        semesterId
      );

      // Verify logic
      expect(Class.aggregate).toHaveBeenCalled();

      // Kiểm tra xem aggregate pipeline có chứa match semester và student không
      const pipeline = vi.mocked(Class.aggregate).mock.calls[0][0];

      // Kiểm tra stage đầu tiên (Match Semester)
      expect(pipeline[0]).toEqual({
        $match: { semester: expect.anything() },
      });

      // Kiểm tra có stage match user enrollment
      const matchStudentStage = pipeline.find(
        (stage) => stage.$match && stage.$match["enrollments.student"]
      );
      expect(matchStudentStage).toBeDefined();

      expect(result).toEqual(mockSchedule);
    });

    it("should throw 400 error for INVALID role", async () => {
      // Setup User role admin
      vi.mocked(User.findById).mockResolvedValue({
        _id: userId,
        role: "admin",
      });

      try {
        await scheduleService.getScheduleBySemester(userId, semesterId);
      } catch (error) {
        expect(error.statusCode).toBe(400);
        expect(error.message).toBe("Invalid user role");
      }
    });
  });
});
