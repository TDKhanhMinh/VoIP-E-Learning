import { Link, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { FaUserGraduate, FaTrash, FaPlus, FaChalkboardTeacher, FaBook, FaCalendarAlt, FaClock, FaUsers, FaArrowLeft, FaSearch } from "react-icons/fa";
import { classService } from "../../services/classService";
import { userService } from "../../services/userService";
import { courseService } from "../../services/courseService";
import { semesterService } from "../../services/semesterService";
import { toast } from "react-toastify";
import { enrollmentService } from "../../services/enrollmentService";
import AddStudentsModal from "../../components/AddStudentModal";
import { useNavigate } from "react-router-dom";
import ConfirmDialog from "../../components/ConfirmDialog";
import Pagination from "../../components/Pagination";
export default function TeacherClassDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [students, setStudents] = useState([]);
  const [course, setCourse] = useState("");
  const [teacher, setTeacher] = useState("");
  const [semester, setSemester] = useState("");
  const [classData, setClassData] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const filteredStudents = students.filter(s =>
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
      console.info("fetching class details:", classInfo);
      setTeacher(await userService.getUserById(classInfo.teacher));
      setCourse(await courseService.getCourseById(classInfo.course));
      setSemester(await semesterService.getSemesterById(classInfo.semester));
      console.log("Student of class:", await enrollmentService.getAllEnrollments(id));
      setStudents(await enrollmentService.getAllEnrollments(id));
      setClassData(classInfo);
    } catch (error) {
      console.error("Error fetching class details:", error);
      toast.error("Không thể tải thông tin lớp học");
    } finally {
      setIsLoading(false);
    }
  };



  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Đang tải dữ liệu...</p>
        </div>
      </div>
    );
  }


  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">

        <div className="mb-6">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-800 font-medium mb-4 transition-colors"
          >
            <FaArrowLeft /> Quay lại
          </button>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 flex items-center gap-3">
            <div className="p-3 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl shadow-lg">
              <FaUserGraduate className="text-white text-2xl" />
            </div>
            Chi tiết lớp học
          </h1>
        </div>


        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">

          <div className="lg:col-span-2 bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100">
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-4">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <FaBook /> Thông tin lớp học
              </h2>
            </div>
            <div className="p-6 space-y-4">
              <div className="flex items-start gap-4 p-4 bg-blue-50 rounded-xl">
                <div className="p-3 bg-blue-100 rounded-lg">
                  <FaBook className="text-blue-600 text-xl" />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-gray-500 font-medium">Môn học</p>
                  <p className="text-lg font-semibold text-gray-800 mt-1">
                    {course.title || "—"}
                  </p>
                  {course.code && (
                    <p className="text-sm text-gray-600 mt-1">Mã: {course.code}</p>
                  )}
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 bg-green-50 rounded-xl">
                <div className="p-3 bg-green-100 rounded-lg">
                  <FaChalkboardTeacher className="text-green-600 text-xl" />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-gray-500 font-medium">Giảng viên</p>
                  <p className="text-lg font-semibold text-gray-800 mt-1">
                    {teacher?.full_name || "—"}
                  </p>
                  {teacher?.email && (
                    <p className="text-sm text-gray-600 mt-1">{teacher.email}</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-start gap-4 p-4 bg-purple-50 rounded-xl">
                  <div className="p-3 bg-purple-100 rounded-lg">
                    <FaCalendarAlt className="text-purple-600 text-xl" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-500 font-medium">Học kỳ</p>
                    <p className="text-base font-semibold text-gray-800 mt-1">
                      {semester?.name || "—"}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-4 bg-orange-50 rounded-xl">
                  <div className="p-3 bg-orange-100 rounded-lg">
                    <FaClock className="text-orange-600 text-xl" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-500 font-medium">Lịch học</p>
                    <p className="text-base font-semibold text-gray-800 mt-1">
                      {classData?.schedule || "—"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>


          <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl shadow-lg p-6 text-white">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Thống kê lớp học</h3>
              <FaUsers className="text-3xl opacity-50" />
            </div>
            <div className="space-y-4">
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                <p className="text-sm opacity-90">Tổng số sinh viên</p>
                <p className="text-4xl font-bold mt-2">{students.length}</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                <p className="text-sm opacity-90">Tín chỉ</p>
                <p className="text-3xl font-bold mt-2">{course.credits || "—"}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="p-4 pb-6">
          <div className="grid grid-cols-3 gap-6">
            <Link
              to={`/teacher/class-details/${id}/assignments`}
              className="p-4 bg-white shadow rounded hover:bg-gray-100"
            >
              Quản lý Bài tập
            </Link>
            <Link
              to={`/teacher/class-details/${id}/attendance`}
              className="p-4 bg-white shadow rounded hover:bg-gray-100"
            >
              Quản lý Điểm danh
            </Link>
            <Link
              to={`/teacher/class-details/${id}/submissions`}
              className="p-4 bg-white shadow rounded hover:bg-gray-100"
            >
              Quản lý Bài nộp
            </Link>
          </div>
        </div>
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">

          <div className="bg-gradient-to-r from-gray-50 to-blue-50 px-6 py-4 border-b">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                  <FaUsers className="text-blue-600" />
                  Danh sách sinh viên
                </h3>
                <p className="text-sm text-gray-600 mt-1">
                  Có {filteredStudents.length} sinh viên{searchTerm && " phù hợp"}
                </p>
              </div>

            </div>
          </div>


          <div className="px-6 py-4 bg-gray-50 border-b">
            <div className="relative max-w-md">
              <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Tìm kiếm theo tên, MSSV, email..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full pl-11 pr-4 py-2.5 bg-white border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
              />
            </div>
          </div>


          <div className="overflow-x-auto">
            {filteredStudents.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 px-4">
                <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                  <FaUserGraduate className="text-gray-400 text-4xl" />
                </div>
                <p className="text-gray-600 font-medium text-lg">
                  {searchTerm ? "Không tìm thấy sinh viên" : "Chưa có sinh viên nào trong lớp"}
                </p>
                <p className="text-gray-400 text-sm mt-2">
                  {searchTerm ? "Thử tìm kiếm với từ khóa khác" : "Nhấn nút 'Thêm sinh viên' để bắt đầu"}
                </p>
              </div>
            ) : (
              <>
                <table className="w-full">
                  <thead className="bg-gray-50 border-b-2 border-gray-200">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        STT
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Họ và tên
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        MSSV
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Email
                      </th>

                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {currentStudent.map((s, index) => (
                      <tr
                        key={s.id || index}
                        className="hover:bg-blue-50 transition-colors duration-150"
                      >
                        <td className="px-6 py-4 text-sm text-gray-600">
                          {startIndex + index + 1}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-full flex items-center justify-center text-white font-semibold">
                              {s.student?.full_name?.charAt(0)?.toUpperCase() || "?"}
                            </div>
                            <span className="font-semibold text-gray-800">
                              {s.student?.full_name || "—"}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="font-mono text-sm text-gray-700 bg-gray-100 px-3 py-1 rounded-lg">
                            {s.student_id || "—"}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">
                          {s.student?.email || "—"}
                        </td>

                      </tr>
                    ))}
                  </tbody>
                </table>


                {totalPages > 1 && (
                  <div className="px-6 py-4 bg-gray-50 border-t">
                    <Pagination
                      currentPage={currentPage}
                      totalPages={totalPages}
                      onPageChange={setCurrentPage}
                    />
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>


    </div>
  );


}
