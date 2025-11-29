import { useEffect, useState } from "react";
import { recommendService } from "../../services/recommendService";
import { toast } from "react-toastify";
import {
  Search,
  BookOpen,
  Tag,
  TrendingUp,
  ExternalLink,
  Plus,
  Loader2,
  Trash2,
  Edit,
} from "lucide-react";

function Recommend() {
  const [documents, setDocuments] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [topK, setTopK] = useState(5);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newDoc, setNewDoc] = useState({
    title: "",
    description: "",
    tags: "",
    level: "",
    link: "",
  });
  const userRole = sessionStorage.getItem("role")?.replace(/"/g, "");

  useEffect(() => {
    console.log("User role:", userRole);
    console.log("Token:", localStorage.getItem("token") ? "exists" : "missing");
    fetchDocuments();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchDocuments = async () => {
    try {
      const data = await recommendService.getDocuments();
      setDocuments(data);
      console.log(`Loaded ${data.length} documents`);
      if (data.length > 0) {
        console.log("Sample document:", data[0]);
        console.log(
          "Tags type:",
          typeof data[0].tags,
          Array.isArray(data[0].tags)
        );
        console.log("Embedding length:", data[0].embedding?.length);
      }
    } catch (error) {
      console.error("Error fetching documents:", error);
      toast.error("Không thể tải danh sách tài liệu");
    } finally {
      setInitialLoading(false);
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) {
      toast.warning("Vui lòng nhập từ khóa tìm kiếm");
      return;
    }

    setLoading(true);
    try {
      console.log(`Searching for: "${searchQuery}" (top ${topK})`);
      const results = await recommendService.recommendDocuments(
        searchQuery,
        topK
      );

      // Lọc bỏ các kết quả có score <= 0
      const validResults = results.filter((result) => result.score > 0);

      setRecommendations(validResults);

      if (validResults.length === 0) {
        toast.info("Không tìm thấy tài liệu phù hợp. Thử từ khóa khác!");
      } else {
        toast.success(`Tìm thấy ${validResults.length} tài liệu phù hợp!`);
      }
    } catch (error) {
      console.error("Error getting recommendations:", error);
      const errorMsg =
        error?.response?.data?.error || error.message || "Lỗi không xác định";
      toast.error(`Lỗi khi tìm kiếm: ${errorMsg}`);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateDocument = async (e) => {
    e.preventDefault();

    const loadingToast = toast.loading("Đang tạo tài liệu và embedding...");

    try {
      const tagsArray = newDoc.tags
        .split(",")
        .map((tag) => tag.trim())
        .filter((tag) => tag);

      console.log("📝 Creating document:", { ...newDoc, tags: tagsArray });

      await recommendService.createDocument({
        ...newDoc,
        tags: tagsArray,
      });

      toast.update(loadingToast, {
        render: "Tạo tài liệu thành công!",
        type: "success",
        isLoading: false,
        autoClose: 3000,
      });

      setShowCreateModal(false);
      setNewDoc({ title: "", description: "", tags: "", level: "", link: "" });
      fetchDocuments();
    } catch (error) {
      console.error("Error creating document:", error);
      const errorMsg =
        error?.response?.data?.error ||
        error?.response?.data?.message ||
        "Không thể tạo tài liệu. Vui lòng kiểm tra quyền admin.";

      toast.update(loadingToast, {
        render: errorMsg,
        type: "error",
        isLoading: false,
        autoClose: 5000,
      });
    }
  };

  const handleDeleteDocument = async (docId, docTitle) => {
    if (!window.confirm(`Bạn có chắc muốn xóa tài liệu "${docTitle}"?`)) {
      return;
    }

    const loadingToast = toast.loading("Đang xóa tài liệu...");

    try {
      await recommendService.deleteDocument(docId);
      toast.update(loadingToast, {
        render: "Xóa tài liệu thành công!",
        type: "success",
        isLoading: false,
        autoClose: 3000,
      });
      fetchDocuments();
      // Remove from recommendations if present
      setRecommendations(recommendations.filter((doc) => doc._id !== docId));
    } catch (error) {
      console.error("Error deleting document:", error);
      toast.update(loadingToast, {
        render: "Không thể xóa tài liệu",
        type: "error",
        isLoading: false,
        autoClose: 3000,
      });
    }
  };

  if (initialLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600 text-lg">Đang tải tài liệu...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <BookOpen className="w-10 h-10 text-blue-600" />
              <div>
                <h1 className="text-3xl font-bold text-gray-800">
                  Hệ thống gợi ý tài liệu
                </h1>
                <p className="text-gray-600 mt-1">
                  Tìm kiếm tài liệu học tập phù hợp với bạn
                </p>
              </div>
            </div>
            {userRole === "admin" && (
              <button
                onClick={() => setShowCreateModal(true)}
                className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg transition-colors font-medium"
              >
                <Plus className="w-5 h-5" />
                Thêm tài liệu
              </button>
            )}
          </div>

          {/* Search Form */}
          <form onSubmit={handleSearch} className="space-y-4">
            <div className="flex gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Nhập từ khóa tìm kiếm (VD: lập trình Python, cấu trúc dữ liệu...)"
                  className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none text-lg"
                />
              </div>
              <div className="flex items-center gap-3">
                <label className="text-gray-700 font-medium">Số lượng:</label>
                <input
                  type="number"
                  value={topK}
                  onChange={(e) => setTopK(parseInt(e.target.value) || 5)}
                  min="1"
                  max="20"
                  className="w-20 px-3 py-4 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none"
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-8 py-4 rounded-xl transition-colors font-medium flex items-center gap-2"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    Đang tìm...
                  </>
                ) : (
                  <>
                    <Search className="w-5 h-5" />
                    Tìm kiếm
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Recommendations Results */}
        {recommendations.length > 0 && (
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp className="w-6 h-6 text-green-600" />
              <h2 className="text-2xl font-bold text-gray-800">
                Kết quả gợi ý ({recommendations.length})
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {recommendations.map((item, index) => (
                <DocumentCard
                  key={item._id}
                  document={item}
                  rank={index + 1}
                  showScore
                  isAdmin={userRole === "admin"}
                  onDelete={handleDeleteDocument}
                />
              ))}
            </div>
          </div>
        )}

        {/* All Documents */}
        <div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
            <BookOpen className="w-6 h-6 text-blue-600" />
            Tất cả tài liệu ({documents.length})
          </h2>
          {documents.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {documents.map((doc) => (
                <DocumentCard
                  key={doc._id}
                  document={doc}
                  isAdmin={userRole === "admin"}
                  onDelete={handleDeleteDocument}
                />
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-xl shadow-lg p-12 text-center">
              <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-600 mb-2">
                Chưa có tài liệu nào
              </h3>
              <p className="text-gray-500 mb-6">
                {userRole === "admin"
                  ? "Hãy thêm tài liệu đầu tiên để bắt đầu!"
                  : "Vui lòng liên hệ admin để thêm tài liệu."}
              </p>
              {userRole === "admin" && (
                <button
                  onClick={() => setShowCreateModal(true)}
                  className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-colors font-medium"
                >
                  <Plus className="w-5 h-5" />
                  Thêm tài liệu đầu tiên
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Create Document Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b">
              <h3 className="text-2xl font-bold text-gray-800">
                Thêm tài liệu mới
              </h3>
            </div>
            <form onSubmit={handleCreateDocument} className="p-6 space-y-4">
              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  Tiêu đề *
                </label>
                <input
                  type="text"
                  required
                  value={newDoc.title}
                  onChange={(e) =>
                    setNewDoc({ ...newDoc, title: e.target.value })
                  }
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
                  onChange={(e) =>
                    setNewDoc({ ...newDoc, tags: e.target.value })
                  }
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
                  onChange={(e) =>
                    setNewDoc({ ...newDoc, level: e.target.value })
                  }
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
                  onChange={(e) =>
                    setNewDoc({ ...newDoc, link: e.target.value })
                  }
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
                  onClick={() => setShowCreateModal(false)}
                  className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 py-3 rounded-lg font-medium transition-colors"
                >
                  Hủy
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

// Document Card Component
function DocumentCard({ document, rank, showScore, isAdmin, onDelete }) {
  const levelColors = {
    Beginner: "bg-green-100 text-green-800",
    Intermediate: "bg-yellow-100 text-yellow-800",
    Advanced: "bg-red-100 text-red-800",
  };

  return (
    <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border-2 border-gray-100 hover:border-blue-300 relative">
      <div className="p-6">
        {/* Header with rank, score, and admin actions */}
        <div className="flex items-start justify-between mb-3 gap-2">
          <div className="flex items-center gap-2 flex-wrap flex-1 min-w-0">
            {rank && (
              <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-bold shrink-0">
                #{rank}
              </span>
            )}
            {showScore && (
              <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-semibold shrink-0">
                Score: {(document.score * 100).toFixed(1)}%
              </span>
            )}
          </div>
          {isAdmin && (
            <button
              onClick={() => onDelete(document._id, document.title)}
              className="p-2 bg-red-100 hover:bg-red-200 text-red-600 rounded-lg transition-colors shrink-0"
              title="Xóa tài liệu"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>

        <h3
          className="text-xl font-bold text-gray-800 mb-3 line-clamp-2 pr-0"
          title={document.title}
        >
          {document.title || "Không có tiêu đề"}
        </h3>
        <p
          className="text-gray-600 text-sm mb-4 line-clamp-3"
          title={document.description}
        >
          {document.description || "Không có mô tả"}
        </p>

        {/* Tags */}
        {document.tags &&
        Array.isArray(document.tags) &&
        document.tags.length > 0 ? (
          <div className="flex flex-wrap gap-2 mb-4">
            {document.tags.map((tag, idx) => (
              <span
                key={idx}
                className="flex items-center gap-1 bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-xs font-medium"
                title={`Tag: ${tag}`}
              >
                <Tag className="w-3 h-3" />
                {tag}
              </span>
            ))}
          </div>
        ) : (
          <div className="text-xs text-gray-400 mb-4">Không có tags</div>
        )}

        {/* Level */}
        {document.level && (
          <div className="mb-4">
            <span
              className={`inline-block px-3 py-1 rounded-lg text-xs font-semibold ${
                levelColors[document.level] || "bg-gray-100 text-gray-800"
              }`}
            >
              {document.level}
            </span>
          </div>
        )}

        {/* Link */}
        {document.link && (
          <a
            href={document.link}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-blue-600 hover:text-blue-800 font-medium transition-colors mb-3"
          >
            <ExternalLink className="w-4 h-4" />
            Xem tài liệu
          </a>
        )}

        {/* Metadata */}
        <div className="mt-3 pt-3 border-t border-gray-100 text-xs text-gray-500">
          {document.createdAt && (
            <div>
              {new Date(document.createdAt).toLocaleDateString("vi-VN", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </div>
          )}
          {document.embedding && document.embedding.length > 0 && (
            <div className="mt-1">
              Embedding: {document.embedding.length} dimensions
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Recommend;
