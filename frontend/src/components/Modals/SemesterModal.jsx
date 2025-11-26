import { useEffect } from "react";
import { Dialog } from "@headlessui/react";
import { useForm } from "react-hook-form";
import Button from "../UI/Button";


export default function SemesterModal({
  isOpen,
  onClose,
  onSave,
  initialData,
}) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: "",
      start_date: "",
      end_date: "",
      mid_term: {
        start_date: "",
        end_date: "",
      },
    },
  });

  useEffect(() => {
    if (initialData) {
      reset({
        name: initialData.name || "",
        start_date: initialData.start_date?.split("T")[0] || "",
        end_date: initialData.end_date?.split("T")[0] || "",
        mid_term: {
          start_date: initialData.mid_term?.start_date?.split("T")[0] || "",
          end_date: initialData.mid_term?.end_date?.split("T")[0] || "",
        },
      });
    } else {
      reset({
        name: "",
        start_date: "",
        end_date: "",
        mid_term: {
          start_date: "",
          end_date: "",
        },
      });
    }
  }, [initialData, reset]);

  const onSubmit = async (data) => {
    const formattedData = { ...data };
    if (initialData?._id) formattedData._id = initialData._id;
    await onSave(formattedData);
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
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm"
        aria-hidden="true"
      />

      <div className="bg-gray-100 rounded-3xl shadow-2xl w-[460px] z-10 relative overflow-hidden border border-gray-200">
        <div className="absolute top-0 left-0 right-0 h-28 bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 opacity-80"></div>

        <div className="relative p-8">
          <Dialog.Title className="text-2xl font-bold text-center mb-2 bg-gradient-to-r from-blue-700 to-indigo-600 bg-clip-text text-white">
            {isUpdate ? "Chỉnh sửa học kỳ" : "Thêm học kỳ mới"}
          </Dialog.Title>
          <p className="text-center text-white text-sm mb-8">
            {isUpdate
              ? "Cập nhật thông tin học kỳ bên dưới"
              : "Điền đầy đủ thông tin để tạo học kỳ mới"}
          </p>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Tên học kỳ
              </label>
              <input
                type="text"
                placeholder="VD: Học kỳ 1 - Năm học 2025"
                className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                {...register("name", { required: "Vui lòng nhập tên học kỳ" })}
              />
              {errors.name && (
                <p className="text-red-500 text-xs mt-1 ml-1">
                  {errors.name.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Thời gian bắt đầu
              </label>
              <input
                type="date"
                className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                {...register("start_date", {
                  required: "Vui lòng chọn ngày bắt đầu",
                })}
              />
              {errors.start_date && (
                <p className="text-red-500 text-xs mt-1 ml-1">
                  {errors.start_date.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Thời gian kết thúc
              </label>
              <input
                type="date"
                className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                {...register("end_date", {
                  required: "Vui lòng chọn ngày kết thúc",
                })}
              />
              {errors.end_date && (
                <p className="text-red-500 text-xs mt-1 ml-1">
                  {errors.end_date.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Thời gian giữa kỳ - Ngày bắt đầu
              </label>
              <input
                type="date"
                className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                {...register("mid_term.start_date")}
              />
              {errors.mid_term?.start_date && (
                <p className="text-red-500 text-xs mt-1 ml-1">
                  {errors.mid_term.start_date.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Thời gian giữa kỳ - Ngày kết thúc
              </label>
              <input
                type="date"
                className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                {...register("mid_term.end_date")}
              />
              {errors.mid_term?.end_date && (
                <p className="text-red-500 text-xs mt-1 ml-1">
                  {errors.mid_term.end_date.message}
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
                className={`px-5 py-2.5 rounded-xl font-semibold text-white shadow-md transition-all ${
                  isUpdate
                    ? "bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 hover:shadow-green-500/30"
                    : "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 hover:shadow-blue-500/30"
                }`}
              >
                {isUpdate ? "Cập nhật" : "Lưu học kỳ"}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </Dialog>
  );
}
