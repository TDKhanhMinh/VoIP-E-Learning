import { Dialog } from "@headlessui/react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { FaClipboardList, FaCheckCircle, FaTimesCircle } from "react-icons/fa";

export default function GradeModal({ isOpen, onClose, onSave, initialData }) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      score: "",
      feedback: "",
      graded: true,
    },
  });

  useEffect(() => {
    if (initialData) {
      reset({
        score: initialData.score || "",
        feedback: initialData.feedback || "",
        graded: initialData.graded ?? true,
      });
    } else {
      reset({
        score: "",
        feedback: "",
        graded: true,
      });
    }
  }, [initialData, reset]);

  const onSubmit = (data) => {
    onSave(data);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center"
    >
      <div
        className="fixed inset-0 bg-gray-800/40 dark:bg-black/60 backdrop-blur-sm"
        aria-hidden="true"
      />

      <div className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-6 w-full max-w-lg z-50 border border-gray-100 dark:border-gray-700">
        <div className="flex items-center justify-between mb-5 border-b dark:border-gray-700 pb-3">
          <div className="flex items-center space-x-3">
            <div className="bg-blue-100 dark:bg-blue-900/30 p-2 rounded-lg">
              <FaClipboardList className="text-blue-600 dark:text-blue-400 w-6 h-6" />
            </div>
            <div>
              <Dialog.Title className="text-xl font-semibold text-gray-800 dark:text-white">
                {initialData ? "Chỉnh sửa điểm bài nộp" : "Chấm điểm bài tập"}
              </Dialog.Title>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Nhập điểm và phản hồi cho sinh viên
              </p>
            </div>
          </div>

          {initialData && (
            <span
              className={`flex items-center text-xs font-medium px-3 py-1 rounded-full ${
                initialData.graded
                  ? "bg-green-100 text-green-700"
                  : "bg-yellow-100 text-yellow-700"
              }`}
            >
              {initialData.graded ? (
                <FaCheckCircle className="mr-1 text-green-600" />
              ) : (
                <FaTimesCircle className="mr-1 text-yellow-600" />
              )}
              {initialData.graded ? "Đã chấm" : "Chưa chấm"}
            </span>
          )}
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
              Điểm (0 - 10)
            </label>
            <input
              type="number"
              step="0.1"
              min="0"
              max="10"
              {...register("score", {
                required: "Vui lòng nhập điểm",
                min: { value: 0, message: "Điểm phải ≥ 0" },
                max: { value: 10, message: "Điểm phải ≤ 10" },
              })}
              className="w-full border border-gray-300 dark:border-gray-600 rounded-lg p-2.5 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-400 dark:focus:ring-blue-500 focus:border-transparent placeholder:text-gray-400 dark:placeholder:text-gray-500"
              placeholder="Nhập điểm..."
            />
            {errors.score && (
              <p className="text-red-600 dark:text-red-400 text-sm mt-1">
                {errors.score.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
              Nhận xét (Feedback)
            </label>
            <textarea
              rows={4}
              {...register("feedback")}
              className="w-full border border-gray-300 dark:border-gray-600 rounded-lg p-2.5 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-400 dark:focus:ring-blue-500 focus:border-transparent resize-none placeholder:text-gray-400 dark:placeholder:text-gray-500"
              placeholder="Nhập nhận xét hoặc lời khuyên cho sinh viên..."
            />
          </div>

          <div className="flex justify-end space-x-3 pt-3 border-t dark:border-gray-700 mt-5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 transition"
            >
              Hủy
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-lg bg-gradient-to-r from-blue-600 to-blue-500 text-white font-medium hover:opacity-90 transition"
            >
              {initialData ? "Lưu thay đổi" : "Lưu điểm"}
            </button>
          </div>
        </form>
      </div>
    </Dialog>
  );
}
