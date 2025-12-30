import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useEffect } from "react";
import { useForm } from "react-hook-form";
import Button from "../UI/Button";

export default function TestModal({
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
      start: "",
      end: "",
      time: "",
      attempts: "",
      description: "",
    },
  });

  useEffect(() => {
    if (initialData) {
      console.log(initialData);
      reset({
        title: initialData.title || "",
        start: initialData.start
          ? new Date(initialData.start).toISOString().slice(0, 16)
          : "",
        end: initialData.end
          ? new Date(initialData.end).toISOString().slice(0, 16)
          : "",
        time: initialData.time || "",
        attempts: initialData.attempts || "",
        description: initialData.description || "",
      });
    } else {
      reset({
        title: "",
        start: "",
        end: "",
        time: "",
        attempts: "",
        description: "",
      });
    }
  }, [initialData, reset]);

  const onSubmit = (data) => {
    const test = {
      ...data,
      class: classId,
    };
    onSave(test);
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
          <div className="fixed inset-0 bg-black/40 dark:bg-black/60 backdrop-blur-sm" />
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
          <div className="relative bg-gradient-to-b from-white via-slate-50 to-white dark:from-gray-800 dark:via-gray-800 dark:to-gray-800 rounded-2xl shadow-2xl p-6 w-[480px] border border-slate-200 dark:border-gray-700">
            <Dialog.Title className="text-xl font-bold text-gray-800 dark:text-white mb-5 text-center">
              {initialData ? "Chỉnh sửa bài thi" : "Giao bài thi mới"}
            </Dialog.Title>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
                  Tiêu đề bài thi
                </label>
                <input
                  type="text"
                  className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white p-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:focus:border-blue-400 transition outline-none placeholder:text-gray-400 dark:placeholder:text-gray-500"
                  placeholder="Nhập tiêu đề bài thi"
                  {...register("title", {
                    required: "Vui lòng nhập tiêu đề bài thi",
                  })}
                />
                {errors.title && (
                  <p className="text-red-500 dark:text-red-400 text-sm mt-1">
                    {errors.title.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
                  Bắt đầu
                </label>
                <input
                  type="datetime-local"
                  className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white p-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:focus:border-blue-400 transition outline-none"
                  {...register("start", {
                    required: "Vui lòng chọn thời gian bắt đầu",
                  })}
                />
                {errors.start && (
                  <p className="text-red-500 dark:text-red-400 text-sm mt-1">
                    {errors.start.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
                  Kết thúc
                </label>
                <input
                  type="datetime-local"
                  className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white p-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:focus:border-blue-400 transition outline-none"
                  {...register("end", {
                    required: "Vui lòng chọn thời gian kết thúc",
                  })}
                />
                {errors.end && (
                  <p className="text-red-500 dark:text-red-400 text-sm mt-1">
                    {errors.end.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
                  Thời gian làm bài (phút)
                </label>
                <input
                  type="number"
                  className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white p-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:focus:border-blue-400 transition outline-none placeholder:text-gray-400 dark:placeholder:text-gray-500"
                  {...register("time", {
                    required: "Vui lòng chọn thời gian kết thúc",
                  })}
                />
                {errors.time && (
                  <p className="text-red-500 dark:text-red-400 text-sm mt-1">
                    {errors.time.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
                  Số lượt làm bài
                </label>
                <input
                  type="number"
                  className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white p-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:focus:border-blue-400 transition outline-none placeholder:text-gray-400 dark:placeholder:text-gray-500"
                  {...register("attempts", {
                    required: "Vui lòng chọn thời gian kết thúc",
                  })}
                />
                {errors.attempts && (
                  <p className="text-red-500 dark:text-red-400 text-sm mt-1">
                    {errors.attempts.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
                  Mô tả
                </label>
                <textarea
                  rows={3}
                  className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white p-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:focus:border-blue-400 transition outline-none resize-none placeholder:text-gray-400 dark:placeholder:text-gray-500"
                  placeholder="Nhập nội dung mô tả bài tập"
                  {...register("description", {
                    required: "Vui lòng nhập mô tả",
                  })}
                />
                {errors.description && (
                  <p className="text-red-500 dark:text-red-400 text-sm mt-1">
                    {errors.description.message}
                  </p>
                )}
              </div>

              <div className="mt-6 flex justify-end space-x-3">
                <Button
                  type="button"
                  className="px-4 py-2 rounded-lg bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600 transition font-medium"
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
