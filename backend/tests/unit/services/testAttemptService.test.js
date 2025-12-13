import { describe, it, expect, vi, beforeEach } from "vitest";
import * as testAttemptService from "../../../src/service/testAttemptService.js";
import TestAttempt from "../../../src/model/testAttempt.js";
import OnlineTest from "../../../src/model/online_test.js";
import TestSession from "../../../src/model/testSession.js";
import TestQuestion from "../../../src/model/testQuestion.js";
import ClassStudent from "../../../src/model/class_student.js";

// --- 1. SỬ DỤNG vi.hoisted ĐỂ KHẮC PHỤC LỖI HOISTING ---
const mocks = vi.hoisted(() => {
  // Mock các hàm cuối chain
  const mockSort = vi.fn();

  // Mock populate (trả về chính nó và sort để chain)
  const mockPopulate = vi.fn(() => ({
    populate: mockPopulate,
    sort: mockSort,
  }));

  // Mock find/findById (trả về object chứa populate/sort)
  const mockFind = vi.fn(() => ({
    populate: mockPopulate,
    sort: mockSort,
  }));

  const mockFindById = vi.fn(() => ({
    populate: mockPopulate,
  }));

  const mockSave = vi.fn();

  // --- SỬA LỖI Ở ĐÂY ---
  // Dùng Regular Function (function keyword) thay vì Arrow Function
  // để hỗ trợ từ khóa 'new' (ví dụ: new TestAttempt(data))
  const createMockModel = (name) => {
    const MockModel = vi.fn(function (data) {
      return {
        ...data,
        save: mockSave,
      };
    });

    // Gán các static methods dùng chung
    MockModel.find = mockFind;
    MockModel.findById = mockFindById;
    MockModel.findOne = vi.fn();
    MockModel.findByIdAndDelete = vi.fn();
    MockModel.deleteMany = vi.fn();

    return { default: MockModel };
  };

  return {
    mockSort,
    mockPopulate,
    mockFind,
    mockFindById,
    mockSave,
    createMockModel,
  };
});

// --- 2. Setup Mocks cho Models ---

vi.mock("../../../src/model/testAttempt.js", () =>
  mocks.createMockModel("TestAttempt")
);
vi.mock("../../../src/model/online_test.js", () =>
  mocks.createMockModel("OnlineTest")
);
vi.mock("../../../src/model/testSession.js", () =>
  mocks.createMockModel("TestSession")
);
vi.mock("../../../src/model/testQuestion.js", () =>
  mocks.createMockModel("TestQuestion")
);
vi.mock("../../../src/model/class_student.js", () =>
  mocks.createMockModel("ClassStudent")
);

// Mock Mongoose
vi.mock("mongoose", () => ({
  default: {
    Types: { ObjectId: vi.fn((id) => id) },
  },
}));

describe("Test Attempt Service", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    // Reset chain mocks về behavior mặc định
    mocks.mockFind.mockReturnValue({
      populate: mocks.mockPopulate,
      sort: mocks.mockSort,
    });
    mocks.mockFindById.mockReturnValue({ populate: mocks.mockPopulate });
    mocks.mockPopulate.mockReturnValue({
      populate: mocks.mockPopulate,
      sort: mocks.mockSort,
    });
  });

  describe("Structure Verification", () => {
    it("should export all required functions", () => {
      expect(testAttemptService.getAttemptsByStudentAndTest).toBeDefined();
      expect(testAttemptService.checkAttempt).toBeDefined();
      expect(testAttemptService.createTestAttempt).toBeDefined();
      expect(testAttemptService.getAttemptById).toBeDefined();
      expect(testAttemptService.getAttemptsByTest).toBeDefined();
      expect(testAttemptService.getAttemptsByStudent).toBeDefined();
    });
  });

  describe("getAttemptsByStudentAndTest", () => {
    it("should return attempts sorted by createdAt desc", async () => {
      const studentId = "student-1";
      const onlineTestId = "test-1";
      const mockResult = [{ _id: "att-1" }];

      mocks.mockSort.mockResolvedValue(mockResult);

      const result = await testAttemptService.getAttemptsByStudentAndTest(
        studentId,
        onlineTestId
      );

      expect(TestAttempt.find).toHaveBeenCalledWith({
        student: studentId,
        onlineTest: onlineTestId,
      });
      expect(mocks.mockSort).toHaveBeenCalledWith({ createdAt: -1 });
      expect(result).toEqual(mockResult);
    });
  });

  describe("checkAttempt", () => {
    const studentId = "student-1";
    const onlineTestId = "test-1";

    it("should return TRUE if attempts count < limit", async () => {
      mocks.mockFind.mockResolvedValue(["attempt1"]);
      mocks.mockFindById.mockResolvedValue({ attempts: 2 });

      const result = await testAttemptService.checkAttempt(
        studentId,
        onlineTestId
      );

      expect(TestAttempt.find).toHaveBeenCalledWith({
        student: studentId,
        onlineTest: onlineTestId,
      });
      expect(OnlineTest.findById).toHaveBeenCalledWith(onlineTestId);
      expect(result).toBe(true);
    });

    it("should return FALSE if attempts count >= limit", async () => {
      mocks.mockFind.mockResolvedValue(["attempt1", "attempt2"]);
      mocks.mockFindById.mockResolvedValue({ attempts: 2 });

      const result = await testAttemptService.checkAttempt(
        studentId,
        onlineTestId
      );

      expect(result).toBe(false);
    });

    it("should throw error if online test not found", async () => {
      mocks.mockFind.mockResolvedValue([]);
      mocks.mockFindById.mockResolvedValue(null);

      await expect(
        testAttemptService.checkAttempt(studentId, onlineTestId)
      ).rejects.toThrow("Online test not found");
    });
  });

  describe("createTestAttempt", () => {
    const sessionId = "session-123";
    const testId = "test-1";
    const studentId = "student-1";
    const questionId1 = "q1";
    const questionId2 = "q2";
    const optionRight = "opt-right";
    const optionWrong = "opt-wrong";

    it("should calculate score, save attempt and delete session", async () => {
      const mockSession = {
        _id: sessionId,
        test: testId,
        student: studentId,
        questions: [
          { questionId: questionId1, selectedOptionId: optionRight },
          { questionId: questionId2, selectedOptionId: optionWrong },
        ],
      };

      vi.mocked(TestSession.findById).mockResolvedValue(mockSession);

      const mockQuestions = [
        {
          _id: questionId1,
          toString: () => questionId1,
          options: [
            { _id: optionRight, isCorrect: true, toString: () => optionRight },
            { _id: "opt-2", isCorrect: false, toString: () => "opt-2" },
          ],
        },
        {
          _id: questionId2,
          toString: () => questionId2,
          options: [
            { _id: "opt-3", isCorrect: true, toString: () => "opt-3" },
            { _id: optionWrong, isCorrect: false, toString: () => optionWrong },
          ],
        },
      ];
      vi.mocked(TestQuestion.find).mockResolvedValue(mockQuestions);

      vi.mocked(TestSession.findByIdAndDelete).mockResolvedValue(true);
      vi.mocked(TestSession.deleteMany).mockResolvedValue(true);

      const result = await testAttemptService.createTestAttempt(sessionId);

      expect(result.score).toBe(5);
      expect(result.correctAnswers).toBe(1);
      expect(result.totalQuestions).toBe(2);
      expect(result.onlineTest).toBe(testId);
      expect(result.student).toBe(studentId);
      expect(result.submitedAt).toBeDefined();

      expect(mocks.mockSave).toHaveBeenCalled();

      expect(TestSession.findByIdAndDelete).toHaveBeenCalledWith(sessionId);
      expect(TestSession.deleteMany).toHaveBeenCalledWith({
        test: testId,
        student: studentId,
        finished: false,
      });
    });

    it("should throw error if session not found", async () => {
      vi.mocked(TestSession.findById).mockResolvedValue(null);

      await expect(
        testAttemptService.createTestAttempt(sessionId)
      ).rejects.toThrow("Test session not found");
    });
  });

  describe("getAttemptById", () => {
    it("should return attempt with populated fields", async () => {
      const attemptId = "att-1";
      const mockAttempt = { _id: attemptId };

      mocks.mockPopulate.mockReturnValueOnce({ populate: mocks.mockPopulate });
      mocks.mockPopulate.mockReturnValueOnce(mockAttempt);

      const result = await testAttemptService.getAttemptById(attemptId);

      expect(TestAttempt.findById).toHaveBeenCalledWith(attemptId);
      expect(mocks.mockPopulate).toHaveBeenCalledTimes(2);
      expect(result).toEqual(mockAttempt);
    });
  });

  describe("getAttemptsByTest", () => {
    it("should return classStudents and attempts for a test", async () => {
      const testId = "test-1";
      const classId = "class-1";

      vi.mocked(OnlineTest.findById).mockResolvedValue({
        _id: testId,
        class: classId,
      });

      const mockStudents = [{ student: "s1" }];
      const mockAttempts = [{ _id: "att-1" }];

      const mockChainClassStudent = {
        populate: vi.fn(() => ({
          populate: vi.fn().mockResolvedValue(mockStudents),
        })),
      };

      const mockChainTestAttempt = {
        populate: vi.fn(() => ({
          sort: vi.fn().mockResolvedValue(mockAttempts),
        })),
      };

      mocks.mockFind
        .mockReturnValueOnce(mockChainClassStudent)
        .mockReturnValueOnce(mockChainTestAttempt);

      const result = await testAttemptService.getAttemptsByTest(testId);

      expect(OnlineTest.findById).toHaveBeenCalledWith(testId);
      expect(mocks.mockFind).toHaveBeenNthCalledWith(1, { class: classId });
      expect(mocks.mockFind).toHaveBeenNthCalledWith(2, { onlineTest: testId });

      expect(result).toEqual({
        classStudent: mockStudents,
        attempts: mockAttempts,
      });
    });

    it("should throw error if test not found", async () => {
      vi.mocked(OnlineTest.findById).mockResolvedValue(null);
      await expect(
        testAttemptService.getAttemptsByTest("test-1")
      ).rejects.toThrow("Test not found");
    });
  });

  describe("getAttemptsByStudent", () => {
    it("should return attempts sorted by createdAt", async () => {
      const studentId = "s1";
      const mockAttempts = [{ _id: "att-1" }];

      mocks.mockSort.mockResolvedValue(mockAttempts);

      const result = await testAttemptService.getAttemptsByStudent(studentId);

      expect(TestAttempt.find).toHaveBeenCalledWith({ student: studentId });
      expect(mocks.mockPopulate).toHaveBeenCalledWith(
        "onlineTest",
        "title class"
      );
      expect(mocks.mockSort).toHaveBeenCalledWith({ createdAt: -1 });
      expect(result).toEqual(mockAttempts);
    });
  });
});
