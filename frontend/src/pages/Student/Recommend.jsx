import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { BookOpen, TrendingUp, Plus } from "lucide-react";
import CreateDocumentModal from "./../../components/Modals/CreateDocumentModal";
import DocumentCard from "./../../components/Assignments/DocumentCard";
import SearchDocumentForm from "../../components/UI/SearchDocumentForm";
import { recommendService } from "./../../services/recommendService";
import DocumentSkeleton from "./../../components/SkeletonLoading/DocumentSkeleton";

function Recommend() {
  const [documents, setDocuments] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [topK, setTopK] = useState(5);

  const [isLoading, setIsLoading] = useState(true);
  const [isSearching, setIsSearching] = useState(false);

  const [showCreateModal, setShowCreateModal] = useState(false);

  const userRole = sessionStorage.getItem("role")?.replace(/"/g, "");

  useEffect(() => {
    fetchDocuments();
  }, []);

  const fetchDocuments = async () => {
    setIsLoading(true);
    try {
      const data = await recommendService.getDocuments();
      setDocuments(data);
    } catch (error) {
      console.error("Error fetching documents:", error);
      toast.error("Không thể tải danh sách tài liệu");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) {
      toast.warning("Vui lòng nhập từ khóa tìm kiếm");
      return;
    }

    setIsSearching(true);
    try {
      const results = await recommendService.recommendDocuments(
        searchQuery,
        topK
      );
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
      setIsSearching(false);
    }
  };

  const handleCreateDocument = async (docData) => {
    const loadingToast = toast.loading("Đang tạo tài liệu và embedding...");

    try {
      const tagsArray = docData.tags
        .split(",")
        .map((tag) => tag.trim())
        .filter((tag) => tag);

      await recommendService.createDocument({
        ...docData,
        tags: tagsArray,
      });

      toast.update(loadingToast, {
        render: "Tạo tài liệu thành công!",
        type: "success",
        isLoading: false,
        autoClose: 3000,
      });

      setShowCreateModal(false);
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 mb-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <BookOpen className="w-10 h-10 text-blue-600 dark:text-blue-400" />
              <div>
                <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
                  Hệ thống gợi ý tài liệu
                </h1>
                <p className="text-gray-600 dark:text-gray-300 mt-1">
                  Tìm kiếm tài liệu học tập phù hợp với bạn
                </p>
              </div>
            </div>
            {userRole === "admin" && (
              <button
                onClick={() => setShowCreateModal(true)}
                className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors font-medium"
              >
                <Plus className="w-5 h-5" />
                Thêm tài liệu
              </button>
            )}
          </div>

          <SearchDocumentForm
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            topK={topK}
            setTopK={setTopK}
            handleSearch={handleSearch}
            loading={isSearching}
          />
        </div>

        {recommendations.length > 0 && (
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp className="w-6 h-6 text-green-600 dark:text-green-400" />
              <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
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

        <div>
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
            <BookOpen className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            Tất cả tài liệu {isLoading ? "..." : `(${documents.length})`}
          </h2>

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, index) => (
                <DocumentSkeleton key={index} />
              ))}
            </div>
          ) : documents.length > 0 ? (
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
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-12 text-center">
              <BookOpen className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-600 dark:text-gray-300 mb-2">
                Chưa có tài liệu nào
              </h3>
              <p className="text-gray-500 dark:text-gray-400 mb-6">
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

      <CreateDocumentModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onCreate={handleCreateDocument}
      />
    </div>
  );
}

export default Recommend;
