import { Dialog } from "@headlessui/react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { FaBell, FaTimes } from "react-icons/fa";
import Button from "./Button";

export default function NotificationModal({
    isOpen,
    onClose,
    onSubmitData,
    initialData,
}) {
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm({
        defaultValues: {
            title: "",
            content: "",
        },
    });

    // Reset lại dữ liệu khi mở modal
    useEffect(() => {
        if (initialData) {
            reset({
                title: initialData.title || "",
                content: initialData.content || "",
            });
        } else {
            reset({
                title: "",
                content: "",
            });
        }
    }, [initialData, reset]);

    const onSubmit = (data) => {
        onSubmitData(data);
        onClose();
    };

    if (!isOpen) return null;

    return (
        <Dialog
            open={isOpen}
            onClose={onClose}
            className="fixed inset-0 z-50 flex items-center justify-center"
        >
        
            <div className="fixed inset-0 bg-gray-900/40 backdrop-blur-sm transition-opacity" />

        
            <div className="relative bg-white rounded-2xl shadow-2xl w-[90%] max-w-lg p-6 animate-fade-in">
            
                <button
                    onClick={onClose}
                    className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 transition"
                >
                    <FaTimes size={18} />
                </button>

            
                <div className="flex items-center gap-3 mb-4 border-b pb-3">
                    <div className="bg-blue-100 text-blue-600 p-2 rounded-lg">
                        <FaBell />
                    </div>
                    <h2 className="text-xl font-bold text-gray-800">
                        {initialData ? "Chỉnh sửa thông báo" : "Tạo thông báo mới"}
                    </h2>
                </div>

            
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                
                    <div>
                        <label className="block font-semibold text-gray-700 mb-1">
                            Tiêu đề <span className="text-red-500">*</span>
                        </label>
                        <input
                            {...register("title", { required: "Vui lòng nhập tiêu đề" })}
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 outline-none transition"
                            placeholder="Nhập tiêu đề thông báo..."
                        />
                        {errors.title && (
                            <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>
                        )}
                    </div>

                
                    <div>
                        <label className="block font-semibold text-gray-700 mb-1">
                            Mô tả / Nội dung <span className="text-red-500">*</span>
                        </label>
                        <textarea
                            {...register("content", {
                                required: "Vui lòng nhập nội dung thông báo",
                            })}
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 h-32 resize-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 outline-none transition"
                            placeholder="Nhập nội dung chi tiết của thông báo..."
                        />
                        {errors.content && (
                            <p className="text-red-500 text-sm mt-1">
                                {errors.content.message}
                            </p>
                        )}
                    </div>

                
                    <div className="flex justify-end gap-3 pt-3 border-t">
                        <Button
                            type="button"
                            variant="secondary"
                            onClick={onClose}
                            className="!bg-gray-100 !text-gray-700 hover:!bg-gray-200"
                        >
                            Hủy
                        </Button>
                        <Button
                            type="submit"
                            className="!bg-blue-600 hover:!bg-blue-700 text-white px-5"
                        >
                            {initialData ? "Cập nhật" : "Tạo mới"}
                        </Button>
                    </div>
                </form>
            </div>
        </Dialog>
    );
}
