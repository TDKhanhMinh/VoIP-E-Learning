import React, { useState, useEffect } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { X, Save, FileText } from "lucide-react";

const SummaryEditModal = ({ isOpen, onClose, initialData, onSave }) => {
  const [value, setValue] = useState("");

  useEffect(() => {
    if (isOpen) {
      setValue(initialData || "");
    }
  }, [isOpen, initialData]);

  if (!isOpen) return null;

  const modules = {
    toolbar: [
      [{ header: [1, 2, 3, false] }],
      ["bold", "italic", "underline", "strike"],
      [{ list: "ordered" }, { list: "bullet" }],
      ["clean"],
    ],
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 dark:bg-black/60 backdrop-blur-sm p-4 overflow-hidden">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-4xl flex flex-col h-[90vh] animate-in fade-in zoom-in duration-200">
        <div className="flex-none flex items-center justify-between p-5 border-b border-gray-100 dark:border-gray-700">
          <div className="flex items-center gap-2 text-gray-800 dark:text-white">
            <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg text-blue-600 dark:text-blue-400">
              <FileText size={20} />
            </div>
            <div>
              <h3 className="text-lg font-bold">Chỉnh sửa Tóm tắt</h3>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 dark:text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full"
          >
            <X size={24} />
          </button>
        </div>

        <div className="flex-1 overflow-hidden p-6 flex flex-col w-full">
          <div className="quill-wrapper-fix h-full flex flex-col dark:text-white">
            <ReactQuill
              theme="snow"
              value={value}
              onChange={setValue}
              modules={modules}
              className="h-full dark-mode-quill"
            />
          </div>

          <style>{`
            /* 1. Class cha (.quill) phải là flex column và full chiều cao */
            .quill-wrapper-fix .quill {
              display: flex;
              flex-direction: column;
              height: 100%;
            }

            /* 2. Toolbar giữ nguyên */
            .quill-wrapper-fix .ql-toolbar {
              flex: 0 0 auto; /* Không co, không giãn */
              border-top-left-radius: 0.5rem;
              border-top-right-radius: 0.5rem;
            }

            /* 3. Vùng nội dung: Quan trọng nhất! */
            .quill-wrapper-fix .ql-container {
              flex: 1 1 auto; /* Tự động giãn để lấp đầy khoảng trống */
              overflow-y: auto !important; /* Bắt buộc hiện thanh cuộn */
              height: 0px; /* Hack CSS: set height 0 để flex-grow hoạt động chính xác trên Safari/Chrome */
              min-height: 0; /* Đảm bảo không bị tràn */
              border-bottom-left-radius: 0.5rem;
              border-bottom-right-radius: 0.5rem;
            }
            
            /* Tùy chỉnh thanh cuộn cho đẹp */
            .quill-wrapper-fix .ql-container::-webkit-scrollbar {
              width: 8px;
            }
            .quill-wrapper-fix .ql-container::-webkit-scrollbar-track {
              background: #f1f1f1; 
            }
            .quill-wrapper-fix .ql-container::-webkit-scrollbar-thumb {
              background: #cbd5e1; 
              border-radius: 4px;
            }
            
            /* Dark mode styles for ReactQuill */
            .dark .dark-mode-quill .ql-toolbar {
              background-color: #374151;
              border-color: #4b5563;
            }
            
            .dark .dark-mode-quill .ql-container {
              background-color: #1f2937;
              border-color: #4b5563;
              color: #f3f4f6;
            }
            
            .dark .dark-mode-quill .ql-editor {
              color: #f3f4f6;
            }
            
            .dark .dark-mode-quill .ql-editor.ql-blank::before {
              color: #9ca3af;
            }
            
            .dark .dark-mode-quill .ql-stroke {
              stroke: #d1d5db;
            }
            
            .dark .dark-mode-quill .ql-fill {
              fill: #d1d5db;
            }
            
            .dark .dark-mode-quill .ql-picker-label {
              color: #d1d5db;
            }
            
            .dark .dark-mode-quill .ql-picker-options {
              background-color: #374151;
              border-color: #4b5563;
            }
            
            .dark .dark-mode-quill .ql-picker-item:hover {
              background-color: #4b5563;
              color: #f3f4f6;
            }
            
            .dark .quill-wrapper-fix .ql-container::-webkit-scrollbar-track {
              background: #374151; 
            }
            .dark .quill-wrapper-fix .ql-container::-webkit-scrollbar-thumb {
              background: #6b7280; 
            }
          `}</style>
        </div>

        <div className="flex-none px-5 py-2.5 border-t border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 rounded-b-xl flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-5 py-2.5 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg"
          >
            Hủy bỏ
          </button>
          <button
            onClick={() => {
              onSave(value);
              onClose();
            }}
            className="px-5 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
          >
            Lưu thay đổi
          </button>
        </div>
      </div>
    </div>
  );
};

export default SummaryEditModal;
