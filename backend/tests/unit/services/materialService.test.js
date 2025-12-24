import { describe, it, expect, vi, beforeEach } from "vitest";
import * as materialService from "../../../src/service/materialService.js";
import Material from "../../../src/model/material.js";
import Class from "../../../src/model/class.js";
import User from "../../../src/model/user.js";
import mongoose from "mongoose";
const mocks = vi.hoisted(() => {
  const mockSort = vi.fn();

  const mockFind = vi.fn(() => ({
    sort: mockSort,
  }));

  return {
    mockSort,
    mockFind,
  };
});

vi.mock("../../../src/model/material.js", () => ({
  default: {
    find: mocks.mockFind,
    findById: vi.fn(),
    create: vi.fn(),
    findByIdAndDelete: vi.fn(),
  },
}));

vi.mock("../../../src/model/class.js", () => ({
  default: {
    findById: vi.fn(),
  },
}));

vi.mock("../../../src/model/user.js", () => ({
  default: {
    findOne: vi.fn(),
  },
}));

describe("Material Service", () => {
  beforeEach(() => {
    vi.clearAllMocks();

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

      mocks.mockSort.mockResolvedValue(mockMaterials);

      const result = await materialService.getAll();

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
      vi.mocked(Class.findById).mockResolvedValue({ _id: "class-123" });
      vi.mocked(User.findOne).mockResolvedValue({ _id: "user-456" });
      vi.mocked(Material.create).mockResolvedValue({
        _id: "mat-789",
        ...mockData,
      });

      const result = await materialService.createMaterial(mockData);

      expect(Class.findById).toHaveBeenNthCalledWith(1, mockData.class);
      expect(User.findOne).toHaveBeenNthCalledWith(1, {
        _id: mockData.upload_by,
        available: "true",
      });

      expect(Material.create).toHaveBeenNthCalledWith(1, mockData);
      expect(result).toHaveProperty("_id", "mat-789");
    });

    it("should throw 404 if Class does not exist", async () => {
      vi.mocked(Class.findById).mockResolvedValue(null);
      vi.mocked(User.findOne).mockResolvedValue({ _id: "user-456" });

      await expect(materialService.createMaterial(mockData)).rejects.toThrow(
        "Invalid class or user id"
      );

      expect(Material.create).not.toHaveBeenCalled();
    });

    it("should throw 404 if User does not exist (or not available)", async () => {
      vi.mocked(Class.findById).mockResolvedValue({ _id: "class-123" });
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

      expect(Material.findByIdAndDelete).toHaveBeenNthCalledWith(1, "123");
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
