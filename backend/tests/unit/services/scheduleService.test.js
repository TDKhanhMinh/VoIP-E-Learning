import { describe, it, expect, vi, beforeEach } from "vitest";
import * as scheduleService from "../../../src/service/scheduleService.js";
import User from "../../../src/model/user.js";
import Class from "../../../src/model/class.js";
import mongoose from "mongoose";

const mocks = vi.hoisted(() => {
  const mockLean = vi.fn();
  const mockPopulate2 = vi.fn(() => ({ lean: mockLean }));
  const mockPopulate1 = vi.fn(() => ({ populate: mockPopulate2 }));
  const mockFind = vi.fn(() => ({ populate: mockPopulate1 }));

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

vi.mock("mongoose", async () => {
  const actual = await vi.importActual("mongoose");
  return {
    ...actual,
    default: {
      ...actual.default,
      Types: {
        ...actual.default.Types,
        ObjectId: mocks.mockObjectId,
      },
    },
  };
});

vi.mock("../../../src/model/user.js", () => ({
  default: {
    findById: vi.fn(),
  },
}));

vi.mock("../../../src/model/class.js", () => ({
  default: {
    find: mocks.mockFind,
    aggregate: vi.fn(),
  },
}));

vi.mock("../../../src/model/semester.js", () => ({
  default: {},
}));

describe("Schedule Service", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    mocks.mockFind.mockReturnValue({ populate: mocks.mockPopulate1 });
    mocks.mockPopulate1.mockReturnValue({ populate: mocks.mockPopulate2 });
    mocks.mockPopulate2.mockReturnValue({ lean: mocks.mockLean });

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
      vi.mocked(User.findById).mockResolvedValue({
        _id: userId,
        role: "teacher",
      });

      const mockClasses = [{ name: "Math" }, { name: "Physics" }];
      mocks.mockLean.mockResolvedValue(mockClasses);

      const result = await scheduleService.getScheduleBySemester(
        userId,
        semesterId
      );

      expect(Class.find).toHaveBeenCalledWith({
        teacher: expect.anything(),
        semester: expect.anything(),
      });

      expect(mocks.mockPopulate1).toHaveBeenCalledWith("course", "title");
      expect(mocks.mockPopulate2).toHaveBeenCalledWith(
        "semester",
        "name start_date end_date mid_term"
      );
      expect(mocks.mockLean).toHaveBeenCalled();

      expect(result).toEqual(mockClasses);
    });

    it("should return schedule for STUDENT (using aggregate)", async () => {
      vi.mocked(User.findById).mockResolvedValue({
        _id: userId,
        role: "student",
      });

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

      expect(Class.aggregate).toHaveBeenCalled();

      const pipeline = vi.mocked(Class.aggregate).mock.calls[0][0];

      expect(pipeline[0]).toEqual({
        $match: { semester: expect.anything() },
      });

      const matchStudentStage = pipeline.find(
        (stage) => stage.$match && stage.$match["enrollments.student"]
      );
      expect(matchStudentStage).toBeDefined();

      expect(result).toEqual(mockSchedule);
    });

    it("should throw 400 error for INVALID role", async () => {
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
