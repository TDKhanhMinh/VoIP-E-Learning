import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import * as testSessionService from "../../../src/service/testSessionService.js";
import TestSession from "../../../src/model/testSession.js";
import OnlineTest from "../../../src/model/online_test.js";
import * as testAttemptService from "../../../src/service/testAttemptService.js";
import mongoose from "mongoose";

const mocks = vi.hoisted(() => {
  const mockSave = vi.fn();

  const mockFind = vi.fn();
  const mockFindById = vi.fn();
  const mockFindByIdAndDelete = vi.fn();
  const mockAggregate = vi.fn();

  const mockCreateTestAttempt = vi.fn();
  const mockCheckAttempt = vi.fn();

  const createMockModel = (name) => {
    const MockModel = vi.fn(function (data) {
      this._id = "new-id";
      Object.assign(this, data);
      this.save = mockSave;
    });

    MockModel.find = mockFind;
    MockModel.findById = mockFindById;
    MockModel.findByIdAndDelete = mockFindByIdAndDelete;
    MockModel.aggregate = mockAggregate;

    return { default: MockModel };
  };

  return {
    mockSave,
    mockFind,
    mockFindById,
    mockFindByIdAndDelete,
    mockAggregate,
    mockCreateTestAttempt,
    mockCheckAttempt,
    createMockModel,
  };
});

vi.mock("../../../src/model/testSession.js", () =>
  mocks.createMockModel("TestSession")
);
vi.mock("../../../src/model/online_test.js", () =>
  mocks.createMockModel("OnlineTest")
);

vi.mock("../../../src/service/testAttemptService.js", () => ({
  createTestAttempt: mocks.mockCreateTestAttempt,
  checkAttempt: mocks.mockCheckAttempt,
}));

vi.mock("mongoose", () => ({
  default: {
    Types: {
      ObjectId: vi.fn(function (id) {
        return new String(id);
      }),
    },
  },
}));

describe("Test Session Service", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe("createTestSession", () => {
    const mockData = { test: "test-1", student: "student-1" };
    const mockTest = {
      _id: "test-1",
      time: 60,
      questions: [
        {
          _id: "q1",
          question: "Question 1",
          image: null,
          options: [{ _id: "opt1", answer: "A", isCorrect: true }],
        },
      ],
    };

    it("should create a new session with shuffled questions", async () => {
      mocks.mockAggregate.mockResolvedValue([mockTest]);

      const result = await testSessionService.createTestSession(mockData);

      expect(OnlineTest.aggregate).toHaveBeenCalled();
      expect(result.remainingTime).toBe(60 * 60);
      expect(result.questions).toHaveLength(1);
      expect(result.questions[0].questionId).toBe("q1");
      expect(result.finished).toBe(false);
      expect(result.startedAt).toBeDefined();
      expect(mocks.mockSave).toHaveBeenCalled();
    });

    it("should throw error if test not found", async () => {
      mocks.mockAggregate.mockResolvedValue([]);

      await expect(
        testSessionService.createTestSession(mockData)
      ).rejects.toThrow("Test not found");
    });
  });

  describe("getTestSessionById", () => {
    it("should return session by id", async () => {
      const mockSession = { _id: "session-1" };
      mocks.mockFindById.mockResolvedValue(mockSession);

      const result = await testSessionService.getTestSessionById("session-1");

      expect(TestSession.findById).toHaveBeenCalledWith("session-1");
      expect(result).toEqual(mockSession);
    });
  });

  describe("updateTestSession", () => {
    const sessionId = "session-1";

    it("should update selected options for questions", async () => {
      const mockSession = {
        _id: sessionId,
        questions: [
          { questionId: "q1", selectedOptionId: null },
          { questionId: "q2", selectedOptionId: "old" },
        ],
        save: mocks.mockSave,
      };

      mocks.mockFindById.mockResolvedValue(mockSession);

      const updateData = {
        questions: [{ questionId: "q1", selectedOptionId: "opt-new" }],
      };

      const result = await testSessionService.updateTestSession(
        sessionId,
        updateData
      );

      expect(TestSession.findById).toHaveBeenCalledWith(sessionId);
      expect(result.questions[0].selectedOptionId).toBe("opt-new");
      expect(result.questions[1].selectedOptionId).toBe("old");
      expect(mocks.mockSave).toHaveBeenCalled();
    });

    it("should throw error if session not found", async () => {
      mocks.mockFindById.mockResolvedValue(null);

      await expect(
        testSessionService.updateTestSession(sessionId, { questions: [] })
      ).rejects.toThrow("Test session not found");
    });
  });

  describe("deleteTestSession", () => {
    it("should delete session", async () => {
      const mockDeleted = { _id: "session-1" };
      mocks.mockFindByIdAndDelete.mockResolvedValue(mockDeleted);

      const result = await testSessionService.deleteTestSession("session-1");

      expect(TestSession.findByIdAndDelete).toHaveBeenCalledWith("session-1");
      expect(result).toEqual(mockDeleted);
    });
  });

  describe("getTestSessionsByTestAndStudent", () => {
    const testId = "test-1";
    const studentId = "student-1";

    it("should return existing sessions if found", async () => {
      mocks.mockCheckAttempt.mockResolvedValue(true);
      const existingSessions = [{ _id: "session-old", finished: false }];
      mocks.mockFind.mockResolvedValue(existingSessions);

      const result = await testSessionService.getTestSessionsByTestAndStudent(
        testId,
        studentId
      );

      expect(mocks.mockCheckAttempt).toHaveBeenCalledWith(studentId, testId);
      expect(TestSession.find).toHaveBeenCalledWith({
        test: expect.anything(),
        student: expect.anything(),
        finished: false,
      });
      expect(result).toEqual(existingSessions);
    });

    it("should create NEW session if no existing session found", async () => {
      mocks.mockCheckAttempt.mockResolvedValue(true);
      mocks.mockFind.mockResolvedValue([]);

      const mockTest = {
        _id: testId,
        time: 60,
        questions: [],
      };
      mocks.mockAggregate.mockResolvedValue([mockTest]);

      const result = await testSessionService.getTestSessionsByTestAndStudent(
        testId,
        studentId
      );

      expect(mocks.mockCheckAttempt).toHaveBeenCalled();
      expect(OnlineTest.aggregate).toHaveBeenCalled();
      expect(result).toHaveLength(1);
      expect(result[0]._id).toBe("new-id");
    });

    it("should throw error if attempts limit reached", async () => {
      mocks.mockCheckAttempt.mockResolvedValue(false);

      await expect(
        testSessionService.getTestSessionsByTestAndStudent(testId, studentId)
      ).rejects.toThrow("Maximum number of attempts reached");

      expect(TestSession.find).not.toHaveBeenCalled();
    });
  });

  describe("autoSubmitExpiredSessions", () => {
    it("should auto-submit expired sessions", async () => {
      const now = new Date();
      const startTime = new Date(now.getTime() - 61 * 60 * 1000);

      const mockSession = {
        _id: "session-expired",
        test: "test-1",
        startedAt: startTime,
      };
      mocks.mockFind.mockResolvedValue([mockSession]);

      const mockTest = { _id: "test-1", time: 60 };
      mocks.mockFindById.mockResolvedValue(mockTest);

      await testSessionService.autoSubmitExpiredSessions();

      expect(TestSession.find).toHaveBeenCalledWith({ finished: false });
      expect(OnlineTest.findById).toHaveBeenCalledWith("test-1");
      expect(mocks.mockCreateTestAttempt).toHaveBeenCalledWith(
        "session-expired"
      );
    });

    it("should NOT submit if time remains", async () => {
      const now = new Date();
      const startTime = new Date(now.getTime() - 30 * 60 * 1000);

      const mockSession = {
        _id: "session-active",
        test: "test-1",
        startedAt: startTime,
      };
      mocks.mockFind.mockResolvedValue([mockSession]);

      const mockTest = { _id: "test-1", time: 60 };
      mocks.mockFindById.mockResolvedValue(mockTest);

      await testSessionService.autoSubmitExpiredSessions();

      expect(mocks.mockCreateTestAttempt).not.toHaveBeenCalled();
    });

    it("should handle errors gracefully during auto-submit", async () => {
      const now = new Date();
      const startTime = new Date(now.getTime() - 100 * 60 * 1000);

      const mockSession = {
        _id: "session-error",
        test: "test-1",
        startedAt: startTime,
      };
      mocks.mockFind.mockResolvedValue([mockSession]);
      mocks.mockFindById.mockResolvedValue({ _id: "test-1", time: 60 });

      mocks.mockCreateTestAttempt.mockRejectedValue(new Error("Submit failed"));

      const consoleSpy = vi
        .spyOn(console, "error")
        .mockImplementation(() => {});

      await expect(
        testSessionService.autoSubmitExpiredSessions()
      ).resolves.not.toThrow();

      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining("Error auto-submitting session"),
        expect.any(Error)
      );
    });
  });
});
