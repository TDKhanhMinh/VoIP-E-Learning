import { describe, it, expect, vi, afterEach } from "vitest";

import * as announcementService from "../../../src/service/announcementService.js";
import Announcement from "../../../src/model/announcement.js";
import Class from "../../../src/model/class.js";
import User from "../../../src/model/user.js";

vi.mock("../../../src/model/announcement.js", () => {
  return {
    default: {
      find: vi.fn(),
      findById: vi.fn(),
      create: vi.fn(),
      findByIdAndUpdate: vi.fn(),
      findByIdAndDelete: vi.fn(),
    },
  };
});

vi.mock("../../../src/model/class.js", () => ({
  default: { findById: vi.fn() },
}));

vi.mock("../../../src/model/user.js", () => ({
  default: { findById: vi.fn() },
}));

describe("Announcement Service", () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  describe("getAll", () => {
    it("should return all announcements with populate and sort", async () => {
      const mockSort = vi
        .fn()
        .mockResolvedValue(["announcement1", "announcement2"]);
      const mockPopulate2 = vi.fn().mockReturnValue({ sort: mockSort });
      const mockPopulate1 = vi
        .fn()
        .mockReturnValue({ populate: mockPopulate2 });

      Announcement.find.mockReturnValue({ populate: mockPopulate1 });

      const result = await announcementService.getAll();

      expect(Announcement.find).toHaveBeenCalled();
      expect(mockPopulate1).toHaveBeenCalledWith("class", "name code");
      expect(mockPopulate2).toHaveBeenCalledWith(
        "created_by",
        "full_name email"
      );
      expect(mockSort).toHaveBeenCalledWith({ createdAt: -1 });
      expect(result).toEqual(["announcement1", "announcement2"]);
    });
  });

  describe("findById", () => {
    it("should return announcement if found", async () => {
      const mockResult = { _id: "123", title: "Test" };

      const mockPopulate2 = vi.fn().mockResolvedValue(mockResult);
      const mockPopulate1 = vi
        .fn()
        .mockReturnValue({ populate: mockPopulate2 });

      Announcement.findById.mockReturnValue({ populate: mockPopulate1 });

      const result = await announcementService.findById("123");
      expect(result).toEqual(mockResult);
    });

    it("should throw 404 if not found", async () => {
      const mockPopulate2 = vi.fn().mockResolvedValue(null);
      const mockPopulate1 = vi
        .fn()
        .mockReturnValue({ populate: mockPopulate2 });
      Announcement.findById.mockReturnValue({ populate: mockPopulate1 });

      await expect(announcementService.findById("invalid_id")).rejects.toThrow(
        "Announcement with id invalid_id not found"
      );
    });
  });

  describe("getByClass", () => {
    it("should throw 404 if class does not exist", async () => {
      Class.findById.mockResolvedValue(null); 

      await expect(announcementService.getByClass("class_id")).rejects.toThrow(
        "Class with id class_id not found"
      );
    });

    it("should return announcements if class exists", async () => {
      Class.findById.mockResolvedValue({ _id: "class_id" }); 

      const mockSort = vi.fn().mockResolvedValue(["data"]);
      const mockPopulate2 = vi.fn().mockReturnValue({ sort: mockSort });
      const mockPopulate1 = vi
        .fn()
        .mockReturnValue({ populate: mockPopulate2 });

      Announcement.find.mockReturnValue({ populate: mockPopulate1 });

      const result = await announcementService.getByClass("class_id");

      expect(Class.findById).toHaveBeenCalledWith("class_id");
      expect(Announcement.find).toHaveBeenCalledWith({ class: "class_id" });
      expect(result).toEqual(["data"]);
    });
  });

  describe("createAnnouncement", () => {
    it("should throw 404 if class or creator not found", async () => {
      Class.findById.mockResolvedValue(null); 
      User.findById.mockResolvedValue({ _id: "user_id" });

      await expect(
        announcementService.createAnnouncement({
          class: "no_class",
          created_by: "user",
        })
      ).rejects.toThrow("Invalid class or creator");
    });

    it("should create announcement if data valid", async () => {
      Class.findById.mockResolvedValue({ _id: "class_id" });
      User.findById.mockResolvedValue({ _id: "user_id" });
      Announcement.create.mockResolvedValue({ _id: "new_announcement" });

      const data = { class: "class_id", created_by: "user_id", title: "New" };
      const result = await announcementService.createAnnouncement(data);

      expect(Announcement.create).toHaveBeenCalledWith(data);
      expect(result).toEqual({ _id: "new_announcement" });
    });
  });

  describe("updateAnnouncement", () => {
    it("should update and return new data (ignoring null fields)", async () => {
      Announcement.findByIdAndUpdate.mockResolvedValue({
        _id: "123",
        title: "Updated",
      });

      const result = await announcementService.updateAnnouncement("123", {
        title: "Updated",
        description: null,
      });

      expect(Announcement.findByIdAndUpdate).toHaveBeenCalledWith(
        "123",
        { $set: { title: "Updated" } },
        { new: true }
      );
      expect(result).toEqual({ _id: "123", title: "Updated" });
    });

    it("should throw 404 if id not found when updating", async () => {
      Announcement.findByIdAndUpdate.mockResolvedValue(null);
      await expect(
        announcementService.updateAnnouncement("123", {})
      ).rejects.toThrow("Announcement with id 123 not found");
    });
  });

  describe("deleteAnnouncement", () => {
    it("should delete and return data", async () => {
      Announcement.findByIdAndDelete.mockResolvedValue({ _id: "123" });
      const result = await announcementService.deleteAnnouncement("123");
      expect(result).toEqual({ _id: "123" });
    });

    it("should throw 404 if id not found when deleting", async () => {
      Announcement.findByIdAndDelete.mockResolvedValue(null);
      await expect(
        announcementService.deleteAnnouncement("123")
      ).rejects.toThrow("Announcement with id 123 not found");
    });
  });
});
