export default function PostCard({
  post,
  user,
  canApprove,
  onPostClick,
  onEditPost,
  onDeletePost,
  onApprovePost,
  onRejectPost,
}) {
  const getStatusBadge = (status) => {
    const styles = {
      pending: "bg-yellow-100 text-yellow-800",
      approved: "bg-green-100 text-green-800",
      rejected: "bg-red-100 text-red-800",
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
    <div
      className="bg-white rounded-lg shadow-md p-5 hover:shadow-lg transition cursor-pointer"
      onClick={() => onPostClick(post)}
    >
      <div className="flex justify-between items-start mb-3">
        <div className="flex-1">
          <h3 className="text-xl font-semibold text-gray-800 mb-1">
            {post.title}
          </h3>
          <div className="flex items-center gap-3 text-sm text-gray-600">
            <span className="font-medium">{post.author?.full_name}</span>
            <span>•</span>
            <span>{new Date(post.createdAt).toLocaleDateString("vi-VN")}</span>
            {post.topic && (
              <>
                <span>•</span>
                <span className="text-blue-600">{post.topic.title}</span>
              </>
            )}
          </div>
        </div>
        <div className="flex gap-2 items-center">
          {getStatusBadge(post.status)}
          {(post.author?._id === user?._id || canApprove) && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onEditPost(post);
              }}
              className="text-blue-600 hover:text-blue-800 px-2"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="size-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"
                />
              </svg>
            </button>
          )}
          {(post.author?._id === user?._id || canApprove) && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDeletePost(post._id);
              }}
              className="text-red-600 hover:text-red-800 px-2"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="size-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
                />
              </svg>
            </button>
          )}
        </div>
      </div>
      <p className="text-gray-700 line-clamp-2">{post.content}</p>
      <div className="mt-3 flex items-center gap-4 text-sm text-gray-500">
        <span>
          💬 {post.commentCount || post.comments?.length || 0} bình luận
        </span>
        {canApprove && post.status === "pending" && (
          <div className="flex gap-2 ml-auto">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onApprovePost(post._id);
              }}
              className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
            >
              Duyệt
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onRejectPost(post._id);
              }}
              className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
            >
              Từ chối
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
