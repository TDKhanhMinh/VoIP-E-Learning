import { describe, it, expect, vi, beforeEach } from "vitest";
import * as topicService from "../../../src/service/topicService.js";
import Topic from "../../../src/model/topic.js";

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

  describe("createTopic", () => {
    it("should create topic successfully", async () => {
      const topicData = {
        name: "Assignments",
        description: "Assignment related discussions",
        icon: "assignment-icon",
      };

      mocks.mockCreate.mockResolvedValue({ _id: "topic123", ...topicData });

      const result = await topicService.createTopic(topicData);

      expect(Topic.create).toHaveBeenCalledWith(topicData);
      expect(result).toEqual({ _id: "topic123", ...topicData });
    });
  });

  describe("getAllTopics", () => {
    it("should return all topics with post counts", async () => {
      const mockTopics = [
        { _id: "1", name: "General", postCount: 5 },
        { _id: "2", name: "Homework", postCount: 3 },
      ];

      mocks.mockAggregate.mockResolvedValue(mockTopics);

      const result = await topicService.getAllTopics();

      expect(Topic.aggregate).toHaveBeenCalled();

      const pipeline = mocks.mockAggregate.mock.calls[0][0];
      expect(Array.isArray(pipeline)).toBe(true);

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

  describe("updateTopic", () => {
    it("should update topic successfully", async () => {
      const id = "topic123";
      const updateData = { description: "Updated description" };
      const mockUpdated = { _id: id, ...updateData };

      mocks.mockFindByIdAndUpdate.mockResolvedValue(mockUpdated);

      const result = await topicService.updateTopic(id, updateData);

      expect(Topic.findByIdAndUpdate).toHaveBeenCalledWith(id, updateData, {
        new: true,
      });
      expect(result).toEqual(mockUpdated);
    });
  });

  describe("deleteTopic", () => {
    it("should delete topic", async () => {
      const id = "topic123";
      mocks.mockFindByIdAndDelete.mockResolvedValue({ _id: id });

      await topicService.deleteTopic(id);

      expect(Topic.findByIdAndDelete).toHaveBeenCalledWith(id);
    });
  });
});
