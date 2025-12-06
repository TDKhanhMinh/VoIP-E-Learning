import React from "react";
import { Search } from "lucide-react";

const SearchDocumentForm = ({
  searchQuery,
  setSearchQuery,
  topK,
  setTopK,
  handleSearch,
  loading,
}) => {
  return (
    <form onSubmit={handleSearch} className="space-y-4">
      <div className="flex gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Nhập từ khóa tìm kiếm (VD: lập trình Python, cấu trúc dữ liệu...)"
            className="w-full pl-12 pr-4 py-2 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none text-lg"
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
            className="w-20 px-3 py-2 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none"
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-8 py-2 rounded-xl transition-colors font-medium flex items-center gap-2"
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
  );
};

export default SearchDocumentForm;
