import CommentSection from "./CommentSection";

export default function PostDetailModal({
  show,
  post,
  user,
  canApprove,
  onClose,
  onApprovePost,
  onRejectPost,
  onAddComment,
  onEditComment,
  onDeleteComment,
}) {
  if (!show || !post) return null;

  const getStatusBadge = (status) => {
    const styles = {
      pending: "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-400",
      approved: "bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400",
      rejected: "bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-400",
    };
    const labels = {
      pending: "Chờ duyệt",
      approved: "Đã duyệt",
      rejected: "Từ chối",
    };
    return (
      <span
        className={`px-2 py-1 rounded text-xs font-medium ${styles[status]}`}
      >
        {labels[status]}
      </span>
    );
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 dark:bg-black/60 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-start mb-4">
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-gray-800 mb-2">
                {post.title}
              </h2>
              <div className="flex items-center gap-3 text-sm text-gray-600">
                <span className="font-medium">{post.author?.full_name}</span>
                <span>•</span>
                <span>
                  {new Date(post.createdAt).toLocaleDateString("vi-VN")}
                </span>
                {post.topic && (
                  <>
                    <span>•</span>
                    <span className="text-blue-600">{post.topic.title}</span>
                  </>
                )}
                <span>•</span>
                {getStatusBadge(post.status)}
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 text-2xl"
            >
              ×
            </button>
          </div>

          <div className="prose max-w-none mb-6">
            <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">{post.content}</p>
          </div>

          {canApprove && post.status === "pending" && (
            <div className="flex gap-3 mb-6 pb-6 border-b dark:border-gray-700">
              <button
                onClick={() => onApprovePost(post._id)}
                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
              >
                Duyệt bài
              </button>
              <button
                onClick={() => onRejectPost(post._id)}
                className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
              >
                Từ chối
              </button>
            </div>
          )}

          <CommentSection
            comments={post.comments}
            user={user}
            canApprove={canApprove}
            postId={post._id}
            onAddComment={onAddComment}
            onEditComment={onEditComment}
            onDeleteComment={onDeleteComment}
          />
        </div>
      </div>
    </div>
  );
}
