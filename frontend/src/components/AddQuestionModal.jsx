import React, { useState } from "react";

const AddQuestionModal = ({
  isOpen,
  onClose,
  onImport,
  title,
  description,
  fileType = ".docx",
}) => {
  const [file, setFile] = useState(null);

  if (!isOpen) return null;

  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    if (selected && selected.name.endsWith(fileType)) {
      setFile(selected);
    } else {
      alert(`Vui lòng chọn file ${fileType ?? ".docx"}`);
    }
  };

  const handleImport = () => {
    if (!file) return alert(`Hãy chọn file ${fileType ?? ".docx"} trước`);
    onImport(file);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white w-full max-w-md rounded-xl shadow-lg p-6 animate-[fadeIn_0.2s]">
        <h2 className="text-xl font-bold text-gray-800 mb-4">
          {title ?? "Import câu hỏi từ file .docx"}
        </h2>

        <p className="text-gray-500 text-sm mb-4">
          {description ?? "Chọn file .docx chứa danh sách câu hỏi của bạn."}
        </p>

        <label className="w-full flex flex-col items-center justify-center p-5 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-blue-500 transition">
          <input
            type="file"
            accept={fileType ?? ".docx"}
            onChange={handleFileChange}
            className="hidden"
          />

          <svg
            className="w-10 h-10 text-gray-400 mb-3"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M7 16V4a1 1 0 011-1h4.586a1 1 0 01.707.293l5.414 5.414A1 1 0 0119 9.414V20a1 1 0 01-1 1H8a1 1 0 01-1-1zm5-12v4h4"
            />
          </svg>

          <span className="text-gray-600">
            {file ? file.name : `Chọn file ${fileType ?? ".docx"}`}
          </span>
        </label>

        <div className="flex justify-end gap-3 mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-100 transition"
          >
            Hủy
          </button>

          <button
            onClick={handleImport}
            className="px-5 py-2 rounded-md bg-blue-600 text-white font-semibold hover:bg-blue-700 transition disabled:opacity-50"
            disabled={!file}
          >
            Import
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddQuestionModal;
