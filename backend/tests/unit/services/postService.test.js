import { describe, it, expect, vi, beforeEach } from "vitest";
import * as postService from "../../../src/service/postService.js";
import post from "../../../src/model/post.js";
import mongoose from "mongoose";

const mocks = vi.hoisted(() => {
  const mockSort = vi.fn();
  const mockFind = vi.fn(() => ({
    sort: mockSort,
  }));

  const mockObjectId = vi.fn(function (id) {
    return new String(id);
  });

  return {
    mockSort,
    mockFind,
    mockObjectId,
  };
});

vi.mock("mongoose", async () => {
  const actual = await vi.importActual("mongoose");
  return {
    ...actual,
    default: {
      ...actual.default,
      Types: {
        ...actual.default.Types,
        ObjectId: mocks.mockObjectId,
      },
    },
  };
});

vi.mock("../../../src/model/post.js", () => ({
  default: {
    create: vi.fn(),
    find: mocks.mockFind,
    aggregate: vi.fn(),
    findByIdAndUpdate: vi.fn(),
    findByIdAndDelete: vi.fn(),
  },
}));

describe("Post Service", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    mocks.mockFind.mockReturnValue({ sort: mocks.mockSort });
    mocks.mockObjectId.mockClear();
  });

  describe("Structure Verification", () => {
    it("should export all required functions", () => {
      expect(postService.createPost).toBeDefined();
      expect(postService.getPostsByClass).toBeDefined();
      expect(postService.getPostsByTopic).toBeDefined();
      expect(postService.getForumPosts).toBeDefined();
      expect(postService.updatePost).toBeDefined();
      expect(postService.deletePost).toBeDefined();
      expect(postService.getPostById).toBeDefined();
    });
  });

  describe("createPost", () => {
    it("should create a new post", async () => {
      const mockData = { title: "New Post", content: "Content" };
      vi.mocked(post.create).mockResolvedValue({ _id: "1", ...mockData });

      const result = await postService.createPost(mockData);

      expect(post.create).toHaveBeenCalledWith(mockData);
      expect(result).toEqual({ _id: "1", ...mockData });
    });
  });

  describe("getPostsByClass", () => {
    it("should return posts for a class sorted by date", async () => {
      const classId = "class-123";
      const mockPosts = [{ title: "Post 1" }];

      mocks.mockSort.mockResolvedValue(mockPosts);

      const result = await postService.getPostsByClass(classId);

      expect(post.find).toHaveBeenCalledWith({ class_id: classId });
      expect(mocks.mockSort).toHaveBeenCalledWith({ createdAt: -1 });
      expect(result).toEqual(mockPosts);
    });
  });

  describe("getPostsByTopic", () => {
    it("should return posts for a topic sorted by date", async () => {
      const topicId = "topic-456";
      const mockPosts = [{ title: "Topic Post" }];

      mocks.mockSort.mockResolvedValue(mockPosts);

      const result = await postService.getPostsByTopic(topicId);

      expect(post.find).toHaveBeenCalledWith({ topic_id: topicId });
      expect(mocks.mockSort).toHaveBeenCalledWith({ createdAt: -1 });
      expect(result).toEqual(mockPosts);
    });
  });

  describe("getForumPosts", () => {
    it("should return aggregated forum posts", async () => {
      const mockAggregatedPosts = [
        { title: "Forum Post 1", topic: { name: "General" }, commentCount: 5 },
      ];
      vi.mocked(post.aggregate).mockResolvedValue(mockAggregatedPosts);

      const result = await postService.getForumPosts();

      expect(post.aggregate).toHaveBeenCalled();
      expect(Array.isArray(vi.mocked(post.aggregate).mock.calls[0][0])).toBe(
        true
      );
      expect(result).toEqual(mockAggregatedPosts);
    });
  });

  describe("updatePost", () => {
    it("should update post and return the new version", async () => {
      const postId = "post-1";
      const updateData = { title: "Updated Title" };
      const mockUpdatedPost = { _id: postId, ...updateData };

      vi.mocked(post.findByIdAndUpdate).mockResolvedValue(mockUpdatedPost);

      const result = await postService.updatePost(postId, updateData);

      expect(post.findByIdAndUpdate).toHaveBeenCalledWith(postId, updateData, {
        new: true,
      });
      expect(result).toEqual(mockUpdatedPost);
    });
  });

  describe("deletePost", () => {
    it("should delete post by id", async () => {
      const postId = "post-1";
      vi.mocked(post.findByIdAndDelete).mockResolvedValue({ _id: postId });

      await postService.deletePost(postId);

      expect(post.findByIdAndDelete).toHaveBeenCalledWith(postId);
    });
  });

  describe("getPostById", () => {
    it("should return a single post with comments and topic details", async () => {
      const postId = "post-123";
      const mockAggregatedResult = [
        { _id: postId, title: "Detail Post", comments: [] },
      ];

      vi.mocked(post.aggregate).mockResolvedValue(mockAggregatedResult);

      const result = await postService.getPostById(postId);

      expect(mocks.mockObjectId).toHaveBeenNthCalledWith(1, postId);

      expect(post.aggregate).toHaveBeenCalled();
      expect(result).toEqual(mockAggregatedResult[0]);
    });

    it("should return undefined if post not found", async () => {
      vi.mocked(post.aggregate).mockResolvedValue([]);

      const result = await postService.getPostById("non-existent-id");

      expect(result).toBeUndefined();
    });
  });
});
