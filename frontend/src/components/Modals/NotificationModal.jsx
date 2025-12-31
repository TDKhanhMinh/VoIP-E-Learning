import { Dialog } from "@headlessui/react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { FaBell, FaTimes } from "react-icons/fa";
import Button from "../UI/Button";

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
        
            <div className="fixed inset-0 bg-gray-900/40 dark:bg-black/60 backdrop-blur-sm transition-opacity" />

        
            <div className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-[90%] max-w-lg p-6 animate-fade-in">
            
                <button
                    onClick={onClose}
                    className="absolute top-3 right-3 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition"
                >
                    <FaTimes size={18} />
                </button>

            
                <div className="flex items-center gap-3 mb-4 border-b dark:border-gray-700 pb-3">
                    <div className="bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 p-2 rounded-lg">
                        <FaBell />
                    </div>
                    <h2 className="text-xl font-bold text-gray-800 dark:text-white">
                        {initialData ? "Chỉnh sửa thông báo" : "Tạo thông báo mới"}
                    </h2>
                </div>

            
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                
                    <div>
                        <label className="block font-semibold text-gray-700 dark:text-gray-300 mb-1">
                            Tiêu đề <span className="text-red-500 dark:text-red-400">*</span>
                        </label>
                        <input
                            {...register("title", { required: "Vui lòng nhập tiêu đề" })}
                            className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-400 dark:focus:ring-blue-500 focus:border-blue-400 dark:focus:border-blue-400 outline-none transition placeholder:text-gray-400 dark:placeholder:text-gray-500"
                            placeholder="Nhập tiêu đề thông báo..."
                        />
                        {errors.title && (
                            <p className="text-red-500 dark:text-red-400 text-sm mt-1">{errors.title.message}</p>
                        )}
                    </div>

                
                    <div>
                        <label className="block font-semibold text-gray-700 dark:text-gray-300 mb-1">
                            Mô tả / Nội dung <span className="text-red-500 dark:text-red-400">*</span>
                        </label>
                        <textarea
                            {...register("content", {
                                required: "Vui lòng nhập nội dung thông báo",
                            })}
                            className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white h-32 resize-none focus:ring-2 focus:ring-blue-400 dark:focus:ring-blue-500 focus:border-blue-400 dark:focus:border-blue-400 outline-none transition placeholder:text-gray-400 dark:placeholder:text-gray-500"
                            placeholder="Nhập nội dung chi tiết của thông báo..."
                        />
                        {errors.content && (
                            <p className="text-red-500 dark:text-red-400 text-sm mt-1">
                                {errors.content.message}
                            </p>
                        )}
                    </div>

                
                    <div className="flex justify-end gap-3 pt-3 border-t dark:border-gray-700">
                        <Button
                            type="button"
                            variant="secondary"
                            onClick={onClose}
                            className="!bg-gray-100 dark:!bg-gray-700 !text-gray-700 dark:!text-gray-200 hover:!bg-gray-200 dark:hover:!bg-gray-600"
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
