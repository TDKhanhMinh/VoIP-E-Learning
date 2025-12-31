import React from "react";
import { Tag, ExternalLink, Trash2 } from "lucide-react";

const DocumentCard = ({ document, rank, showScore, isAdmin, onDelete }) => {
  const levelColors = {
    Beginner: "bg-green-100 text-green-800",
    Intermediate: "bg-yellow-100 text-yellow-800",
    Advanced: "bg-red-100 text-red-800",
  };

  return (
    <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border-2 border-gray-100 hover:border-blue-300 relative">
      <div className="p-6">        
        <div className="flex items-start justify-between mb-3 gap-2">
          <div className="flex items-center gap-2 flex-wrap flex-1 min-w-0">
            {rank && (
              <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-bold shrink-0">
                #{rank}
              </span>
            )}
            {showScore && (
              <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-semibold shrink-0">
                Điểm: {(document.score * 100).toFixed(1)}%
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
        </div>
      </div>
    </div>
  );
};

export default DocumentCard;
