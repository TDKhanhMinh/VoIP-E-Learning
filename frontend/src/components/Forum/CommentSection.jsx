import { useState } from "react";

export default function CommentSection({
  comments,
  user,
  canApprove,
  postId,
  onAddComment,
  onEditComment,
  onDeleteComment,
}) {
  const [newComment, setNewComment] = useState("");
  const [editingComment, setEditingComment] = useState(null);
  const [editCommentText, setEditCommentText] = useState("");

  const handleSubmitComment = () => {
    onAddComment(postId, newComment);
    setNewComment("");
  };

  const handleStartEdit = (comment) => {
    setEditingComment(comment._id);
    setEditCommentText(comment.content);
  };

  const handleSaveEdit = (commentId) => {
    onEditComment(postId, commentId, editCommentText);
    setEditingComment(null);
    setEditCommentText("");
  };

  const handleCancelEdit = () => {
    setEditingComment(null);
    setEditCommentText("");
  };

  return (
    <div className="border-t dark:border-gray-700 pt-6">
      <h3 className="text-xl font-semibold mb-4 dark:text-white">
        Bình luận ({comments?.length || 0})
      </h3>

      <div className="mb-6">
        <textarea
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Viết bình luận..."
          className="w-full p-3 border dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500 resize-none"
          rows="3"
        />
        <button
          onClick={handleSubmitComment}
          disabled={!newComment.trim()}
          className="mt-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:bg-gray-400 dark:disabled:bg-gray-600"
        >
          Gửi bình luận
        </button>
      </div>

      <div className="space-y-4">
        {comments?.map((comment) => (
          <div
            key={comment._id}
            className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg"
          >
            <div className="flex justify-between items-start mb-2">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-gray-800 dark:text-white">
                  {comment.author_name}
                </span>
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  {new Date(comment.createdAt).toLocaleDateString("vi-VN")}
                </span>
              </div>
              {(comment.author_id === user?._id || canApprove) && (
                <div className="flex gap-2">
                  {comment.author_id === user?._id &&
                    editingComment !== comment._id && (
                      <button
                        onClick={() => handleStartEdit(comment)}
                        className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 text-sm"
                      >
                        Sửa
                      </button>
                    )}
                  <button
                    onClick={() => onDeleteComment(postId, comment._id)}
                    className="text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300 text-sm"
                  >
                    Xóa
                  </button>
                </div>
              )}
            </div>
            {editingComment === comment._id ? (
              <div className="mt-2">
                <textarea
                  value={editCommentText}
                  onChange={(e) => setEditCommentText(e.target.value)}
                  className="w-full p-2 border dark:border-gray-600 rounded-lg text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white resize-none"
                  rows="3"
                />
                <div className="flex gap-2 mt-2">
                  <button
                    onClick={() => handleSaveEdit(comment._id)}
                    className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700"
                  >
                    Lưu
                  </button>
                  <button
                    onClick={handleCancelEdit}
                    className="bg-gray-300 dark:bg-gray-700 text-gray-700 dark:text-gray-200 px-3 py-1 rounded text-sm hover:bg-gray-400 dark:hover:bg-gray-600"
                  >
                    Hủy
                  </button>
                </div>
              </div>
            ) : (
              <p className="text-gray-700 dark:text-gray-300">
                {comment.content}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
