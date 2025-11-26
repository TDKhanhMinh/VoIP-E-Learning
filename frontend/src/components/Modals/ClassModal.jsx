import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useEffect, useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import Button from "../UI/Button";
import { FaChalkboardTeacher, FaTrash, FaPlus } from "react-icons/fa";
import SelectField from "../UI/SelectField";

export default function ClassModal({
  isOpen,
  onClose,
  onSave,
  courses = [],
  teachers = [],
  semesters = [],
  initialData,
}) {
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    control,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: "",
      course: "",
      teacher: "",
      semester: "",
      schedule: [{ dayOfWeek: "", shift: "", type: "", room: "" }],
      theoryWeeks: null,
      practiceWeeks: null,
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "schedule",
  });

  const [scheduleError, setScheduleError] = useState("");

  useEffect(() => {
    if (initialData) {
      reset({
        name: initialData.name || "",
        course: initialData.course || "",
        teacher: initialData.teacher || "",
        semester: initialData.semester || "",
        schedule:
          initialData.schedule && Array.isArray(initialData.schedule)
            ? initialData.schedule
            : [{ dayOfWeek: "", shift: "", type: "", room: "" }],
        theoryWeeks: initialData.theoryWeeks || null,
        practiceWeeks: initialData.practiceWeeks || null,
      });
    } else {
      reset({
        name: "",
        course: "",
        teacher: "",
        semester: "",
        schedule: [{ dayOfWeek: "", shift: "", type: "", room: "" }],
        theoryWeeks: null,
        practiceWeeks: null,
      });
    }
  }, [initialData, reset, isOpen]);

  const checkDuplicateSchedule = (schedules) => {
    const seen = new Set();
    for (let i = 0; i < schedules.length; i++) {
      const schedule = schedules[i];
      if (!schedule.dayOfWeek || !schedule.shift) continue;

      const key = `${schedule.dayOfWeek}-${schedule.shift}`;
      if (seen.has(key)) {
        return `Buổi học ${
          i + 1
        } trùng thời gian với buổi khác (cùng thứ và ca)`;
      }
      seen.add(key);
    }
    return null;
  };

  const onSubmit = (data) => {
    const duplicateError = checkDuplicateSchedule(data.schedule);
    if (duplicateError) {
      setScheduleError(duplicateError);
      return;
    }

    setScheduleError("");
    const payload = { ...data };
    if (initialData?._id) payload._id = initialData._id;

    onSave(payload);
    onClose();
    reset();
  };

  const isEditing = Boolean(initialData);

  const daysOfWeek = [
    { value: 2, label: "Thứ 2" },
    { value: 3, label: "Thứ 3" },
    { value: 4, label: "Thứ 4" },
    { value: 5, label: "Thứ 5" },
    { value: 6, label: "Thứ 6" },
    { value: 7, label: "Thứ 7" },
  ];

  const shifts = [
    { value: 1, label: "Ca 1 (06:50 - 09:20)" },
    { value: 2, label: "Ca 2 (09:30 - 12:00)" },
    { value: 3, label: "Ca 3 (12:45 - 15:15)" },
    { value: 4, label: "Ca 4 (15:25 - 17:55)" },
  ];

  const types = [
    { value: "theory", label: "Lý thuyết" },
    { value: "practice", label: "Thực hành" },
  ];

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog
        as="div"
        className="relative z-50"
        onClose={() => {
          onClose();
          reset();
        }}
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

        <div className="fixed inset-0 overflow-y-auto  flex items-center justify-center px-4 py-8 ">
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-200"
            enterFrom="opacity-0 scale-95 translate-y-2"
            enterTo="opacity-100 scale-100 translate-y-0"
            leave="ease-in duration-150"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-95 translate-y-2"
          >
            <Dialog.Panel className="w-full max-w-xl transform rounded-2xl bg-white shadow-2xl ring-1 ring-gray-200 transition-all flex flex-col max-h-[90vh]">
              {/* Header */}
              <div
                className={`flex items-center gap-3 px-6 py-4 border-b rounded-t-xl ${
                  isEditing
                    ? "bg-gradient-to-r from-amber-100 to-yellow-50"
                    : "bg-gradient-to-r from-blue-100 to-indigo-50"
                }`}
              >
                <div
                  className={`p-2 rounded-full ${
                    isEditing
                      ? "bg-yellow-500 text-white"
                      : "bg-blue-600 text-white"
                  }`}
                >
                  <FaChalkboardTeacher size={20} />
                </div>
                <Dialog.Title
                  as="h3"
                  className="text-lg font-semibold text-gray-800"
                >
                  {isEditing ? "Chỉnh sửa lớp học" : "Thêm lớp học mới"}
                </Dialog.Title>
              </div>

              {/* Body */}
              <form
                onSubmit={handleSubmit(onSubmit)}
                className="flex flex-col flex-1 overflow-hidden"
              >
                <div className="px-6 py-5 bg-white overflow-y-auto flex-1">
                  <div className="space-y-5">
                    {/* --- Tên lớp --- */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Tên lớp <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                        placeholder="VD: Lập trình Web - Nhóm 1"
                        {...register("name", {
                          required: "Vui lòng nhập tên lớp",
                        })}
                      />
                      {errors.name && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.name.message}
                        </p>
                      )}
                    </div>

                    {/* --- Môn học --- */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Môn học <span className="text-red-500">*</span>
                      </label>
                      <SelectField
                        name="course"
                        options={courses.map((c) => ({
                          label: c.title,
                          value: c._id,
                        }))}
                        value={watch("course")}
                        onChange={(v) =>
                          setValue("course", v, { shouldValidate: true })
                        }
                        required
                      />
                    </div>

                    {/* --- Giảng viên --- */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Giảng viên <span className="text-red-500">*</span>
                      </label>
                      <SelectField
                        name="teacher"
                        options={teachers.map((t) => ({
                          label: t.full_name,
                          value: t._id,
                        }))}
                        value={watch("teacher")}
                        onChange={(v) =>
                          setValue("teacher", v, { shouldValidate: true })
                        }
                        required
                      />
                    </div>

                    {/* --- Học kỳ --- */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Học kỳ <span className="text-red-500">*</span>
                      </label>
                      <SelectField
                        name="semester"
                        options={semesters.map((s) => ({
                          label: s.name,
                          value: s._id,
                        }))}
                        value={watch("semester")}
                        onChange={(v) =>
                          setValue("semester", v, { shouldValidate: true })
                        }
                        required
                      />
                    </div>

                    {/* --- Lịch học --- */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Số tuần học lý thuyết{" "}
                        <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                        placeholder="VD: 15"
                        {...register("theoryWeeks", {
                          required: "Vui lòng nhập số tuần học lý thuyết",
                        })}
                      />
                      {errors.theoryWeeks && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.theoryWeeks.message}
                        </p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Số tuần học thực hành (nếu có){" "}
                      </label>
                      <input
                        type="text"
                        className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                        placeholder="VD: 10"
                        {...register("practiceWeeks", {
                          required: false,
                        })}
                      />
                      {errors.practiceWeeks && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.practiceWeeks.message}
                        </p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Lịch học <span className="text-red-500">*</span>
                      </label>

                      <div className="space-y-3">
                        {fields.map((field, index) => (
                          <div
                            key={field.id}
                            className="flex items-center gap-3 border p-3 rounded-lg bg-gray-50"
                          >
                            <div className="flex flex-row space-x-2 flex-1 ">
                              <div className="flex-1">
                                <SelectField
                                  label="Thứ"
                                  name={`schedule[${index}].dayOfWeek`}
                                  options={daysOfWeek}
                                  value={
                                    watch(`schedule.${index}.dayOfWeek`) || ""
                                  }
                                  onChange={(v) => {
                                    setValue(
                                      `schedule.${index}.dayOfWeek`,
                                      Number(v),
                                      {
                                        shouldValidate: true,
                                      }
                                    );
                                    setScheduleError("");
                                  }}
                                  required
                                />

                                <SelectField
                                  label="Ca"
                                  name={`schedule[${index}].shift`}
                                  options={shifts}
                                  value={watch(`schedule.${index}.shift`) || ""}
                                  onChange={(v) => {
                                    setValue(
                                      `schedule.${index}.shift`,
                                      Number(v),
                                      {
                                        shouldValidate: true,
                                      }
                                    );
                                    setScheduleError("");
                                  }}
                                  required
                                />
                              </div>

                              <div className="flex-1">
                                <SelectField
                                  label="Loại"
                                  name={`schedule[${index}].type`}
                                  options={types}
                                  value={watch(`schedule.${index}.type`) || ""}
                                  onChange={(v) =>
                                    setValue(`schedule.${index}.type`, v, {
                                      shouldValidate: true,
                                    })
                                  }
                                  required
                                />
                                <div>
                                  <label className="block text-sm font-medium  text-gray-700 mb-1">
                                    Phòng học{" "}
                                    <span className="text-red-500">*</span>
                                  </label>
                                  <input
                                    type="text"
                                    className="w-full border border-gray-300 rounded-lg p-2.5 h-10 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                                    placeholder="VD: A0502"
                                    {...register(`schedule.${index}.room`, {
                                      required: "Vui lòng nhập phòng học",
                                    })}
                                  />
                                  {errors.schedule &&
                                    errors.schedule[index] &&
                                    errors.schedule[index].room && (
                                      <p className="text-red-500 text-sm mt-1">
                                        {errors.schedule[index].room.message}
                                      </p>
                                    )}
                                </div>
                              </div>
                              {fields.length > 1 && (
                                <button
                                  type="button"
                                  onClick={() => remove(index)}
                                  className=" rounded-lg transition flex text-gray-400 hover:text-red-500 h-fit w-fit"
                                  title="Xóa buổi học"
                                >
                                  <FaTrash />
                                </button>
                              )}
                            </div>
                          </div>
                        ))}
                        {scheduleError && (
                          <p className="text-red-500 text-sm mt-1 font-medium">
                            {scheduleError}
                          </p>
                        )}
                        <button
                          type="button"
                          onClick={() =>
                            append({ dayOfWeek: "", shift: "", type: "" })
                          }
                          className="w-full flex items-center justify-center gap-2 text-blue-600 text-md font-medium border-2 rounded-md px-2 py-2 border-blue-600 hover:bg-blue-600 hover:text-white transition"
                        >
                          <FaPlus /> Thêm buổi học
                        </button>
                      </div>

                      {errors.schedule && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.schedule.message}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Footer */}
                <div className="flex justify-end space-x-3 border-t pt-4 px-6 pb-5 bg-white">
                  <Button
                    type="button"
                    className="px-5 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition"
                    onClick={() => {
                      onClose();
                      reset();
                    }}
                  >
                    Hủy
                  </Button>
                  <Button
                    type="submit"
                    className={`px-5 py-2 text-white rounded-lg shadow ${
                      isEditing
                        ? "bg-yellow-500 hover:bg-yellow-600"
                        : "bg-blue-600 hover:bg-blue-700"
                    }`}
                  >
                    {isEditing ? "Cập nhật" : "Lưu lớp học"}
                  </Button>
                </div>
              </form>
            </Dialog.Panel>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition>
  );
}
