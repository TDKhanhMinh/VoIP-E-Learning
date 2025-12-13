import { describe, it, expect, vi, beforeEach } from "vitest";
import * as semesterService from "../../../src/service/semesterService.js";
import Semester from "../../../src/model/semester.js";

// --- 1. SỬ DỤNG vi.hoisted ĐỂ KHẮC PHỤC LỖI HOISTING ---
const mocks = vi.hoisted(() => {
  const mockSort = vi.fn();
  // Mock chain: Semester.find().sort()
  const mockFind = vi.fn(() => ({
    sort: mockSort,
  }));

  return {
    mockSort,
    mockFind,
  };
});

// --- 2. Setup Mocks ---

// Mock Semester Model
vi.mock("../../../src/model/semester.js", () => ({
  default: {
    find: mocks.mockFind, // Sử dụng biến hoisted
    findById: vi.fn(),
    create: vi.fn(),
    findByIdAndUpdate: vi.fn(),
    findByIdAndDelete: vi.fn(),
    findOne: vi.fn(), // Dùng cho validateName
  },
}));

describe("Semester Service", () => {
  // Reset mocks trước mỗi test case
  beforeEach(() => {
    vi.clearAllMocks();

    // Reset behavior của chain mock
    mocks.mockFind.mockReturnValue({ sort: mocks.mockSort });
  });

  // --- Structure Verification ---
  describe("Structure Verification", () => {
    it("should export all required functions", () => {
      expect(semesterService.getAll).toBeDefined();
      expect(semesterService.findById).toBeDefined();
      expect(semesterService.createSemester).toBeDefined();
      expect(semesterService.updateSemester).toBeDefined();
      expect(semesterService.deleteSemester).toBeDefined();
    });
  });

  // --- Test: getAll ---
  describe("getAll", () => {
    it("should return all semesters sorted by createdAt desc", async () => {
      const mockSemesters = [{ name: "Spring 2024" }, { name: "Fall 2023" }];

      // Setup mock sort trả về kết quả
      mocks.mockSort.mockResolvedValue(mockSemesters);

      const result = await semesterService.getAll();

      expect(Semester.find).toHaveBeenCalled();
      expect(mocks.mockSort).toHaveBeenCalledWith({ createdAt: -1 });
      expect(result).toEqual(mockSemesters);
    });
  });

  // --- Test: findById ---
  describe("findById", () => {
    it("should return semester if found", async () => {
      const mockSemester = { _id: "123", name: "Spring 2024" };
      vi.mocked(Semester.findById).mockResolvedValue(mockSemester);

      const result = await semesterService.findById("123");

      expect(Semester.findById).toHaveBeenCalledWith("123");
      expect(result).toEqual(mockSemester);
    });

    it("should throw 404 error if semester not found", async () => {
      vi.mocked(Semester.findById).mockResolvedValue(null);
      const id = "999";

      try {
        await semesterService.findById(id);
      } catch (error) {
        expect(error.statusCode).toBe(404);
        expect(error.message).toContain(`Announcement with id ${id} not found`);
      }
    });
  });

  // --- Test: createSemester ---
  describe("createSemester", () => {
    const mockData = { name: "Summer 2024", start_date: "2024-06-01" };

    it("should create semester if name is valid (unique)", async () => {
      // 1. Validate: findOne trả về null (chưa tồn tại)
      vi.mocked(Semester.findOne).mockResolvedValue(null);

      // 2. Create: trả về data mới
      vi.mocked(Semester.create).mockResolvedValue({
        _id: "new-id",
        ...mockData,
      });

      const result = await semesterService.createSemester(mockData);

      expect(Semester.findOne).toHaveBeenCalledWith({ name: mockData.name });
      expect(Semester.create).toHaveBeenCalledWith(mockData);
      expect(result).toEqual({ _id: "new-id", ...mockData });
    });

    it("should throw 400 error if semester name already exists", async () => {
      // Validate: findOne trả về object (đã tồn tại)
      vi.mocked(Semester.findOne).mockResolvedValue({
        _id: "old-id",
        name: mockData.name,
      });

      await expect(semesterService.createSemester(mockData)).rejects.toThrow(
        `Semester name ${mockData.name} already declared`
      );

      // Đảm bảo không gọi create
      expect(Semester.create).not.toHaveBeenCalled();
    });
  });

  // --- Test: updateSemester ---
  describe("updateSemester", () => {
    const id = "123";
    const updateData = { name: "Updated Name", description: null }; // null sẽ bị filter

    it("should update semester and return new data", async () => {
      const mockUpdated = { _id: id, name: "Updated Name" };
      vi.mocked(Semester.findByIdAndUpdate).mockResolvedValue(mockUpdated);

      const result = await semesterService.updateSemester(id, updateData);

      // Verify logic filter null
      expect(Semester.findByIdAndUpdate).toHaveBeenCalledWith(
        id,
        { $set: { name: "Updated Name" } }, // description bị xóa
        { new: true }
      );
      expect(result).toEqual(mockUpdated);
    });

    it("should throw 404 if semester not found to update", async () => {
      vi.mocked(Semester.findByIdAndUpdate).mockResolvedValue(null);

      try {
        await semesterService.updateSemester(id, updateData);
      } catch (error) {
        expect(error.statusCode).toBe(404);
        expect(error.message).toBe("Semester not found");
      }
    });
  });

  // --- Test: deleteSemester ---
  describe("deleteSemester", () => {
    it("should delete and return semester if found", async () => {
      const mockDeleted = { _id: "123", name: "Deleted" };
      vi.mocked(Semester.findByIdAndDelete).mockResolvedValue(mockDeleted);

      const result = await semesterService.deleteSemester("123");

      expect(Semester.findByIdAndDelete).toHaveBeenCalledWith("123");
      expect(result).toEqual(mockDeleted);
    });

    it("should throw 404 error if semester not found to delete", async () => {
      vi.mocked(Semester.findByIdAndDelete).mockResolvedValue(null);

      try {
        await semesterService.deleteSemester("999");
      } catch (error) {
        expect(error.statusCode).toBe(404);
        expect(error.message).toBe("Semester not found");
      }
    });
  });
});
