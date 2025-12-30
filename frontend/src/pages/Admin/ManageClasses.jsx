import { useEffect, useState } from "react";
import {
  FaPlus,
  FaEdit,
  FaBook,
  FaChalkboardTeacher,
  FaCalendarAlt,
  FaInfo,
  FaLayerGroup,
} from "react-icons/fa";
import Button from "./../../components/UI/Button";
import ClassModal from "../../components/Modals/ClassModal";
import { courseService } from "./../../services/courseService";
import { userService } from "./../../services/userService";
import { semesterService } from "./../../services/semesterService";
import { toast } from "react-toastify";
import { classService } from "../../services/classService";
import Pagination from "./../../components/UI/Pagination";
import StatsSkeleton from "./../../components/SkeletonLoading/StatsSkeleton";
import TableSkeleton from "./../../components/SkeletonLoading/TableSkeleton";

export default function ManageClasses() {
  const [open, setOpen] = useState(false);
  const [selectedClass, setSelectedClass] = useState(null);
  const [classes, setClasses] = useState([]);
  const [courses, setCourses] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [semesters, setSemesters] = useState([]);

  const [isLoading, setIsLoading] = useState(true);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentClasses = classes.slice(startIndex, endIndex);
  const totalPages = Math.ceil(classes.length / itemsPerPage);

  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    setIsLoading(true);
    try {
      const [classData, courseData, userData, semesterData] = await Promise.all(
        [
          classService.getAllClass(),
          courseService.getCourses(),
          userService.getAllUsers(),
          semesterService.getAllSemesters(),
        ]
      );

      setClasses(classData);
      setCourses(courseData);

      const teacherList = userData.filter((u) => u.role === "teacher");
      setTeachers(teacherList);

      setSemesters(semesterData);
    } catch (error) {
      console.error("Error fetching data:", error);
      toast.error("Lỗi khi tải dữ liệu");
    } finally {
      setIsLoading(false);
    }
  };

  const refreshClasses = async () => {
    try {
      const data = await classService.getAllClass();
      setClasses(data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleAddClass = async (classData) => {
    try {
      console.log("Class data sending", classData);
      await classService.createClass(classData);
      refreshClasses();
      toast.success("Thêm lớp học thành công");
      setOpen(false);
    } catch (error) {
      toast.error(error?.response?.data?.message || "Lỗi khi thêm lớp học");
      console.log(error);
    }
  };

  const handleUpdateClass = async (classData) => {
    try {
      const { _id, ...payload } = classData;

      if (!payload.hasMidTerm) {
        payload.midTerm = undefined;
        delete payload.midTerm;
      }

      await classService.updateClass(selectedClass._id, payload);
      toast.success("Cập nhật lớp học thành công");
      setSelectedClass(null);
      refreshClasses();
      setOpen(false);
    } catch (error) {
      toast.error(error?.response?.data?.message || "Lỗi khi cập nhật lớp học");
      console.log(error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900 p-6 transition-colors duration-200">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-14 h-14 bg-blue-600 dark:bg-blue-700 rounded-lg flex items-center justify-center shadow-md">
            <FaLayerGroup className="text-white text-2xl" />
          </div>
          <div>
            <h2 className="text-4xl font-bold text-gray-800 dark:text-gray-100 pb-1">
              Quản lý lớp học
            </h2>
            <p className="text-gray-500 dark:text-gray-400 text-sm">
              Quản lý danh sách lớp học, thời khóa biểu và giảng viên
            </p>
          </div>
        </div>

        {isLoading ? (
          <StatsSkeleton />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-gray-200 dark:border-slate-700 p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">
                    Tổng số lớp
                  </p>
                  <p className="text-3xl font-bold text-gray-800 dark:text-gray-100">
                    {classes.length}
                  </p>
                </div>
                <div className="w-12 h-12 bg-blue-50 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                  <FaBook className="text-blue-600 dark:text-blue-400 text-xl" />
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-gray-200 dark:border-slate-700 p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">
                    Môn học
                  </p>
                  <p className="text-3xl font-bold text-gray-800 dark:text-gray-100">
                    {courses.length}
                  </p>
                </div>
                <div className="w-12 h-12 bg-green-50 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
                  <FaChalkboardTeacher className="text-green-600 dark:text-green-400 text-xl" />
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-gray-200 dark:border-slate-700 p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">
                    Giảng viên
                  </p>
                  <p className="text-3xl font-bold text-gray-800 dark:text-gray-100">
                    {teachers.length}
                  </p>
                </div>
                <div className="w-12 h-12 bg-purple-50 dark:bg-purple-900/30 rounded-lg flex items-center justify-center">
                  <FaChalkboardTeacher className="text-purple-600 dark:text-purple-400 text-xl" />
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-gray-200 dark:border-slate-700 p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">
                    Học kỳ
                  </p>
                  <p className="text-3xl font-bold text-gray-800 dark:text-gray-100">
                    {semesters.length}
                  </p>
                </div>
                <div className="w-12 h-12 bg-orange-50 dark:bg-orange-900/30 rounded-lg flex items-center justify-center">
                  <FaCalendarAlt className="text-orange-600 dark:text-orange-400 text-xl" />
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-gray-200 dark:border-slate-700 overflow-hidden">
          <div className="flex justify-between items-center p-6 border-b border-gray-200 dark:border-slate-700">
            <div>
              <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100">
                Danh sách lớp học
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                Hiển thị {currentClasses.length} trên tổng số {classes.length}{" "}
                lớp
              </p>
            </div>
            <button
              className="flex items-center justify-center gap-2 px-5 py-2.5 bg-green-600 hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-600 text-white rounded-lg transition-colors font-medium shadow-sm"
              onClick={() => setOpen(true)}
            >
              <FaPlus className="text-sm" />
              Thêm lớp mới
            </button>
          </div>

          {isLoading ? (
            <TableSkeleton />
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full table-fixed min-w-[900px] md:min-w-full">
                <thead className="bg-gray-50 dark:bg-slate-700/50 border-b border-gray-200 dark:border-slate-700">
                  <tr>
                    {[
                      "Tên lớp",
                      "Môn học",
                      "Giảng viên",
                      "Học kỳ",
                      "Lịch học",
                      "Hành động",
                    ].map((header) => (
                      <th
                        key={header}
                        className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider"
                      >
                        {header}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-slate-700 bg-white dark:bg-slate-800">
                  {classes.length > 0 ? (
                    currentClasses.map((c, index) => (
                      <tr
                        key={c.id || index}
                        className="hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors duration-150"
                      >
                        <td className="px-6 py-4 align-top">
                          <div className="flex items-start">
                            <div className="flex-shrink-0 h-10 w-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center mt-1">
                              <FaBook className="text-blue-600 dark:text-blue-400 text-sm" />
                            </div>
                            <div className="ml-3">
                              <div
                                className="text-sm font-semibold text-gray-900 dark:text-gray-100 break-words line-clamp-2"
                                title={c.name}
                              >
                                {c.name}
                              </div>
                            </div>
                          </div>
                        </td>

                        <td className="px-6 py-4 align-top">
                          <span className="inline-block px-3 py-1 rounded text-xs font-medium bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 border border-blue-100 dark:border-blue-800 break-words w-full text-center">
                            {courses.find((co) => co._id == c.course)?.title}
                          </span>
                        </td>

                        <td className="px-6 py-4 align-top">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-8 w-8 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center">
                              <FaChalkboardTeacher className="text-purple-600 dark:text-purple-400 text-xs" />
                            </div>
                            <div className="ml-3">
                              <div className="text-sm font-medium text-gray-700 dark:text-gray-300 break-words">
                                {
                                  teachers.find((t) => t._id == c.teacher)
                                    ?.full_name
                                }
                              </div>
                            </div>
                          </div>
                        </td>

                        <td className="px-6 py-4 align-top">
                          <span className="inline-flex items-center px-2.5 py-1 rounded text-xs font-medium bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 border border-green-200 dark:border-green-800">
                            {semesters.find((se) => se._id == c.semester)?.name}
                          </span>
                        </td>

                        <td className="px-6 py-4 align-top">
                          <div className="flex flex-wrap gap-2">
                            {Array.isArray(c.schedule) &&
                            c.schedule.length > 0 ? (
                              c.schedule.map((s, i) => {
                                const days = {
                                  2: "Thứ 2",
                                  3: "Thứ 3",
                                  4: "Thứ 4",
                                  5: "Thứ 5",
                                  6: "Thứ 6",
                                  7: "Thứ 7",
                                };
                                return (
                                  <span
                                    key={i}
                                    className="inline-flex items-center px-2.5 py-1 rounded text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-600 whitespace-nowrap"
                                  >
                                    {`${days[s.dayOfWeek] || "?"} | Ca ${
                                      s.shift
                                    } (${
                                      s.type === "theory" ? "LT" : "TH"
                                    }) | P.${s.room}`}
                                  </span>
                                );
                              })
                            ) : (
                              <span className="text-xs text-gray-400 dark:text-gray-500 italic">
                                Chưa có lịch
                              </span>
                            )}
                          </div>
                        </td>

                        <td className="px-6 py-4 align-middle text-center">
                          <div className="flex flex-col sm:flex-row items-center justify-center gap-2">
                            <Button
                              onClick={() => {
                                setOpen(true);
                                setSelectedClass(c);
                              }}
                              className="p-2 bg-yellow-500 hover:bg-yellow-600 dark:bg-yellow-600 dark:hover:bg-yellow-500 text-white rounded transition-colors shadow-sm"
                              title="Chỉnh sửa"
                            >
                              <FaEdit className="text-sm" />
                            </Button>
                            <Button
                              to={`/admin/classes/class-details/${c._id}`}
                              className="p-2 bg-blue-500 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-500 text-white rounded transition-colors shadow-sm"
                              title="Chi tiết"
                            >
                              <FaInfo className="text-sm" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan={6}
                        className="px-6 py-12 text-center text-gray-500 dark:text-gray-400"
                      >
                        <div className="flex flex-col items-center justify-center">
                          <div className="w-16 h-16 bg-gray-100 dark:bg-slate-700 rounded-full flex items-center justify-center mb-4">
                            <FaBook className="text-gray-400 dark:text-gray-500 text-2xl" />
                          </div>
                          <p className="text-lg font-medium">
                            Chưa có lớp học nào
                          </p>
                          <p className="text-sm mt-1">
                            Hãy thêm lớp học mới để bắt đầu quản lý
                          </p>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}

          {classes.length > itemsPerPage && (
            <div className="px-6 py-4 border-t border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800">
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
              />
            </div>
          )}
        </div>
      </div>

      <ClassModal
        isOpen={open}
        onClose={() => {
          setOpen(false);
          setSelectedClass(null);
        }}
        onSave={selectedClass ? handleUpdateClass : handleAddClass}
        courses={courses}
        teachers={teachers}
        semesters={semesters}
        initialData={selectedClass}
      />
    </div>
  );
}
