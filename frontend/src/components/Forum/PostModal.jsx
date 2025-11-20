export default function PostModal({
  show,
  onClose,
  onSubmit,
  postForm,
  setPostForm,
  editingPost,
  topics,
}) {
  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <h2 className="text-2xl font-bold mb-4">
          {editingPost ? "Sửa Bài Viết" : "Tạo Bài Viết Mới"}
        </h2>
        <form onSubmit={onSubmit}>
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
              onClick={onClose}
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
  );
}
