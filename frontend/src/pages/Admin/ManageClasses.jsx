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

  // 1. Loading State
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
    setIsLoading(true); // Bắt đầu load
    try {
      // Tối ưu: Gọi song song 4 API
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
      setIsLoading(false); // Kết thúc load
    }
  };

  // Helper để refresh lại list class sau khi thêm/sửa (nhẹ hơn fetchAllData)
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
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center gap-4 mb-3">
          <div className="w-14 h-14 bg-blue-600 rounded-2xl flex items-center justify-center shadow-lg">
            <FaLayerGroup className="text-white text-2xl" />
          </div>
          <div>
            <h2 className="text-4xl font-bold text-blue-600 pb-4">
              Quản lý lớp học
            </h2>
          </div>
        </div>

        {isLoading ? (
          <StatsSkeleton />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-white rounded-lg shadow-md p-4 border-l-4 border-blue-500">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm font-medium">
                    Tổng số lớp
                  </p>
                  <p className="text-2xl font-bold text-gray-800">
                    {classes.length}
                  </p>
                </div>
                <div className="bg-blue-100 p-3 rounded-lg">
                  <FaBook className="text-blue-600 text-xl" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-4 border-l-4 border-green-500">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm font-medium">Môn học</p>
                  <p className="text-2xl font-bold text-gray-800">
                    {courses.length}
                  </p>
                </div>
                <div className="bg-green-100 p-3 rounded-lg">
                  <FaChalkboardTeacher className="text-green-600 text-xl" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-4 border-l-4 border-purple-500">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm font-medium">
                    Giảng viên
                  </p>
                  <p className="text-2xl font-bold text-gray-800">
                    {teachers.length}
                  </p>
                </div>
                <div className="bg-purple-100 p-3 rounded-lg">
                  <FaChalkboardTeacher className="text-purple-600 text-xl" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-4 border-l-4 border-orange-500">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm font-medium">Học kỳ</p>
                  <p className="text-2xl font-bold text-gray-800">
                    {semesters.length}
                  </p>
                </div>
                <div className="bg-orange-100 p-3 rounded-lg">
                  <FaCalendarAlt className="text-orange-600 text-xl" />
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="flex justify-between items-center p-6 border-b border-gray-200 bg-gray-100">
            <div>
              <h3 className="text-xl font-semibold text-gray-800">
                Danh sách lớp học
              </h3>
              <p className="text-sm text-gray-600 mt-1">
                Hiển thị {currentClasses.length} trên tổng số {classes.length}{" "}
                lớp
              </p>
            </div>
            <button
              className="flex items-center justify-center gap-2 px-5 py-2.5 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg hover:from-green-600 hover:to-green-700 shadow-md hover:shadow-lg transition-all duration-200 font-medium"
              onClick={() => setOpen(true)}
            >
              <FaPlus className="text-sm" />
              Thêm lớp mới
            </button>
          </div>

          {isLoading ? (
            <TableSkeleton />
          ) : (
            <div className="overflow-x-auto rounded-lg shadow border border-gray-200">
              <table className="w-full table-fixed min-w-[900px] md:min-w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="w-[20%] px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Tên lớp
                    </th>
                    <th className="w-[15%] px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Môn học
                    </th>
                    <th className="w-[15%] px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Giảng viên
                    </th>
                    <th className="w-[10%] px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Học kỳ
                    </th>
                    <th className="w-[20%] px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Lịch học
                    </th>
                    <th className="w-[20%] px-4 py-3 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Hành động
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {classes.length > 0 ? (
                    currentClasses.map((c, index) => (
                      <tr
                        key={c.id || index}
                        className="hover:bg-gray-50 transition-colors duration-150"
                      >
                        <td className="px-4 py-3 align-top">
                          <div className="flex items-start">
                            <div className="flex-shrink-0 h-9 w-9 bg-blue-100 rounded-lg flex items-center justify-center mt-1">
                              <FaBook className="text-blue-600 text-sm" />
                            </div>
                            <div className="ml-3">
                              <div
                                className="text-sm font-medium text-gray-900 break-words line-clamp-2"
                                title={c.name}
                              >
                                {c.name}
                              </div>
                            </div>
                          </div>
                        </td>

                        <td className="px-4 py-3 align-top">
                          <span className="inline-block px-2 py-1 rounded-md text-xs font-medium bg-blue-50 text-blue-700 break-words w-full text-center border border-blue-100">
                            {courses.find((co) => co._id == c.course)?.title}
                          </span>
                        </td>

                        <td className="px-4 py-3 align-top">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-6 w-6 bg-purple-100 rounded-full flex items-center justify-center">
                              <FaChalkboardTeacher className="text-purple-600 text-xs" />
                            </div>
                            <div className="ml-2">
                              <div className="text-sm text-gray-900 break-words">
                                {
                                  teachers.find((t) => t._id == c.teacher)
                                    ?.full_name
                                }
                              </div>
                            </div>
                          </div>
                        </td>

                        <td className="px-4 py-3 align-top">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            {semesters.find((se) => se._id == c.semester)?.name}
                          </span>
                        </td>

                        <td className="px-4 py-3 align-top">
                          <div className="flex flex-wrap gap-1.5">
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
                                    className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-pink-50 text-pink-700 border border-pink-100 whitespace-nowrap"
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
                              <span className="text-xs text-gray-400 italic">
                                Chưa có lịch
                              </span>
                            )}
                          </div>
                        </td>

                        <td className="px-2 py-3 align-middle text-center">
                          <div className="flex flex-col sm:flex-row items-center justify-center gap-2">
                            <Button
                              onClick={() => {
                                setOpen(true);
                                setSelectedClass(c);
                              }}
                              className="p-1.5 bg-yellow-500 text-white rounded hover:bg-yellow-600 transition-colors"
                              title="Chỉnh sửa"
                            >
                              <FaEdit className="text-xs" />
                            </Button>
                            <Button
                              to={`/admin/classes/class-details/${c._id}`}
                              className="p-1.5 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                              title="Chi tiết"
                            >
                              <FaInfo className="text-xs" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan={6}
                        className="px-6 py-10 text-center text-gray-500"
                      >
                        <div className="flex flex-col items-center justify-center">
                          <FaBook className="text-gray-300 text-3xl mb-3" />
                          <p>Chưa có lớp học nào</p>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}

          {classes.length > itemsPerPage && (
            <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
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
