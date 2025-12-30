import { useState, useEffect } from "react";
import {
  FaUserGraduate,
  FaTrash,
  FaPlus,
  FaChalkboardTeacher,
  FaBook,
  FaCalendarAlt,
  FaClock,
  FaUsers,
  FaArrowLeft,
  FaSearch,
  FaInfoCircle,
} from "react-icons/fa";
import { classService } from "../../services/classService";
import { userService } from "../../services/userService";
import { courseService } from "../../services/courseService";
import { semesterService } from "../../services/semesterService";
import { toast } from "react-toastify";
import { enrollmentService } from "../../services/enrollmentService";
import AddStudentsModal from "../../components/Modals/AddStudentModal";
import { useParams, useNavigate } from "react-router-dom";
import ConfirmDialog from "../../components/UI/ConfirmDialog";
import Pagination from "../../components/UI/Pagination";
import TableSkeleton from "./../../components/SkeletonLoading/TableSkeleton";
import HeaderSkeleton from "./../../components/SkeletonLoading/HeaderSkeleton";

export default function ClassDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [students, setStudents] = useState([]);
  const [allStudents, setAllStudents] = useState([]);
  const [course, setCourse] = useState("");
  const [teacher, setTeacher] = useState("");
  const [semester, setSemester] = useState("");
  const [classData, setClassData] = useState(null);

  const [isLoading, setIsLoading] = useState(true);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [openConfirmModal, setOpenConfirmModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const filteredStudents = students.filter(
    (s) =>
      s.student?.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.student?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.student_id?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentStudent = filteredStudents.slice(startIndex, endIndex);
  const totalPages = Math.ceil(filteredStudents.length / itemsPerPage);

  useEffect(() => {
    fetchClassDetails();
  }, [id]);

  const fetchClassDetails = async () => {
    setIsLoading(true);
    try {
      const classInfo = await classService.getClassById(id);
      setClassData(classInfo);

      const [
        teacherData,
        courseData,
        semesterData,
        allUsersData,
        enrollmentsData,
      ] = await Promise.all([
        userService.getUserById(classInfo.teacher),
        courseService.getCourseById(classInfo.course),
        semesterService.getSemesterById(classInfo.semester),
        userService.getAllUsers(),
        enrollmentService.getAllEnrollments(id),
      ]);

      setTeacher(teacherData);
      setCourse(courseData);
      setSemester(semesterData);
      setAllStudents(allUsersData.filter((u) => u.role === "student"));
      setStudents(enrollmentsData);
    } catch (error) {
      console.error("Error fetching class details:", error);
      toast.error("Không thể tải thông tin lớp học");
    } finally {
      setIsLoading(false);
    }
  };

  const handlerAddStudents = async (enrollmentData) => {
    try {
      const data = await enrollmentService.createEnrollment(enrollmentData);
      fetchClassDetails();
      toast.success("Thêm sinh viên vào lớp thành công");
      console.log("Student added", data);
    } catch (error) {
      toast.error(
        error?.response?.data?.message || "Lỗi khi thêm sinh viên vào lớp"
      );
      console.error("Error adding students to class:", error);
    }
  };

  const handleDeleteUser = async (enrollment) => {
    try {
      await enrollmentService.deleteEnrollment(enrollment._id);
      toast.success("Xóa sinh viên khỏi lớp thành công");
      fetchClassDetails();
    } catch (error) {
      toast.error(
        error?.response?.data?.message || "Lỗi khi xóa sinh viên khỏi lớp"
      );
      console.error("Error removing student from class:", error);
    }
  };

  // Skeleton components styled to match clean theme
  const InfoCardSkeleton = () => (
    <div className="lg:col-span-2 bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-gray-200 dark:border-slate-700 animate-pulse p-6">
      <div className="h-6 bg-gray-200 dark:bg-slate-700 w-1/3 mb-6"></div>
      <div className="space-y-4">
        <div className="h-16 bg-gray-100 dark:bg-slate-700 rounded w-full"></div>
        <div className="h-16 bg-gray-100 dark:bg-slate-700 rounded w-full"></div>
        <div className="grid grid-cols-2 gap-4">
          <div className="h-16 bg-gray-100 dark:bg-slate-700 rounded w-full"></div>
          <div className="h-16 bg-gray-100 dark:bg-slate-700 rounded w-full"></div>
        </div>
      </div>
    </div>
  );

  const StatsCardSkeleton = () => (
    <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-gray-200 dark:border-slate-700 p-6 animate-pulse">
      <div className="h-6 bg-gray-200 dark:bg-slate-700 w-1/2 mb-6"></div>
      <div className="space-y-4">
        <div className="h-20 bg-gray-100 dark:bg-slate-700 rounded w-full"></div>
        <div className="h-20 bg-gray-100 dark:bg-slate-700 rounded w-full"></div>
      </div>
    </div>
  );

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-slate-900 p-6">
        <div className="max-w-7xl mx-auto">
          <HeaderSkeleton />
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8 mt-6">
            <InfoCardSkeleton />
            <StatsCardSkeleton />
          </div>
          <TableSkeleton />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900 p-6 transition-colors duration-200">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 font-medium mb-4 transition-colors"
          >
            <FaArrowLeft /> Quay lại
          </button>

          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-blue-600 dark:bg-blue-700 rounded-lg flex items-center justify-center shadow-md">
              <FaUserGraduate className="text-white text-2xl" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100">
                Chi tiết lớp học
              </h1>
              <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
                Xem thông tin chi tiết và danh sách sinh viên
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="lg:col-span-2 bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-gray-200 dark:border-slate-700 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 dark:border-slate-700 flex items-center gap-2">
              <FaInfoCircle className="text-blue-600 dark:text-blue-400" />
              <h2 className="text-lg font-bold text-gray-800 dark:text-gray-100">
                Thông tin chung
              </h2>
            </div>

            <div className="p-6 space-y-4">
              {/* Môn học */}
              <div className="flex items-start gap-4 p-4 bg-gray-50 dark:bg-slate-700/30 rounded-lg border border-gray-100 dark:border-slate-700/50">
                <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                  <FaBook className="text-blue-600 dark:text-blue-400 text-xl" />
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">
                    Môn học
                  </p>
                  <p className="text-lg font-semibold text-gray-800 dark:text-gray-100">
                    {course.title || "—"}
                  </p>
                  {course.code && (
                    <span className="inline-block mt-1 text-xs font-mono bg-white dark:bg-slate-600 px-2 py-0.5 rounded border border-gray-200 dark:border-slate-500 text-gray-600 dark:text-gray-300">
                      {course.code}
                    </span>
                  )}
                </div>
              </div>

              {/* Giảng viên */}
              <div className="flex items-start gap-4 p-4 bg-gray-50 dark:bg-slate-700/30 rounded-lg border border-gray-100 dark:border-slate-700/50">
                <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-lg">
                  <FaChalkboardTeacher className="text-green-600 dark:text-green-400 text-xl" />
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">
                    Giảng viên
                  </p>
                  <p className="text-lg font-semibold text-gray-800 dark:text-gray-100">
                    {teacher?.full_name || "—"}
                  </p>
                  {teacher?.email && (
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                      {teacher.email}
                    </p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Học kỳ */}
                <div className="flex items-start gap-4 p-4 bg-gray-50 dark:bg-slate-700/30 rounded-lg border border-gray-100 dark:border-slate-700/50">
                  <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                    <FaCalendarAlt className="text-purple-600 dark:text-purple-400 text-xl" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">
                      Học kỳ
                    </p>
                    <p className="text-base font-semibold text-gray-800 dark:text-gray-100">
                      {semester?.name || "—"}
                    </p>
                  </div>
                </div>

                {/* Lịch học */}
                <div className="flex items-start gap-4 p-4 bg-gray-50 dark:bg-slate-700/30 rounded-lg border border-gray-100 dark:border-slate-700/50">
                  <div className="p-3 bg-orange-100 dark:bg-orange-900/30 rounded-lg">
                    <FaClock className="text-orange-600 dark:text-orange-400 text-xl" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">
                      Lịch học
                    </p>
                    <div className="text-base font-semibold text-gray-800 dark:text-gray-100">
                      {Array.isArray(classData.schedule) &&
                      classData.schedule.length > 0 ? (
                        <div className="flex flex-col gap-1">
                          {classData.schedule.map((s, idx) => {
                            const days = {
                              2: "Thứ 2",
                              3: "Thứ 3",
                              4: "Thứ 4",
                              5: "Thứ 5",
                              6: "Thứ 6",
                              7: "Thứ 7",
                            };
                            return (
                              <span key={idx} className="text-sm">
                                {days[s.dayOfWeek]} - Ca {s.shift} (P.{s.room})
                              </span>
                            );
                          })}
                        </div>
                      ) : (
                        "Chưa có lịch"
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Stats Card */}
          <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-gray-200 dark:border-slate-700 overflow-hidden flex flex-col">
            <div className="px-6 py-4 border-b border-gray-200 dark:border-slate-700 flex items-center justify-between">
              <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100 flex items-center gap-2">
                <FaUsers className="text-indigo-600 dark:text-indigo-400" />
                Thống kê
              </h3>
            </div>
            <div className="p-6 flex-1 flex flex-col gap-4">
              <div className="flex-1 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg p-5 flex flex-col justify-center items-center text-center border border-indigo-100 dark:border-indigo-800/50">
                <p className="text-sm text-indigo-600 dark:text-indigo-300 font-medium uppercase tracking-wide">
                  Tổng sinh viên
                </p>
                <p className="text-5xl font-bold text-indigo-700 dark:text-indigo-400 mt-2">
                  {students.length}
                </p>
              </div>
              <div className="flex-1 bg-teal-50 dark:bg-teal-900/20 rounded-lg p-5 flex flex-col justify-center items-center text-center border border-teal-100 dark:border-teal-800/50">
                <p className="text-sm text-teal-600 dark:text-teal-300 font-medium uppercase tracking-wide">
                  Số tín chỉ
                </p>
                <p className="text-4xl font-bold text-teal-700 dark:text-teal-400 mt-2">
                  {course.credit || 0}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Student List Section */}
        <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-gray-200 dark:border-slate-700 overflow-hidden">
          {/* Toolbar */}
          <div className="p-5 border-b border-gray-200 dark:border-slate-700 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gray-50 dark:bg-slate-800">
            <div className="relative flex-1 max-w-md">
              <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Tìm kiếm theo tên, MSSV, email..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full pl-10 pr-4 py-2 bg-white dark:bg-slate-700 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:focus:ring-blue-400 dark:focus:border-blue-400 outline-none transition-all text-sm text-gray-900 dark:text-white"
              />
            </div>

            <button
              onClick={() => setIsModalOpen(true)}
              className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-500 text-white px-4 py-2 rounded-lg font-medium shadow-sm transition-colors text-sm"
            >
              <FaPlus /> Thêm sinh viên
            </button>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            {filteredStudents.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
                <div className="w-16 h-16 bg-gray-100 dark:bg-slate-700 rounded-full flex items-center justify-center mb-4">
                  <FaUserGraduate className="text-gray-400 dark:text-gray-500 text-3xl" />
                </div>
                <p className="text-gray-600 dark:text-gray-300 font-medium">
                  {searchTerm
                    ? "Không tìm thấy kết quả phù hợp"
                    : "Lớp học chưa có sinh viên nào"}
                </p>
              </div>
            ) : (
              <table className="w-full">
                <thead className="bg-gray-50 dark:bg-slate-700/50 border-b border-gray-200 dark:border-slate-700">
                  <tr>
                    {["STT", "Họ và tên", "MSSV", "Email", "Thao tác"].map(
                      (header) => (
                        <th
                          key={header}
                          className="px-6 py-3 text-left text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                        >
                          {header}
                        </th>
                      )
                    )}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-slate-700">
                  {currentStudent.map((s, index) => (
                    <tr
                      key={s.id || index}
                      className="hover:bg-gray-50 dark:hover:bg-slate-700/50 transition-colors duration-150"
                    >
                      <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                        {startIndex + index + 1}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full flex items-center justify-center text-sm font-bold border border-blue-200 dark:border-blue-800">
                            {s.student?.full_name?.charAt(0)?.toUpperCase() ||
                              "?"}
                          </div>
                          <span className="font-medium text-gray-900 dark:text-gray-100">
                            {s.student?.full_name || "—"}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="font-mono text-xs font-medium bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-gray-300 px-2 py-1 rounded border border-gray-200 dark:border-slate-600">
                          {s.student?.email.split("@")[0] || "—"}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-300">
                        {s.student?.email || "—"}
                      </td>
                      <td className="px-6 py-4">
                        <button
                          onClick={() => {
                            setSelectedUser(s);
                            setOpenConfirmModal(true);
                          }}
                          className="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 dark:text-red-400 dark:hover:text-red-300 dark:hover:bg-red-900/20 rounded transition-colors"
                          title="Xóa khỏi lớp"
                        >
                          <FaTrash className="text-sm" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          {totalPages > 1 && (
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

      <AddStudentsModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        classId={id}
        studentsList={allStudents}
        onSubmit={handlerAddStudents}
      />

      <ConfirmDialog
        isOpen={openConfirmModal}
        title="Xác nhận xóa sinh viên"
        message={`Bạn có chắc chắn muốn xóa sinh viên ${selectedUser?.student?.full_name} khỏi lớp học này không?`}
        onCancel={() => setOpenConfirmModal(false)}
        onConfirm={() => {
          handleDeleteUser(selectedUser);
          setOpenConfirmModal(false);
        }}
        btnDelete="Xóa"
        btnCancel="Hủy"
      />
    </div>
  );
}
