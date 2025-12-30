import { useState } from "react";
import { postService } from "../../services/postService";

export default function CreatePostModal({ open, onClose, classId, user }) {
  const [content, setContent] = useState("");
  const submitPost = async () => {
    if (!content.trim()) return;
    const payload = {
      author_id: user.author_id,
      author_name: user.author_name,
      content: content.trim(),
    };
    await postService.createPost(classId, payload);
    setContent("");
    onClose();
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/40 dark:bg-black/60 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg w-full max-w-lg p-5 relative">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white text-xl"
        >
          ✕
        </button>

        <h2 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
          Tạo thảo luận mới
        </h2>

        <textarea
          rows="4"
          className="w-full border border-gray-300 dark:border-gray-600 rounded-md p-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-500 dark:focus:ring-blue-400 placeholder:text-gray-400 dark:placeholder:text-gray-500"
          placeholder="Viết thảo luận của bạn..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />

        <div className="text-right mt-4">
          <button
            onClick={onClose}
            className="px-4 py-1 rounded-md border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 mr-2 hover:bg-gray-100 dark:hover:bg-gray-600 transition"
          >
            Hủy
          </button>
          <button
            onClick={submitPost}
            className="px-4 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
          >
            Đăng
          </button>
        </div>
      </div>
    </div>
  );
}
