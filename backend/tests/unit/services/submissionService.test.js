import { describe, it, expect, vi, beforeEach } from "vitest";
import * as submissionService from "../../../src/service/submissionService.js";
import User from "../../../src/model/user.js";
import Assignment from "../../../src/model/assignment.js";
import Submission from "../../../src/model/submission.js";

const mocks = vi.hoisted(() => {
  const mockSort = vi.fn();

  const mockPopulate = vi.fn(() => ({
    populate: mockPopulate,
    sort: mockSort,
  }));

  const mockFind = vi.fn(() => ({
    populate: mockPopulate,
    sort: mockSort,
  }));

  const mockFindById = vi.fn(() => ({
    populate: mockPopulate,
  }));

  const mockFindByIdAndUpdate = vi.fn(() => ({
    populate: mockPopulate,
  }));

  return {
    mockSort,
    mockPopulate,
    mockFind,
    mockFindById,
    mockFindByIdAndUpdate,
  };
});

vi.mock("../../../src/model/submission.js", () => ({
  default: {
    find: mocks.mockFind,
    findById: mocks.mockFindById,
    create: vi.fn(),
    findOne: vi.fn(),
    findByIdAndUpdate: mocks.mockFindByIdAndUpdate,
    findByIdAndDelete: vi.fn(),
  },
}));

vi.mock("../../../src/model/assignment.js", () => ({
  default: {
    findById: vi.fn(),
  },
}));

vi.mock("../../../src/model/user.js", () => ({
  default: {
    findById: vi.fn(),
  },
}));

describe("Submission Service", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    mocks.mockFind.mockReturnValue({
      populate: mocks.mockPopulate,
      sort: mocks.mockSort,
    });
    mocks.mockFindById.mockReturnValue({ populate: mocks.mockPopulate });
    mocks.mockFindByIdAndUpdate.mockReturnValue({
      populate: mocks.mockPopulate,
    });

    mocks.mockPopulate.mockReturnValue({
      populate: mocks.mockPopulate,
      sort: mocks.mockSort,
    });
  });

  describe("Structure Verification", () => {
    it("should export all required functions", () => {
      expect(submissionService.getAll).toBeDefined();
      expect(submissionService.findById).toBeDefined();
      expect(submissionService.createSubmission).toBeDefined();
      expect(submissionService.updateSubmission).toBeDefined();
      expect(submissionService.deleteSubmission).toBeDefined();
      expect(submissionService.findByAssignment).toBeDefined();
      expect(submissionService.findByStudent).toBeDefined();
    });
  });

  describe("getAll", () => {
    it("should return submissions sorted by createdAt desc", async () => {
      const mockSubmissions = [{ _id: "1" }];
      mocks.mockSort.mockResolvedValue(mockSubmissions);

      const result = await submissionService.getAll();

      expect(Submission.find).toHaveBeenCalled();
      expect(mocks.mockPopulate).toHaveBeenCalledTimes(2);
      expect(mocks.mockPopulate).toHaveBeenCalledWith(
        "assignment",
        "title deadline"
      );
      expect(mocks.mockPopulate).toHaveBeenCalledWith(
        "student",
        "full_name email"
      );
      expect(mocks.mockSort).toHaveBeenCalledWith({ createdAt: -1 });
      expect(result).toEqual(mockSubmissions);
    });
  });

  describe("findById", () => {
    it("should return submission if found", async () => {
      const mockSubmission = { _id: "sub-123" };

      mocks.mockPopulate.mockReturnValueOnce({ populate: mocks.mockPopulate });
      mocks.mockPopulate.mockReturnValueOnce(mockSubmission);

      const result = await submissionService.findById("sub-123");

      expect(Submission.findById).toHaveBeenCalledWith("sub-123");
      expect(mocks.mockPopulate).toHaveBeenCalledTimes(2);
      expect(result).toEqual(mockSubmission);
    });

    it("should throw 404 if submission not found", async () => {
      mocks.mockPopulate.mockReturnValueOnce({ populate: mocks.mockPopulate });
      mocks.mockPopulate.mockReturnValueOnce(null);
      const id = "invalid-id";

      try {
        await submissionService.findById(id);
      } catch (error) {
        expect(error.statusCode).toBe(404);
        expect(error.message).toBe(`Submission with id ${id} not found`);
      }
    });
  });

  describe("createSubmission", () => {
    const mockData = {
      assignment: "ass-1",
      student: "user-1",
      content: "file.pdf",
    };

    it("should create submission successfully", async () => {
      vi.mocked(Assignment.findById).mockResolvedValue({ _id: "ass-1" });
      vi.mocked(User.findById).mockResolvedValue({ _id: "user-1" });

      vi.mocked(Submission.findOne).mockResolvedValue(null);

      vi.mocked(Submission.create).mockResolvedValue({
        _id: "sub-new",
        ...mockData,
      });

      const result = await submissionService.createSubmission(mockData);

      expect(Assignment.findById).toHaveBeenCalledWith(mockData.assignment);
      expect(User.findById).toHaveBeenCalledWith(mockData.student);
      expect(Submission.findOne).toHaveBeenCalledWith({
        assignment: mockData.assignment,
        student: mockData.student,
      });
      expect(Submission.create).toHaveBeenCalledWith(mockData);
      expect(result).toHaveProperty("_id", "sub-new");
    });

    it("should throw 404 if Assignment or User not found", async () => {
      vi.mocked(Assignment.findById).mockResolvedValue(null);
      vi.mocked(User.findById).mockResolvedValue({ _id: "user-1" });

      await expect(
        submissionService.createSubmission(mockData)
      ).rejects.toThrow("Invalid assignment or student");

      expect(Submission.create).not.toHaveBeenCalled();
    });

    it("should throw 400 if submission already exists", async () => {
      vi.mocked(Assignment.findById).mockResolvedValue({ _id: "ass-1" });
      vi.mocked(User.findById).mockResolvedValue({ _id: "user-1" });
      vi.mocked(Submission.findOne).mockResolvedValue({ _id: "existing-sub" });

      try {
        await submissionService.createSubmission(mockData);
      } catch (error) {
        expect(error.statusCode).toBe(400);
        expect(error.message).toBe(
          "You have already submitted this assignment"
        );
      }
    });
  });

  describe("updateSubmission", () => {
    const id = "sub-1";
    const updateData = { score: 10, invalidField: null };

    it("should update and return submission", async () => {
      const mockUpdated = { _id: id, score: 10 };

      mocks.mockPopulate.mockReturnValueOnce({ populate: mocks.mockPopulate });
      mocks.mockPopulate.mockReturnValueOnce(mockUpdated);

      const result = await submissionService.updateSubmission(id, updateData);

      expect(Submission.findByIdAndUpdate).toHaveBeenCalledWith(
        id,
        { $set: { score: 10 } },
        { new: true }
      );
      expect(result).toEqual(mockUpdated);
    });

    it("should throw 404 if submission not found to update", async () => {
      mocks.mockPopulate.mockReturnValueOnce({ populate: mocks.mockPopulate });
      mocks.mockPopulate.mockReturnValueOnce(null);

      try {
        await submissionService.updateSubmission(id, updateData);
      } catch (error) {
        expect(error.statusCode).toBe(404);
        expect(error.message).toBe(`Submission with id ${id} not found`);
      }
    });
  });

  describe("deleteSubmission", () => {
    it("should delete and return submission", async () => {
      const mockDeleted = { _id: "sub-1" };
      vi.mocked(Submission.findByIdAndDelete).mockResolvedValue(mockDeleted);

      const result = await submissionService.deleteSubmission("sub-1");

      expect(Submission.findByIdAndDelete).toHaveBeenCalledWith("sub-1");
      expect(result).toEqual(mockDeleted);
    });

    it("should throw 404 if submission not found to delete", async () => {
      vi.mocked(Submission.findByIdAndDelete).mockResolvedValue(null);
      const id = "sub-99";

      try {
        await submissionService.deleteSubmission(id);
      } catch (error) {
        expect(error.statusCode).toBe(404);
        expect(error.message).toBe(`Submission with id ${id} not found`);
      }
    });
  });

  describe("findByAssignment", () => {
    it("should return submissions for assignment sorted desc", async () => {
      const assignmentId = "ass-1";
      const mockSubmissions = [{ _id: "sub-1" }];

      mocks.mockSort.mockResolvedValue(mockSubmissions);

      const result = await submissionService.findByAssignment(assignmentId);

      expect(Submission.find).toHaveBeenCalledWith({
        assignment: assignmentId,
      });
      expect(mocks.mockPopulate).toHaveBeenCalledWith(
        "student",
        "full_name email"
      );
      expect(mocks.mockSort).toHaveBeenCalledWith({ createdAt: -1 });
      expect(result).toEqual(mockSubmissions);
    });
  });

  describe("findByStudent", () => {
    it("should return submissions for student sorted desc", async () => {
      const studentId = "user-1";
      const mockSubmissions = [{ _id: "sub-1" }];

      mocks.mockSort.mockResolvedValue(mockSubmissions);

      const result = await submissionService.findByStudent(studentId);

      expect(Submission.find).toHaveBeenCalledWith({ student: studentId });
      expect(mocks.mockPopulate).toHaveBeenCalledWith(
        "assignment",
        "title deadline"
      );
      expect(mocks.mockSort).toHaveBeenCalledWith({ createdAt: -1 });
      expect(result).toEqual(mockSubmissions);
    });
  });
});
