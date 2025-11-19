import { useEffect, useState } from "react";
import { forumService } from "../services/forumService";
import { toast } from "react-toastify";

export default function Forum() {
  const user = {
    _id: sessionStorage.getItem("userId")?.replace(/['"]/g, ""),
    full_name: sessionStorage.getItem("name")?.replace(/['"]/g, ""),
    role: sessionStorage.getItem("role")?.replace(/['"]/g, ""),
    email: sessionStorage.getItem("email")?.replace(/['"]/g, ""),
  };
  console.log("user", user);
  const [topics, setTopics] = useState([]);
  const [posts, setPosts] = useState([]);
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [selectedPost, setSelectedPost] = useState(null);
  const [showTopicModal, setShowTopicModal] = useState(false);
  const [showPostModal, setShowPostModal] = useState(false);
  const [showPostDetail, setShowPostDetail] = useState(false);
  const [newComment, setNewComment] = useState("");
  const [filter, setFilter] = useState("all");

  const [topicForm, setTopicForm] = useState({ title: "", description: "" });
  const [postForm, setPostForm] = useState({
    topic: "",
    content: "",
    title: "",
  });
  const [editingTopic, setEditingTopic] = useState(null);
  const [editingPost, setEditingPost] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const topicsRes = await forumService.getAllTopics();
        setTopics(topicsRes);
        const postsRes = await forumService.getAllPosts();
        setPosts(postsRes);
        console.log(postsRes);
      } catch (error) {
        console.error("Failed to fetch topics or posts:", error);
      }
    };

    fetchData();
  }, []);

  const canCreateTopic = user?.role === "admin" || user?.role === "teacher";
  const canApprove = user?.role === "admin";

  const handleCreateTopic = async (e) => {
    e.preventDefault();

    if (editingTopic) {
      try {
        const data = { ...topicForm };
        await forumService.updateTopic(editingTopic._id, data);
      } catch (error) {
        console.log(error);
      }
      setTopics(
        topics.map((t) =>
          t._id === editingTopic._id ? { ...t, ...topicForm } : t
        )
      );
      toast.success("Chủ đề đã được cập nhật!");
    } else {
      const newTopic = { ...topicForm };
      const res = await forumService.createTopic(newTopic);
      setTopics([...topics, res]);
      toast.success("Chủ đề mới đã được tạo!");
    }
    setShowTopicModal(false);
    setTopicForm({ title: "", description: "" });
    setEditingTopic(null);
  };

  const handleCreatePost = async (e) => {
    e.preventDefault();
    if (editingPost) {
      try {
        const data = { ...postForm };
        await forumService.updatePost(editingPost._id, data);
        setPosts(
          posts.map((p) =>
            p._id === editingPost._id
              ? { ...p, title: postForm.title, content: postForm.content }
              : p
          )
        );
        toast.success("Bài viết đã được cập nhật!");
      } catch (error) {
        console.log(error);
        toast.error("Lỗi khi cập nhật bài viết.");
      }
    } else {
      try {
        const selectedTopicData = topics.find((t) => t._id === postForm.topic);
        const newPost = {
          title: postForm.title,
          content: postForm.content,
          topic: { _id: selectedTopicData._id, title: selectedTopicData.title },
          status: "pending",
        };
        const res = await forumService.createPost(newPost, postForm.topic);
        setPosts([res, ...posts]);
        toast.success("Bài viết mới đã được tạo!");
      } catch (error) {
        console.log(error);
        toast.error("Lỗi khi tạo bài viết.");
      }
    }
    setShowPostModal(false);
    setPostForm({ topic: "", title: "", content: "" });
    setEditingPost(null);
  };

  const handleDeletePost = (postId) => {
    if (!window.confirm("Bạn có chắc muốn xóa bài viết này?")) return;
    setPosts(posts.filter((p) => p._id !== postId));
    if (selectedPost?._id === postId) {
      setShowPostDetail(false);
      setSelectedPost(null);
    }
    alert("Đã xóa bài viết!");
  };

  const handleApprovePost = async (postId) => {
    try {
      await forumService.updatePost(postId, { status: "approved" });
      setPosts(
        posts.map((p) => (p._id === postId ? { ...p, status: "approved" } : p))
      );
      if (selectedPost?._id === postId) {
        setSelectedPost({ ...selectedPost, status: "approved" });
      }
      toast.success("Đã duyệt bài viết!");
    } catch (error) {
      console.error("Lỗi khi duyệt bài viết:", error);
      toast.error("Lỗi khi duyệt bài viết.");
    }
  };

  const handleRejectPost = async (postId) => {
    try {
      await forumService.updatePost(postId, { status: "rejected" });
      setPosts(
        posts.map((p) => (p._id === postId ? { ...p, status: "rejected" } : p))
      );
      if (selectedPost?._id === postId) {
        setSelectedPost({ ...selectedPost, status: "rejected" });
      }
      toast.success("Đã từ chối bài viết!");
    } catch (error) {
      console.error("Lỗi khi từ chối bài viết:", error);
      toast.error("Lỗi khi từ chối bài viết.");
    }
  };

  const handleAddComment = (postId) => {
    if (!newComment.trim()) return;
    const newCommentObj = {
      _id: Date.now().toString(),
      author: { _id: user._id, full_name: user.full_name, role: user.role },
      content: newComment,
      createdAt: new Date().toISOString(),
    };
    setPosts(
      posts.map((p) =>
        p._id === postId
          ? { ...p, comments: [...p.comments, newCommentObj] }
          : p
      )
    );
    if (selectedPost?._id === postId) {
      setSelectedPost({
        ...selectedPost,
        comments: [...selectedPost.comments, newCommentObj],
      });
    }
    setNewComment("");
    alert("Đã thêm bình luận!");
  };

  const handleDeleteComment = (postId, commentId) => {
    if (!window.confirm("Xóa bình luận này?")) return;
    setPosts(
      posts.map((p) =>
        p._id === postId
          ? { ...p, comments: p.comments.filter((c) => c._id !== commentId) }
          : p
      )
    );
    if (selectedPost?._id === postId) {
      setSelectedPost({
        ...selectedPost,
        comments: selectedPost.comments.filter((c) => c._id !== commentId),
      });
    }
    alert("Đã xóa bình luận!");
  };

  const openEditTopic = (topic) => {
    setEditingTopic(topic);
    setTopicForm({ title: topic.title, description: topic.description });
    setShowTopicModal(true);
  };

  const openEditPost = (post) => {
    setEditingPost(post);
    setPostForm({
      topic: post.topic._id,
      title: post.title,
      content: post.content,
    });
    setShowPostModal(true);
  };

  const openPostDetail = (post) => {
    setSelectedPost(post);
    setShowPostDetail(true);
  };

  const filteredPosts = posts.filter((post) => {
    const postTopicId = post.topic?._id || post.topic_id;
    if (selectedTopic && postTopicId !== selectedTopic) return false;
    const postStatus = post.status || "pending";
    if (filter !== "all" && canApprove && postStatus !== filter) return false;
    if (!canApprove && postStatus !== "approved") return false;
    return true;
  });

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
    <div className="bg-gradient-to-br from-gray-50 via-blue-50 p-6">
      <div className="max-w-7xl mx-auto ">
        <div className="flex justify-end mb-3">
          <div className="flex gap-3">
            {canCreateTopic && (
              <button
                onClick={() => {
                  setEditingTopic(null);
                  setTopicForm({ title: "", description: "" });
                  setShowTopicModal(true);
                }}
                className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition"
              >
                + Tạo Chủ Đề
              </button>
            )}
            <button
              onClick={() => {
                setEditingPost(null);
                setPostForm({ topic: "", title: "", content: "" });
                setShowPostModal(true);
              }}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
            >
              + Tạo Bài Viết
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-4 border border-gray-200">
              <h2 className="text-xl font-semibold mb-4 text-gray-800">
                Chủ Đề
              </h2>
              <div className="space-y-2">
                <button
                  onClick={() => setSelectedTopic(null)}
                  className={`w-full text-left px-3 py-2 rounded transition ${
                    !selectedTopic
                      ? "bg-blue-100 text-blue-700 font-medium"
                      : "hover:bg-gray-100"
                  }`}
                >
                  Tất cả
                </button>
                {topics.map((topic) => (
                  <div key={topic._id} className="flex items-center gap-2">
                    <button
                      onClick={() => setSelectedTopic(topic._id)}
                      className={`flex-1 text-left px-3 py-2 rounded transition ${
                        selectedTopic === topic._id
                          ? "bg-blue-100 text-blue-700 font-medium"
                          : "hover:bg-gray-100"
                      }`}
                    >
                      {topic.title}
                    </button>
                    {canCreateTopic && (
                      <button
                        onClick={() => openEditTopic(topic)}
                        className="p-1 hover:bg-gray-200 rounded"
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
                  </div>
                ))}
              </div>
            </div>

            {canApprove && (
              <div className="bg-white rounded-lg shadow-md p-4 mt-4">
                <h3 className="font-semibold mb-3 text-gray-800">
                  Lọc theo trạng thái
                </h3>
                <select
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                  className="w-full p-2 border rounded"
                >
                  <option value="all">Tất cả</option>
                  <option value="pending">Chờ duyệt</option>
                  <option value="approved">Đã duyệt</option>
                  <option value="rejected">Từ chối</option>
                </select>
              </div>
            )}
          </div>

          <div className="lg:col-span-3">
            {filteredPosts.length === 0 ? (
              <div className="bg-white rounded-lg shadow-md p-8 justify-center h-full flex items-center text-gray-500">
                Chưa có bài viết nào
              </div>
            ) : (
              <div className="space-y-4">
                {filteredPosts.map((post) => (
                  <div
                    key={post._id}
                    className="bg-white rounded-lg shadow-md p-5 hover:shadow-lg transition cursor-pointer"
                    onClick={() => openPostDetail(post)}
                  >
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex-1">
                        <h3 className="text-xl font-semibold text-gray-800 mb-1">
                          {post.title}
                        </h3>
                        <div className="flex items-center gap-3 text-sm text-gray-600">
                          <span className="font-medium">
                            {post.author?.full_name}
                          </span>
                          <span>•</span>
                          <span>
                            {new Date(post.createdAt).toLocaleDateString(
                              "vi-VN"
                            )}
                          </span>
                          {post.topic && (
                            <>
                              <span>•</span>
                              <span className="text-blue-600">
                                {post.topic.title}
                              </span>
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
                              openEditPost(post);
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
                              handleDeletePost(post._id);
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
                      <span>💬 {post.comments?.length || 0} bình luận</span>
                      {canApprove && post.status === "pending" && (
                        <div className="flex gap-2 ml-auto">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleApprovePost(post._id);
                            }}
                            className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
                          >
                            Duyệt
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleRejectPost(post._id);
                            }}
                            className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
                          >
                            Từ chối
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {showTopicModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h2 className="text-2xl font-bold mb-4">
              {editingTopic ? "Sửa Chủ Đề" : "Tạo Chủ Đề Mới"}
            </h2>
            <form onSubmit={handleCreateTopic}>
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Tiêu đề</label>
                <input
                  type="text"
                  value={topicForm.title}
                  onChange={(e) =>
                    setTopicForm({ ...topicForm, title: e.target.value })
                  }
                  className="w-full p-2 border rounded"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Mô tả</label>
                <textarea
                  required
                  value={topicForm.description}
                  onChange={(e) =>
                    setTopicForm({ ...topicForm, description: e.target.value })
                  }
                  className="w-full p-2 border rounded h-24"
                />
              </div>
              <div className="flex gap-3 justify-end">
                <button
                  type="button"
                  onClick={() => {
                    setShowTopicModal(false);
                    setEditingTopic(null);
                  }}
                  className="px-4 py-2 border rounded hover:bg-gray-100"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  {editingTopic ? "Cập nhật" : "Tạo"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showPostModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold mb-4">
              {editingPost ? "Sửa Bài Viết" : "Tạo Bài Viết Mới"}
            </h2>
            <form onSubmit={handleCreatePost}>
              {!editingPost && (
                <div className="mb-4">
                  <label className="block text-gray-700 mb-2">Chủ đề</label>
                  <select
                    value={postForm.topic}
                    onChange={(e) =>
                      setPostForm({ ...postForm, topic: e.target.value })
                    }
                    className="w-full p-2 border rounded"
                    required
                  >
                    <option value="">Chọn chủ đề</option>
                    {topics.map((topic) => (
                      <option key={topic._id} value={topic._id}>
                        {topic.title}
                      </option>
                    ))}
                  </select>
                </div>
              )}
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Tiêu đề</label>
                <input
                  type="text"
                  value={postForm.title}
                  onChange={(e) =>
                    setPostForm({ ...postForm, title: e.target.value })
                  }
                  className="w-full p-2 border rounded"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Nội dung</label>
                <textarea
                  value={postForm.content}
                  onChange={(e) =>
                    setPostForm({ ...postForm, content: e.target.value })
                  }
                  className="w-full p-2 border rounded h-40"
                  required
                />
              </div>
              <div className="flex gap-3 justify-end">
                <button
                  type="button"
                  onClick={() => {
                    setShowPostModal(false);
                    setEditingPost(null);
                  }}
                  className="px-4 py-2 border rounded hover:bg-gray-100"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  {editingPost ? "Cập nhật" : "Tạo"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showPostDetail && selectedPost && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <h2 className="text-2xl font-bold text-gray-800 mb-2">
                    {selectedPost.title}
                  </h2>
                  <div className="flex items-center gap-3 text-sm text-gray-600">
                    <span className="font-medium">
                      {selectedPost.author?.full_name}
                    </span>
                    <span>•</span>
                    <span>
                      {new Date(selectedPost.createdAt).toLocaleDateString(
                        "vi-VN"
                      )}
                    </span>
                    {selectedPost.topic && (
                      <>
                        <span>•</span>
                        <span className="text-blue-600">
                          {selectedPost.topic.title}
                        </span>
                      </>
                    )}
                    <span>•</span>
                    {getStatusBadge(selectedPost.status)}
                  </div>
                </div>
                <button
                  onClick={() => setShowPostDetail(false)}
                  className="text-gray-500 hover:text-gray-700 text-2xl"
                >
                  ×
                </button>
              </div>

              <div className="prose max-w-none mb-6">
                <p className="text-gray-700 whitespace-pre-wrap">
                  {selectedPost.content}
                </p>
              </div>

              {canApprove && selectedPost.status === "pending" && (
                <div className="flex gap-3 mb-6 pb-6 border-b">
                  <button
                    onClick={() => handleApprovePost(selectedPost._id)}
                    className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                  >
                    Duyệt bài
                  </button>
                  <button
                    onClick={() => handleRejectPost(selectedPost._id)}
                    className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
                  >
                    Từ chối
                  </button>
                </div>
              )}

              {/* Comments Section */}
              <div className="border-t pt-6">
                <h3 className="text-xl font-semibold mb-4">
                  Bình luận ({selectedPost.comments?.length || 0})
                </h3>

                {/* Comment Input */}
                <div className="mb-6">
                  <textarea
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Viết bình luận..."
                    className="w-full p-3 border rounded-lg"
                    rows="3"
                  />
                  <button
                    onClick={() => handleAddComment(selectedPost._id)}
                    disabled={!newComment.trim()}
                    className="mt-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:bg-gray-400"
                  >
                    Gửi bình luận
                  </button>
                </div>

                {/* Comments List */}
                <div className="space-y-4">
                  {selectedPost.comments?.map((comment) => (
                    <div
                      key={comment._id}
                      className="bg-gray-50 p-4 rounded-lg"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-gray-800">
                            {comment.author?.full_name}
                          </span>
                          <span className="text-sm text-gray-500">
                            {new Date(comment.createdAt).toLocaleDateString(
                              "vi-VN"
                            )}
                          </span>
                        </div>
                        {(comment.author?._id === user?._id || canApprove) && (
                          <button
                            onClick={() =>
                              handleDeleteComment(selectedPost._id, comment._id)
                            }
                            className="text-red-600 hover:text-red-800 text-sm"
                          >
                            Xóa
                          </button>
                        )}
                      </div>
                      <p className="text-gray-700">{comment.content}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
