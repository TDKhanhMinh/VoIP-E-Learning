import { Dialog } from "@headlessui/react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { FaClipboardList, FaCheckCircle, FaTimesCircle } from "react-icons/fa";
import Button from "./Button";

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
            {/* Nền mờ */}
            <div className="fixed inset-0 bg-gray-800/40 backdrop-blur-sm" aria-hidden="true" />

            {/* Hộp modal */}
            <div className="relative bg-white rounded-2xl shadow-2xl p-6 w-full max-w-lg z-50 border border-gray-100">
                {/* Header */}
                <div className="flex items-center justify-between mb-5 border-b pb-3">
                    <div className="flex items-center space-x-3">
                        <div className="bg-blue-100 p-2 rounded-lg">
                            <FaClipboardList className="text-blue-600 w-6 h-6" />
                        </div>
                        <div>
                            <Dialog.Title className="text-xl font-semibold text-gray-800">
                                {initialData ? "Chỉnh sửa điểm bài nộp" : "Chấm điểm bài tập"}
                            </Dialog.Title>
                            <p className="text-sm text-gray-500">
                                Nhập điểm và phản hồi cho sinh viên
                            </p>
                        </div>
                    </div>

                    {/* Trạng thái graded */}
                    {initialData && (
                        <span
                            className={`flex items-center text-xs font-medium px-3 py-1 rounded-full ${initialData.graded
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

                {/* Form */}
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                    {/* Điểm */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">
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
                            className="w-full border border-gray-300 rounded-lg p-2.5 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent text-gray-700"
                            placeholder="Nhập điểm..."
                        />
                        {errors.score && (
                            <p className="text-red-600 text-sm mt-1">{errors.score.message}</p>
                        )}
                    </div>

                    {/* Nhận xét */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">
                            Nhận xét (Feedback)
                        </label>
                        <textarea
                            rows={4}
                            {...register("feedback")}
                            className="w-full border border-gray-300 rounded-lg p-2.5 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent text-gray-700 resize-none"
                            placeholder="Nhập nhận xét hoặc lời khuyên cho sinh viên..."
                        />
                    </div>

                    {/* Actions */}
                    <div className="flex justify-end space-x-3 pt-3 border-t mt-5">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100 transition"
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
