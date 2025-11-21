import PostCard from "./PostCard";

export default function PostList({
  posts,
  user,
  canApprove,
  onPostClick,
  onEditPost,
  onDeletePost,
  onApprovePost,
  onRejectPost,
}) {
  if (posts.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-8 justify-center h-full flex items-center text-gray-500">
        Chưa có bài viết nào
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {posts.map((post) => (
        <PostCard
          key={post._id}
          post={post}
          user={user}
          canApprove={canApprove}
          onPostClick={onPostClick}
          onEditPost={onEditPost}
          onDeletePost={onDeletePost}
          onApprovePost={onApprovePost}
          onRejectPost={onRejectPost}
        />
      ))}
    </div>
  );
}
