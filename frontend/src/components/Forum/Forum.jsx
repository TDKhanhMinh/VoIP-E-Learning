import { useEffect, useState } from "react";
import { forumService } from "../../services/forumService";
import { commentService } from "../../services/commentService";
import { toast } from "react-toastify";
import TopicSidebar from "./TopicSidebar";
import PostList from "./PostList";
import TopicModal from "./TopicModal";
import PostModal from "./PostModal";
import PostDetailModal from "./PostDetailModal";
import TopicSidebarSkeleton from "./../SkeletonLoading/TopicSidebarSkeleton";
import PostListSkeleton from "./../SkeletonLoading/PostListSkeleton";

export default function Forum() {
  const user = {
    _id: sessionStorage.getItem("userId")?.replace(/['"]/g, ""),
    full_name: sessionStorage.getItem("name")?.replace(/['"]/g, ""),
    role: sessionStorage.getItem("role")?.replace(/['"]/g, ""),
    email: sessionStorage.getItem("email")?.replace(/['"]/g, ""),
  };
  const [topics, setTopics] = useState([]);
  const [posts, setPosts] = useState([]);
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [selectedPost, setSelectedPost] = useState(null);
  const [showTopicModal, setShowTopicModal] = useState(false);
  const [showPostModal, setShowPostModal] = useState(false);
  const [showPostDetail, setShowPostDetail] = useState(false);
  const [filter, setFilter] = useState("all");

  const [topicForm, setTopicForm] = useState({ title: "", description: "" });
  const [postForm, setPostForm] = useState({
    topic: "",
    content: "",
    title: "",
  });
  const [editingTopic, setEditingTopic] = useState(null);
  const [editingPost, setEditingPost] = useState(null);

  // 1. Thêm biến isLoading
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true); // Bắt đầu load
      try {
        // Tối ưu: Gọi song song 2 API
        const [topicsRes, postsRes] = await Promise.all([
          forumService.getAllTopics(),
          forumService.getAllPosts(),
        ]);

        setTopics(topicsRes);
        setPosts(postsRes);
        console.log(postsRes);
      } catch (error) {
        console.error("Failed to fetch topics or posts:", error);
      } finally {
        setIsLoading(false); // Kết thúc load
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
    toast.success("Đã xóa bài viết!");
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

  const handleAddComment = async (postId, commentText) => {
    if (!commentText.trim()) return;

    try {
      await forumService.addComment(
        postId,
        user._id,
        user.full_name,
        commentText
      );

      if (selectedPost?._id === postId) {
        const updatedPost = await forumService.getPostById(postId);
        setSelectedPost(updatedPost);

        setPosts(
          posts.map((p) =>
            p._id === postId
              ? { ...p, commentCount: updatedPost.comments?.length || 0 }
              : p
          )
        );
      }
    } catch (err) {
      console.error("Failed to add comment:", err);
      toast.error("Không thể thêm bình luận!");
    }
  };

  const handleDeleteComment = async (postId, commentId) => {
    if (!window.confirm("Xóa bình luận này?")) return;

    try {
      await commentService.deleteComment(commentId);

      const updatedPost = await forumService.getPostById(postId);
      setSelectedPost(updatedPost);

      setPosts(
        posts.map((p) =>
          p._id === postId
            ? { ...p, commentCount: updatedPost.comments?.length || 0 }
            : p
        )
      );

      toast.success("Đã xóa bình luận!");
    } catch (err) {
      console.error("Failed to delete comment:", err);
      toast.error("Không thể xóa bình luận!");
    }
  };

  const handleEditComment = async (postId, commentId, newContent) => {
    if (!newContent.trim()) return;

    try {
      await commentService.updateComment(commentId, {
        content: newContent,
      });

      const updatedPost = await forumService.getPostById(postId);
      setSelectedPost(updatedPost);

      setPosts(
        posts.map((p) =>
          p._id === postId
            ? { ...p, commentCount: updatedPost.comments?.length || 0 }
            : p
        )
      );

      toast.success("Đã cập nhật bình luận!");
    } catch (err) {
      console.error("Failed to update comment:", err);
      toast.error("Không thể cập nhật bình luận!");
    }
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

  const openPostDetail = async (post) => {
    try {
      const fullPost = await forumService.getPostById(post._id);
      setSelectedPost(fullPost);
      setShowPostDetail(true);
    } catch (err) {
      console.error("Failed to fetch post details:", err);
      setSelectedPost(post);
      setShowPostDetail(true);
    }
  };

  const filteredPosts = posts.filter((post) => {
    const postTopicId = post.topic?._id || post.topic_id;
    if (selectedTopic && postTopicId !== selectedTopic) return false;
    const postStatus = post.status || "pending";
    if (filter !== "all" && canApprove && postStatus !== filter) return false;
    if (!canApprove && postStatus !== "approved") return false;
    return true;
  });

  return (
    <div className="bg-gradient-to-br from-gray-50 via-blue-50 p-6 min-h-screen">
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
          {isLoading ? (
            <div className="lg:col-span-1">
              <TopicSidebarSkeleton />
            </div>
          ) : (
            <TopicSidebar
              topics={topics}
              selectedTopic={selectedTopic}
              onTopicSelect={setSelectedTopic}
              onEditTopic={openEditTopic}
              canCreateTopic={canCreateTopic}
              canApprove={canApprove}
              filter={filter}
              onFilterChange={setFilter}
            />
          )}

          <div className="lg:col-span-3">
            {isLoading ? (
              <PostListSkeleton />
            ) : (
              <PostList
                posts={filteredPosts}
                user={user}
                canApprove={canApprove}
                onPostClick={openPostDetail}
                onEditPost={openEditPost}
                onDeletePost={handleDeletePost}
                onApprovePost={handleApprovePost}
                onRejectPost={handleRejectPost}
              />
            )}
          </div>
        </div>
      </div>

      <TopicModal
        show={showTopicModal}
        onClose={() => {
          setShowTopicModal(false);
          setEditingTopic(null);
        }}
        onSubmit={handleCreateTopic}
        topicForm={topicForm}
        setTopicForm={setTopicForm}
        editingTopic={editingTopic}
      />

      <PostModal
        show={showPostModal}
        onClose={() => {
          setShowPostModal(false);
          setEditingPost(null);
        }}
        onSubmit={handleCreatePost}
        postForm={postForm}
        setPostForm={setPostForm}
        editingPost={editingPost}
        topics={topics}
      />

      <PostDetailModal
        show={showPostDetail}
        post={selectedPost}
        user={user}
        canApprove={canApprove}
        onClose={() => setShowPostDetail(false)}
        onApprovePost={handleApprovePost}
        onRejectPost={handleRejectPost}
        onAddComment={handleAddComment}
        onEditComment={handleEditComment}
        onDeleteComment={handleDeleteComment}
      />
    </div>
  );
}
