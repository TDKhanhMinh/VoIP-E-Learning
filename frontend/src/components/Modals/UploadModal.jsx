import { useForm } from "react-hook-form";
import { useState } from "react";
import { toast } from "react-toastify";
import Button from "../UI/Button";

export default function UploadModal({ isOpen, onClose, title, onSubmitData }) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);

  if (!isOpen) return null;

  const onSubmit = async (data) => {
    try {
      setUploading(true);
      setProgress(10);
      await onSubmitData(data, setProgress);
      toast.success("Nộp bài thành công ");
      reset();
      onClose();
    } catch (error) {
      console.error(error);
      toast.error(" Lỗi khi nộp bài. Vui lòng thử lại!");
    } finally {
      setUploading(false);
      setProgress(0);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 dark:bg-black/60 backdrop-blur-sm">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl w-[600px] animate-fadeIn">
        <div className="flex justify-between items-center border-b dark:border-gray-700 px-5 py-3">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-white">
            Nộp bài tập
          </h2>
          <Button
            type="button"
            onClick={onClose}
            className="text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white text-xl leading-none"
          >
            ✕
          </Button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="p-5 space-y-5">
          <p className="text-gray-700 dark:text-gray-300">
            Nộp bài cho: <b>{title}</b>
          </p>

          <div>
            <label className="block font-medium dark:text-gray-300 mb-1">
              Chọn file cần nộp
            </label>
            <input
              type="file"
              accept=".jpg,.png,.xls,.xlsx,.doc,.docx,.zip,.pdf,.ppt,.pptx,.txt,.csv,.tsv,.c,.cpp,.java,.sql"
              className={`block w-full border rounded-lg p-2 text-sm dark:bg-gray-700 dark:text-white ${
                errors.file
                  ? "border-red-500 focus:ring-red-500 dark:border-red-400"
                  : "border-gray-300 dark:border-gray-600 focus:ring-indigo-500"
              }`}
              {...register("file", { required: "Vui lòng chọn file để nộp" })}
              disabled={uploading}
            />
            {errors.file && (
              <p className="text-red-500 dark:text-red-400 text-sm mt-1">
                {errors.file.message}
              </p>
            )}
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 leading-snug">
              Hỗ trợ định dạng: <b>jpg, png, zip, pdf, docx, xlsx, pptx...</b>.
              Nếu bạn có nhiều file, hãy nén thành 1 file <b>.zip</b>.
            </p>
          </div>

          {uploading && (
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 overflow-hidden">
              <div
                className="bg-indigo-600 h-3 rounded-full transition-all duration-300 ease-out"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          )}

          <div className="flex justify-end gap-3 border-t dark:border-gray-700 pt-3">
            <Button
              type="button"
              onClick={onClose}
              disabled={uploading}
              className="px-4 py-2 rounded bg-gray-300 dark:bg-gray-700 dark:text-gray-200 hover:bg-gray-400 dark:hover:bg-gray-600"
            >
              Hủy
            </Button>
            <Button
              type="submit"
              disabled={uploading}
              className={`px-4 py-2 rounded text-white ${
                uploading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700"
              }`}
            >
              {uploading ? "Đang tải..." : "Tải lên"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
