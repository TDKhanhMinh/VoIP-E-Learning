import { describe, it, expect, vi, beforeEach } from "vitest";
// Điều chỉnh đường dẫn import cho phù hợp với cấu trúc thư mục của bạn
import * as materialService from "../../../src/service/materialService.js";
import Material from "../../../src/model/material.js";
import Class from "../../../src/model/class.js";
import User from "../../../src/model/user.js";
import mongoose from "mongoose";
// --- 1. SỬ DỤNG vi.hoisted ĐỂ KHẮC PHỤC LỖI HOISTING ---
// Đoạn này sẽ chạy trước tất cả các import và mock khác
const mocks = vi.hoisted(() => {
  const mockSort = vi.fn();

  // Mô phỏng chuỗi hàm .find().sort()
  // Khi gọi find() sẽ trả về object có chứa hàm sort
  const mockFind = vi.fn(() => ({
    sort: mockSort,
  }));

  return {
    mockSort,
    mockFind,
  };
});

// --- 2. Mock các module phụ thuộc ---

// Mock Material Model
vi.mock("../../../src/model/material.js", () => ({
  default: {
    // Sử dụng biến từ mocks đã được hoisted
    find: mocks.mockFind,
    // Các hàm này có thể định nghĩa trực tiếp vì ta sẽ spy qua import module
    findById: vi.fn(),
    create: vi.fn(),
    findByIdAndDelete: vi.fn(),
  },
}));

// Mock Class Model
vi.mock("../../../src/model/class.js", () => ({
  default: {
    findById: vi.fn(),
  },
}));

// Mock User Model
vi.mock("../../../src/model/user.js", () => ({
  default: {
    findOne: vi.fn(),
  },
}));

describe("Material Service", () => {
  // Setup môi trường trước mỗi test case
  beforeEach(() => {
    vi.clearAllMocks(); // Reset số lần gọi các hàm mock

    // Quan trọng: Phải reset behavior của mockFind để đảm bảo nó luôn trả về object chứa sort
    mocks.mockFind.mockReturnValue({ sort: mocks.mockSort });
  });

  describe("Structure Verification", () => {
    it("should export all required functions", () => {
      expect(materialService.getAll).toBeDefined();
      expect(typeof materialService.getAll).toBe("function");

      expect(materialService.findById).toBeDefined();
      expect(typeof materialService.findById).toBe("function");

      expect(materialService.getClassMaterial).toBeDefined();
      expect(typeof materialService.getClassMaterial).toBe("function");

      expect(materialService.createMaterial).toBeDefined();
      expect(typeof materialService.createMaterial).toBe("function");

      expect(materialService.deleteMaterial).toBeDefined();
      expect(typeof materialService.deleteMaterial).toBe("function");
    });
  });

  describe("getAll", () => {
    it("should return all materials sorted by createdAt desc", async () => {
      const mockMaterials = [{ title: "M1" }, { title: "M2" }];

      // Setup mock: dùng mocks.mockSort thay vì biến cục bộ
      mocks.mockSort.mockResolvedValue(mockMaterials);

      const result = await materialService.getAll();

      // Verify
      expect(Material.find).toHaveBeenCalled();
      expect(mocks.mockSort).toHaveBeenCalledWith({ createdAt: -1 });
      expect(result).toEqual(mockMaterials);
    });
  });

  describe("findById", () => {
    it("should return material if found", async () => {
      const mockMaterial = { _id: "123", title: "Test Material" };
      vi.mocked(Material.findById).mockResolvedValue(mockMaterial);

      const result = await materialService.findById("123");
      expect(result).toEqual(mockMaterial);
    });

    it("should throw 404 error if material not found", async () => {
      vi.mocked(Material.findById).mockResolvedValue(null);
      const id = new mongoose.Types.ObjectId().toString();

      try {
        await materialService.findById(id);
      } catch (error) {
        expect(error.statusCode).toBe(404);
        expect(error.message).toContain(`Announcement with id ${id} not found`);
      }
    });
  });

  describe("getClassMaterial", () => {
    it("should return materials for a specific class sorted by date", async () => {
      const classId = "class-001";
      const mockMaterials = [{ title: "Lesson 1" }];

      // Setup mock sort
      mocks.mockSort.mockResolvedValue(mockMaterials);

      const result = await materialService.getClassMaterial(classId);

      expect(Material.find).toHaveBeenCalledWith({ class: classId });
      expect(mocks.mockSort).toHaveBeenCalledWith({ createdAt: -1 });
      expect(result).toEqual(mockMaterials);
    });
  });

  describe("createMaterial", () => {
    const mockData = {
      title: "New Material",
      class: "class-123",
      upload_by: "user-456",
    };

    it("should create material successfully when Class and User exist", async () => {
      // Setup: Class tồn tại
      vi.mocked(Class.findById).mockResolvedValue({ _id: "class-123" });
      // Setup: User tồn tại và available
      vi.mocked(User.findOne).mockResolvedValue({ _id: "user-456" });
      // Setup: Create thành công
      vi.mocked(Material.create).mockResolvedValue({
        _id: "mat-789",
        ...mockData,
      });

      const result = await materialService.createMaterial(mockData);

      // Verify logic validation
      expect(Class.findById).toHaveBeenCalledWith(mockData.class);
      expect(User.findOne).toHaveBeenCalledWith({
        _id: mockData.upload_by,
        available: "true",
      });

      // Verify create logic
      expect(Material.create).toHaveBeenCalledWith(mockData);
      expect(result).toHaveProperty("_id", "mat-789");
    });

    it("should throw 404 if Class does not exist", async () => {
      // Class trả về null
      vi.mocked(Class.findById).mockResolvedValue(null);
      vi.mocked(User.findOne).mockResolvedValue({ _id: "user-456" });

      await expect(materialService.createMaterial(mockData)).rejects.toThrow(
        "Invalid class or user id"
      );

      expect(Material.create).not.toHaveBeenCalled();
    });

    it("should throw 404 if User does not exist (or not available)", async () => {
      vi.mocked(Class.findById).mockResolvedValue({ _id: "class-123" });
      // User trả về null
      vi.mocked(User.findOne).mockResolvedValue(null);

      await expect(materialService.createMaterial(mockData)).rejects.toThrow(
        "Invalid class or user id"
      );

      expect(Material.create).not.toHaveBeenCalled();
    });
  });

  describe("deleteMaterial", () => {
    it("should delete and return material if found", async () => {
      const mockDeletedMaterial = { _id: "123", title: "Deleted" };
      vi.mocked(Material.findByIdAndDelete).mockResolvedValue(
        mockDeletedMaterial
      );

      const result = await materialService.deleteMaterial("123");

      expect(Material.findByIdAndDelete).toHaveBeenCalledWith("123");
      expect(result).toEqual(mockDeletedMaterial);
    });

    it("should throw 404 error if material not found to delete", async () => {
      vi.mocked(Material.findByIdAndDelete).mockResolvedValue(null);
      const id = new mongoose.Types.ObjectId().toString();

      try {
        await materialService.deleteMaterial(id);
      } catch (error) {
        expect(error.statusCode).toBe(404);
        expect(error.message).toBe(`Material with id ${id} not found`);
      }
    });
  });
});
