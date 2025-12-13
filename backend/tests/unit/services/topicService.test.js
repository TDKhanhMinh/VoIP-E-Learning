import { describe, it, expect, vi, beforeEach } from "vitest";
import * as topicService from "../../../src/service/topicService.js";
import Topic from "../../../src/model/topic.js";

// --- 1. SỬ DỤNG vi.hoisted ĐỂ KHẮC PHỤC LỖI HOISTING ---
const mocks = vi.hoisted(() => {
  const mockCreate = vi.fn();
  const mockAggregate = vi.fn();
  const mockFindByIdAndUpdate = vi.fn();
  const mockFindByIdAndDelete = vi.fn();

  return {
    mockCreate,
    mockAggregate,
    mockFindByIdAndUpdate,
    mockFindByIdAndDelete,
  };
});

// --- 2. Setup Mocks ---
vi.mock("../../../src/model/topic.js", () => ({
  default: {
    create: mocks.mockCreate,
    aggregate: mocks.mockAggregate,
    findByIdAndUpdate: mocks.mockFindByIdAndUpdate,
    findByIdAndDelete: mocks.mockFindByIdAndDelete,
  },
}));

describe("Topic Service", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // --- Test: createTopic ---
  describe("createTopic", () => {
    it("should create topic successfully", async () => {
      const topicData = {
        name: "Assignments",
        description: "Assignment related discussions",
        icon: "assignment-icon",
      };

      // Setup mock return
      mocks.mockCreate.mockResolvedValue({ _id: "topic123", ...topicData });

      const result = await topicService.createTopic(topicData);

      expect(Topic.create).toHaveBeenCalledWith(topicData);
      expect(result).toEqual({ _id: "topic123", ...topicData });
    });
  });

  // --- Test: getAllTopics ---
  describe("getAllTopics", () => {
    it("should return all topics with post counts", async () => {
      const mockTopics = [
        { _id: "1", name: "General", postCount: 5 },
        { _id: "2", name: "Homework", postCount: 3 },
      ];

      // Setup mock return
      mocks.mockAggregate.mockResolvedValue(mockTopics);

      const result = await topicService.getAllTopics();

      expect(Topic.aggregate).toHaveBeenCalled();

      // Kiểm tra xem aggregate có được gọi với một mảng (pipeline) không
      const pipeline = mocks.mockAggregate.mock.calls[0][0];
      expect(Array.isArray(pipeline)).toBe(true);

      // Kiểm tra pipeline có chứa các stage quan trọng (lookup, sort...)
      // (Không cần check quá chi tiết từng field của mongo syntax, chỉ cần đảm bảo logic gọi đúng)
      expect(pipeline).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ $sort: { createdAt: -1 } }),
          expect.objectContaining({ $lookup: expect.anything() }),
          expect.objectContaining({ $project: { posts: 0 } }),
        ])
      );

      expect(result).toEqual(mockTopics);
    });
  });

  // --- Test: updateTopic ---
  describe("updateTopic", () => {
    it("should update topic successfully", async () => {
      const id = "topic123";
      const updateData = { description: "Updated description" };
      const mockUpdated = { _id: id, ...updateData };

      mocks.mockFindByIdAndUpdate.mockResolvedValue(mockUpdated);

      const result = await topicService.updateTopic(id, updateData);

      // Quan trọng: Kiểm tra options { new: true } được truyền vào
      expect(Topic.findByIdAndUpdate).toHaveBeenCalledWith(id, updateData, {
        new: true,
      });
      expect(result).toEqual(mockUpdated);
    });
  });

  // --- Test: deleteTopic ---
  describe("deleteTopic", () => {
    it("should delete topic", async () => {
      const id = "topic123";
      mocks.mockFindByIdAndDelete.mockResolvedValue({ _id: id });

      await topicService.deleteTopic(id);

      expect(Topic.findByIdAndDelete).toHaveBeenCalledWith(id);
    });
  });
});
