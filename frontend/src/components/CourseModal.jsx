import { useEffect } from "react";
import { Dialog } from "@headlessui/react";
import { useForm } from "react-hook-form";
import Button from "./Button";

export default function CourseModal({ isOpen, onClose, onSave, initialData }) {
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm({
        defaultValues: {
            code: "",
            title: "",
            description: "",
        },
    });

    useEffect(() => {
        if (initialData) {
            reset({
                code: initialData.code || "",
                title: initialData.title || "",
                description: initialData.description || "",
            });
        } else {
            reset({
                code: "",
                title: "",
                description: "",
            });
        }
    }, [initialData, reset]);

    const onSubmit = (data) => {
        const payload = { ...data };
        if (initialData?._id) payload._id = initialData._id;
        onSave(payload);
        onClose();
        reset();
    };

    const closeAndReset = () => {
        reset();
        onClose();
    };

    if (!isOpen) return null;

    const isUpdate = Boolean(initialData);

    return (
        <Dialog
            open={isOpen}
            onClose={closeAndReset}
            className="fixed inset-0 z-50 flex items-center justify-center"
        >

            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" aria-hidden="true" />


            <div className=" bg-gradient-to-br from-blue-50 to-blue-100 rounded-3xl shadow-2xl w-[480px] z-10 relative overflow-hidden border border-gray-200">

                <div className="absolute top-0 left-0 right-0 h-28 bg-gradient-to-br from-blue-200 to-blue-800"></div>

                <div className="relative p-8">
                    <Dialog.Title className="text-2xl font-bold text-center mb-2 bg-gradient-to-r from-blue-700 to-indigo-600 bg-clip-text text-white">
                        {isUpdate ? "Chỉnh sửa môn học" : "Thêm môn học mới"}
                    </Dialog.Title>
                    <p className="text-center text-white text-sm mb-8">
                        {isUpdate
                            ? "Cập nhật thông tin môn học bên dưới"
                            : "Điền đầy đủ thông tin để thêm môn học mới"}
                    </p>


                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Mã môn học
                            </label>
                            <input
                                type="text"
                                placeholder="VD: IT001"
                                className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                                {...register("code", { required: "Vui lòng nhập mã môn học" })}
                            />
                            {errors.code && (
                                <p className="text-red-500 text-xs mt-1 ml-1">{errors.code.message}</p>
                            )}
                        </div>


                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Tên môn học
                            </label>
                            <input
                                type="text"
                                placeholder="VD: Lập trình Web"
                                className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                                {...register("title", { required: "Vui lòng nhập tên môn học" })}
                            />
                            {errors.title && (
                                <p className="text-red-500 text-xs mt-1 ml-1">{errors.title.message}</p>
                            )}
                        </div>


                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Mô tả
                            </label>
                            <textarea
                                rows={3}
                                placeholder="Nhập mô tả ngắn gọn về môn học"
                                className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all resize-none"
                                {...register("description", { required: "Vui lòng nhập mô tả" })}
                            />
                            {errors.description && (
                                <p className="text-red-500 text-xs mt-1 ml-1">
                                    {errors.description.message}
                                </p>
                            )}
                        </div>


                        <div className="pt-6 flex justify-end gap-3">
                            <Button
                                type="button"
                                onClick={closeAndReset}
                                className="px-5 py-2.5 rounded-xl border-2 border-gray-300 bg-gray-100 hover:bg-gray-200 font-semibold text-gray-700 transition-all"
                            >
                                Hủy
                            </Button>
                            <Button
                                type="submit"
                                className={`px-5 py-2.5 rounded-xl font-semibold text-white shadow-md transition-all ${isUpdate
                                    ? "bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 hover:shadow-green-500/30"
                                    : "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 hover:shadow-blue-500/30"
                                    }`}
                            >
                                {isUpdate ? "Cập nhật" : "Lưu môn học"}
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </Dialog>
    );
}
