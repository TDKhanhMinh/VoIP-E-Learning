import { describe, it, expect, vi, beforeEach } from "vitest";
import * as submissionService from "../../../src/service/submissionService.js";
import User from "../../../src/model/user.js";
import Assignment from "../../../src/model/assignment.js";
import Submission from "../../../src/model/submission.js";

// --- 1. SỬ DỤNG vi.hoisted ĐỂ KHẮC PHỤC LỖI HOISTING ---
const mocks = vi.hoisted(() => {
  // Mock các hàm cuối chuỗi (terminal operations)
  const mockSort = vi.fn();

  // Mock populate: trả về chính nó và sort để hỗ trợ chaining tiếp
  // (Chúng ta sẽ override behavior này trong từng test case nếu cần)
  const mockPopulate = vi.fn(() => ({
    populate: mockPopulate,
    sort: mockSort,
  }));

  // Mock các hàm khởi tạo query
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

// --- 2. Setup Mocks cho Models ---

// Mock Submission Model
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

// Mock Assignment Model
vi.mock("../../../src/model/assignment.js", () => ({
  default: {
    findById: vi.fn(),
  },
}));

// Mock User Model
vi.mock("../../../src/model/user.js", () => ({
  default: {
    findById: vi.fn(),
  },
}));

describe("Submission Service", () => {
  // Reset mocks trước mỗi test case
  beforeEach(() => {
    vi.clearAllMocks();

    // Reset Default Behavior cho Chain
    // 1. find/find... trả về object chứa populate/sort
    mocks.mockFind.mockReturnValue({
      populate: mocks.mockPopulate,
      sort: mocks.mockSort,
    });
    mocks.mockFindById.mockReturnValue({ populate: mocks.mockPopulate });
    mocks.mockFindByIdAndUpdate.mockReturnValue({
      populate: mocks.mockPopulate,
    });

    // 2. populate trả về object chứa populate/sort (để chain tiếp)
    mocks.mockPopulate.mockReturnValue({
      populate: mocks.mockPopulate,
      sort: mocks.mockSort,
    });
  });

  // --- Structure Verification ---
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

  // --- Test: getAll ---
  describe("getAll", () => {
    it("should return submissions sorted by createdAt desc", async () => {
      const mockSubmissions = [{ _id: "1" }];
      // Setup mock: hàm cuối cùng được gọi là sort
      mocks.mockSort.mockResolvedValue(mockSubmissions);

      const result = await submissionService.getAll();

      expect(Submission.find).toHaveBeenCalled();
      // populate được gọi 2 lần
      expect(mocks.mockPopulate).toHaveBeenCalledTimes(2);
      expect(mocks.mockPopulate).toHaveBeenCalledWith(
        "assignment",
        "title deadline"
      );
      expect(mocks.mockPopulate).toHaveBeenCalledWith(
        "student",
        "full_name email"
      );
      // sort được gọi cuối cùng
      expect(mocks.mockSort).toHaveBeenCalledWith({ createdAt: -1 });
      expect(result).toEqual(mockSubmissions);
    });
  });

  // --- Test: findById ---
  describe("findById", () => {
    it("should return submission if found", async () => {
      const mockSubmission = { _id: "sub-123" };

      // LOGIC MOCK PHỨC TẠP:
      // Code: await Submission.findById(id).populate(...).populate(...)
      // populate được gọi 2 lần. Lần 2 phải trả về kết quả data (vì không có sort ở sau)

      // Call 1 (populate assignment): Trả về chain object để gọi tiếp populate student
      mocks.mockPopulate.mockReturnValueOnce({ populate: mocks.mockPopulate });
      // Call 2 (populate student): Trả về mockSubmission (kết quả cuối cùng)
      mocks.mockPopulate.mockReturnValueOnce(mockSubmission);

      const result = await submissionService.findById("sub-123");

      expect(Submission.findById).toHaveBeenCalledWith("sub-123");
      expect(mocks.mockPopulate).toHaveBeenCalledTimes(2);
      expect(result).toEqual(mockSubmission);
    });

    it("should throw 404 if submission not found", async () => {
      // Mock trả về null ở lần populate cuối cùng
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

  // --- Test: createSubmission ---
  describe("createSubmission", () => {
    const mockData = {
      assignment: "ass-1",
      student: "user-1",
      content: "file.pdf",
    };

    it("should create submission successfully", async () => {
      // 1. Mock Assignment & User exist
      vi.mocked(Assignment.findById).mockResolvedValue({ _id: "ass-1" });
      vi.mocked(User.findById).mockResolvedValue({ _id: "user-1" });

      // 2. Mock Submission not existed yet
      vi.mocked(Submission.findOne).mockResolvedValue(null);

      // 3. Mock Create
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
      // Mock Assignment null
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
      // Mock Existed
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

  // --- Test: updateSubmission ---
  describe("updateSubmission", () => {
    const id = "sub-1";
    const updateData = { score: 10, invalidField: null };

    it("should update and return submission", async () => {
      const mockUpdated = { _id: id, score: 10 };

      // Code: findByIdAndUpdate(...).populate(...).populate(...)
      // Cần setup mockPopulate trả về data ở lần gọi cuối
      mocks.mockPopulate.mockReturnValueOnce({ populate: mocks.mockPopulate }); // Call 1
      mocks.mockPopulate.mockReturnValueOnce(mockUpdated); // Call 2

      const result = await submissionService.updateSubmission(id, updateData);

      // Verify logic: null field bị xóa
      expect(Submission.findByIdAndUpdate).toHaveBeenCalledWith(
        id,
        { $set: { score: 10 } }, // invalidField bị xóa
        { new: true }
      );
      expect(result).toEqual(mockUpdated);
    });

    it("should throw 404 if submission not found to update", async () => {
      mocks.mockPopulate.mockReturnValueOnce({ populate: mocks.mockPopulate });
      mocks.mockPopulate.mockReturnValueOnce(null); // Not found

      try {
        await submissionService.updateSubmission(id, updateData);
      } catch (error) {
        expect(error.statusCode).toBe(404);
        expect(error.message).toBe(`Submission with id ${id} not found`);
      }
    });
  });

  // --- Test: deleteSubmission ---
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

  // --- Test: findByAssignment ---
  describe("findByAssignment", () => {
    it("should return submissions for assignment sorted desc", async () => {
      const assignmentId = "ass-1";
      const mockSubmissions = [{ _id: "sub-1" }];

      // find -> populate -> sort
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

  // --- Test: findByStudent ---
  describe("findByStudent", () => {
    it("should return submissions for student sorted desc", async () => {
      const studentId = "user-1";
      const mockSubmissions = [{ _id: "sub-1" }];

      // find -> populate -> sort
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
