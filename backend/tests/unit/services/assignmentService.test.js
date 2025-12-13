import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

// 1. MOCK MODELS
// Mock Assignment model
vi.mock("../../../src/model/assignment.js", () => ({
  default: {
    find: vi.fn(),
    findById: vi.fn(),
    findByIdAndUpdate: vi.fn(),
    findByIdAndDelete: vi.fn(),
    create: vi.fn(),
  },
}));

// Mock Class model
vi.mock("../../../src/model/class.js", () => ({
  default: {
    findById: vi.fn(),
  },
}));

// 2. IMPORT SERVICE & MODELS (Sau khi mock)
const assignmentService = await import(
  "../../../src/service/assignmentService.js"
);
const Assignment = (await import("../../../src/model/assignment.js")).default;
const Class = (await import("../../../src/model/class.js")).default;

describe("Assignment Service", () => {
  // Clear mock sau mỗi test case để tránh dữ liệu rác
  afterEach(() => {
    vi.clearAllMocks();
  });

  // =======================
  // getAll
  // =======================
  describe("getAll", () => {
    it("should return all assignments sorted by createdAt descending", async () => {
      const mockAssignments = [
        { _id: "1", title: "A1" },
        { _id: "2", title: "A2" },
      ];

      // Mock chain: find() -> sort()
      const mockSort = vi.fn().mockResolvedValue(mockAssignments);
      Assignment.find.mockReturnValue({ sort: mockSort });

      const result = await assignmentService.getAll();

      expect(Assignment.find).toHaveBeenCalled();
      expect(mockSort).toHaveBeenCalledWith({ createdAt: -1 });
      expect(result).toEqual(mockAssignments);
    });
  });

  // =======================
  // findById
  // =======================
  describe("findById", () => {
    it("should return assignment if found", async () => {
      const mockAssignment = { _id: "123", title: "Test" };
      Assignment.findById.mockResolvedValue(mockAssignment);

      const result = await assignmentService.findById("123");
      expect(result).toEqual(mockAssignment);
    });

    it("should throw 404 error if assignment not found", async () => {
      Assignment.findById.mockResolvedValue(null);

      try {
        await assignmentService.findById("invalid-id");
      } catch (error) {
        expect(error.message).toBe("Assignment with id invalid-id not found");
        expect(error.statusCode).toBe(404);
      }
    });
  });

  // =======================
  // getAssignmentByClassId
  // =======================
  describe("getAssignmentByClassId", () => {
    it("should return assignments with populate class and sorted", async () => {
      const classId = "class123";
      const mockResult = [{ _id: "a1", class: { name: "Math" } }];

      // Mock chain: find -> populate -> sort
      const mockSort = vi.fn().mockResolvedValue(mockResult);
      const mockPopulate = vi.fn().mockReturnValue({ sort: mockSort });
      Assignment.find.mockReturnValue({ populate: mockPopulate });

      const result = await assignmentService.getAssignmentByClassId(classId);

      expect(Assignment.find).toHaveBeenCalledWith({ class: classId });
      expect(mockPopulate).toHaveBeenCalledWith("class", "name");
      expect(mockSort).toHaveBeenCalledWith({ createdAt: -1 });
      expect(result).toEqual(mockResult);
    });

    it("should return empty array if null returned (edge case)", async () => {
      const mockSort = vi.fn().mockResolvedValue(null);
      const mockPopulate = vi.fn().mockReturnValue({ sort: mockSort });
      Assignment.find.mockReturnValue({ populate: mockPopulate });

      const result = await assignmentService.getAssignmentByClassId("classId");
      expect(result).toEqual([]);
    });
  });

  // =======================
  // createAssignment
  // =======================
  describe("createAssignment", () => {
    it("should create assignment if class exists", async () => {
      const data = { title: "New Assignment", class: "class123" };

      // Class tồn tại
      Class.findById.mockResolvedValue({ _id: "class123" });
      // Create thành công
      Assignment.create.mockResolvedValue({ _id: "newId", ...data });

      const result = await assignmentService.createAssignment(data);

      expect(Class.findById).toHaveBeenCalledWith(data.class);
      expect(Assignment.create).toHaveBeenCalledWith(data);
      expect(result._id).toBe("newId");
    });

    it("should throw 404 if class does not exist", async () => {
      Class.findById.mockResolvedValue(null);

      try {
        await assignmentService.createAssignment({ class: "invalid" });
      } catch (error) {
        expect(error.message).toBe("Class with id invalid not found");
        expect(error.statusCode).toBe(404);
      }

      // Đảm bảo không gọi create nếu check class thất bại
      expect(Assignment.create).not.toHaveBeenCalled();
    });
  });

  // =======================
  // updateAssignment
  // =======================
  describe("updateAssignment", () => {
    it("should update assignment and filter out null values", async () => {
      const id = "123";
      const updateData = {
        title: "Updated",
        description: null,
        dueDate: "2024",
      };

      // Mock trả về kết quả sau update
      Assignment.findByIdAndUpdate.mockResolvedValue({
        _id: id,
        title: "Updated",
      });

      const result = await assignmentService.updateAssignment(id, updateData);

      // QUAN TRỌNG: Kiểm tra xem logic xóa field null có hoạt động không
      // Expected: description bị xóa khỏi object updates
      const expectedUpdates = { title: "Updated", dueDate: "2024" };

      expect(Assignment.findByIdAndUpdate).toHaveBeenCalledWith(
        id,
        { $set: expectedUpdates },
        { new: true }
      );
      expect(result.title).toBe("Updated");
    });

    it("should throw 404 if assignment to update not found", async () => {
      Assignment.findByIdAndUpdate.mockResolvedValue(null);

      try {
        await assignmentService.updateAssignment("invalid", { title: "New" });
      } catch (error) {
        expect(error.message).toBe("Assignment with id invalid not found");
        expect(error.statusCode).toBe(404);
      }
    });
  });

  // =======================
  // deleteAssignment
  // =======================
  describe("deleteAssignment", () => {
    it("should delete assignment if found", async () => {
      Assignment.findByIdAndDelete.mockResolvedValue({ _id: "123" });

      const result = await assignmentService.deleteAssignment("123");
      expect(result._id).toBe("123");
    });

    it("should throw 404 if assignment to delete not found", async () => {
      Assignment.findByIdAndDelete.mockResolvedValue(null);

      try {
        await assignmentService.deleteAssignment("invalid");
      } catch (error) {
        expect(error.message).toBe("Assignment with id invalid not found");
        expect(error.statusCode).toBe(404);
      }
    });
  });
});
