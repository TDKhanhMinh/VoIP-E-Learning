import { describe, it, expect, vi, afterEach } from "vitest";

vi.mock("../../../src/model/comment.js", () => ({
  default: {
    create: vi.fn(),
    find: vi.fn(),
    countDocuments: vi.fn(),
    findByIdAndDelete: vi.fn(),
    findByIdAndUpdate: vi.fn(),
  },
}));

const commentService = await import("../../../src/service/commentService.js");
const Comment = (await import("../../../src/model/comment.js")).default;

describe("Comment Service", () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  describe("createComment", () => {
    it("should create a new comment", async () => {
      const inputData = {
        content: "Nice post!",
        post_id: "post1",
        user_id: "user1",
      };
      const mockResult = { _id: "comment1", ...inputData };

      Comment.create.mockResolvedValue(mockResult);

      const result = await commentService.createComment(inputData);

      expect(Comment.create).toHaveBeenCalledWith(inputData);
      expect(result).toEqual(mockResult);
    });
  });

  describe("getCommentsByPost", () => {
    it("should return comments and hasMore=true if more items exist", async () => {
      const postId = "post1";
      const params = { page: 1, limit: 5 };
      const mockComments = [{ _id: "1" }, { _id: "2" }];

      const mockLimit = vi.fn().mockResolvedValue(mockComments);
      const mockSkip = vi.fn().mockReturnValue({ limit: mockLimit });
      const mockSort = vi.fn().mockReturnValue({ skip: mockSkip });

      Comment.find.mockReturnValue({ sort: mockSort });
      Comment.countDocuments.mockResolvedValue(10);

      const result = await commentService.getCommentsByPost(postId, params);

      expect(Comment.find).toHaveBeenCalledWith({ post_id: postId });
      expect(mockSort).toHaveBeenCalledWith({ createdAt: 1 });
      expect(mockSkip).toHaveBeenCalledWith(0); 
      expect(mockLimit).toHaveBeenCalledWith(5);

      expect(Comment.countDocuments).toHaveBeenCalledWith({ post_id: postId });
      expect(result.comments).toEqual(mockComments);
      expect(result.hasMore).toBe(true); 
    });

    it("should return hasMore=false if no more items", async () => {
      const postId = "post1";
      const params = { page: 2, limit: 5 };
      const mockComments = [{ _id: "6" }]; 

      const mockLimit = vi.fn().mockResolvedValue(mockComments);
      const mockSkip = vi.fn().mockReturnValue({ limit: mockLimit });
      const mockSort = vi.fn().mockReturnValue({ skip: mockSkip });
      Comment.find.mockReturnValue({ sort: mockSort });

      Comment.countDocuments.mockResolvedValue(6);

      const result = await commentService.getCommentsByPost(postId, params);

      expect(mockSkip).toHaveBeenCalledWith(5);
      expect(result.hasMore).toBe(false); 
    });
  });

  describe("deleteComment", () => {
    it("should delete comment by id", async () => {
      const commentId = "comment123";
      Comment.findByIdAndDelete.mockResolvedValue({ _id: commentId });

      await commentService.deleteComment(commentId);

      expect(Comment.findByIdAndDelete).toHaveBeenCalledWith(commentId);
    });
  });

  describe("updateComment", () => {
    it("should update comment and return new data", async () => {
      const commentId = "comment123";
      const updateData = { content: "Updated content" };
      const mockUpdated = { _id: commentId, content: "Updated content" };

      Comment.findByIdAndUpdate.mockResolvedValue(mockUpdated);

      const result = await commentService.updateComment(commentId, updateData);

      expect(Comment.findByIdAndUpdate).toHaveBeenCalledWith(
        commentId,
        updateData,
        { new: true } 
      );
      expect(result).toEqual(mockUpdated);
    });
  });
});
