import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useEffect } from "react";
import { useForm } from "react-hook-form";
import Button from "./Button";

export default function AssignmentModal({
  isOpen,
  onClose,
  onSave,
  classId,
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
      due_at: "",
      description: "",
    },
  });

  useEffect(() => {
    if (initialData) {
      reset({
        title: initialData.title || "",
        due_at: initialData.due_at
          ? new Date(initialData.due_at).toISOString().slice(0, 16)
          : "",
        description: initialData.description || "",
      });
    } else {
      reset({
        title: "",
        due_at: "",
        description: "",
      });
    }
  }, [initialData, reset]);

  const onSubmit = (data) => {
    const assignment = {
      ...data,
      class: classId,
    };
    onSave(assignment);
    onClose();
    reset();
  };

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog
        as="div"
        className="fixed inset-0 z-50 flex items-center justify-center"
        onClose={onClose}
      >

        <Transition.Child
          as={Fragment}
          enter="ease-out duration-200"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-150"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" />
        </Transition.Child>


        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0 scale-90 translate-y-4"
          enterTo="opacity-100 scale-100 translate-y-0"
          leave="ease-in duration-200"
          leaveFrom="opacity-100 scale-100"
          leaveTo="opacity-0 scale-95"
        >
          <div className="relative bg-gradient-to-b from-white via-slate-50 to-white rounded-2xl shadow-2xl p-6 w-[480px] border border-slate-200">
            <Dialog.Title className="text-xl font-bold text-gray-800 mb-5 text-center">
              {initialData ? "Chỉnh sửa bài tập" : "Giao bài tập mới"}
            </Dialog.Title>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Tên bài
                </label>
                <input
                  type="text"
                  className="w-full rounded-lg border border-gray-300 p-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition outline-none"
                  placeholder="Nhập tên bài tập"
                  {...register("title", { required: "Vui lòng nhập tên bài" })}
                />
                {errors.title && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.title.message}
                  </p>
                )}
              </div>


              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Hạn nộp
                </label>
                <input
                  type="datetime-local"
                  className="w-full rounded-lg border border-gray-300 p-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition outline-none"
                  {...register("due_at", {
                    required: "Vui lòng chọn hạn nộp",
                  })}
                />
                {errors.due_at && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.due_at.message}
                  </p>
                )}
              </div>


              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Mô tả
                </label>
                <textarea
                  rows={4}
                  className="w-full rounded-lg border border-gray-300 p-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition outline-none resize-none"
                  placeholder="Nhập nội dung mô tả bài tập"
                  {...register("description", {
                    required: "Vui lòng nhập mô tả",
                  })}
                />
                {errors.description && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.description.message}
                  </p>
                )}
              </div>


              <div className="mt-6 flex justify-end space-x-3">
                <Button
                  type="button"
                  className="px-4 py-2 rounded-lg bg-gray-200 text-gray-700 hover:bg-gray-300 transition font-medium"
                  onClick={onClose}
                >
                  Hủy
                </Button>
                <Button
                  type="submit"
                  className="px-5 py-2.5 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition font-medium shadow-sm"
                >
                  {initialData ? "Cập nhật" : "Lưu"}
                </Button>
              </div>
            </form>
          </div>
        </Transition.Child>
      </Dialog>
    </Transition>
  );
}
