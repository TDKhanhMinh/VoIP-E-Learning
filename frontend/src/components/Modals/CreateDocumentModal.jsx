import React, { useState } from "react";

const CreateDocumentModal = ({ isOpen, onClose, onCreate }) => {
  const [newDoc, setNewDoc] = useState({
    title: "",
    description: "",
    tags: "",
    level: "",
    link: "",
  });

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onCreate(newDoc);
    // Reset form sau khi submit thành công (nếu cần thiết có thể xử lý ở parent)
    setNewDoc({ title: "", description: "", tags: "", level: "", link: "" });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b">
          <h3 className="text-2xl font-bold text-gray-800">
            Thêm tài liệu mới
          </h3>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-gray-700 font-medium mb-2">
              Tiêu đề *
            </label>
            <input
              type="text"
              required
              value={newDoc.title}
              onChange={(e) => setNewDoc({ ...newDoc, title: e.target.value })}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none"
              placeholder="Nhập tiêu đề tài liệu"
            />
          </div>
          <div>
            <label className="block text-gray-700 font-medium mb-2">
              Mô tả
            </label>
            <textarea
              value={newDoc.description}
              onChange={(e) =>
                setNewDoc({ ...newDoc, description: e.target.value })
              }
              rows="4"
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none"
              placeholder="Nhập mô tả chi tiết về tài liệu"
            />
          </div>
          <div>
            <label className="block text-gray-700 font-medium mb-2">
              Tags (phân cách bằng dấu phẩy)
            </label>
            <input
              type="text"
              value={newDoc.tags}
              onChange={(e) => setNewDoc({ ...newDoc, tags: e.target.value })}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none"
              placeholder="VD: python, beginner, programming"
            />
          </div>
          <div>
            <label className="block text-gray-700 font-medium mb-2">
              Cấp độ
            </label>
            <select
              value={newDoc.level}
              onChange={(e) => setNewDoc({ ...newDoc, level: e.target.value })}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none"
            >
              <option value="">Chọn cấp độ</option>
              <option value="Beginner">Beginner</option>
              <option value="Intermediate">Intermediate</option>
              <option value="Advanced">Advanced</option>
            </select>
          </div>
          <div>
            <label className="block text-gray-700 font-medium mb-2">
              Link tài liệu
            </label>
            <input
              type="url"
              value={newDoc.link}
              onChange={(e) => setNewDoc({ ...newDoc, link: e.target.value })}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none"
              placeholder="https://..."
            />
          </div>
          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-medium transition-colors"
            >
              Tạo tài liệu
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 py-3 rounded-lg font-medium transition-colors"
            >
              Hủy
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateDocumentModal;
