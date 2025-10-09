import { useEffect, useState } from "react";
import { FaPlus, FaEdit, FaTrash, FaBook, FaChalkboardTeacher, FaCalendarAlt, FaClock, FaInfo, FaLayerGroup } from "react-icons/fa";
import Button from './../../components/Button';
import ClassModal from "../../components/ClassModal";
import { courseService } from './../../services/courseService';
import { userService } from './../../services/userService';
import { semesterService } from './../../services/semesterService';
import { toast } from "react-toastify";
import { classService } from "../../services/classService";
import Pagination from './../../components/Pagination';

export default function ManageClasses() {
  const [open, setOpen] = useState(false);
  const [selectedClass, setSelectedClass] = useState(null);
  const [classes, setClasses] = useState([]);
  const [courses, setCourses] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [semesters, setSemesters] = useState([]);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentClasses = classes.slice(startIndex, endIndex);
  const totalPages = Math.ceil(classes.length / itemsPerPage);

  useEffect(() => {
    fetchClasses();
    fetchCourses();
    fetchTeachers();
    fetchSemesters();
  }, []);

  const fetchClasses = async () => {
    console.log("Fetching classes ...", await classService.getAllClass());
    setClasses(await classService.getAllClass());
  }
  const fetchCourses = async () => {
    console.log("Fetching courses...", await courseService.getCourses());
    setCourses(await courseService.getCourses())
  }
  const fetchTeachers = async () => {
    const data = await userService.getAllUsers();
    const teachers = data.filter(u => u.role === 'teacher');
    console.log("Fetching Teacher ...", teachers);
    setTeachers(teachers);
  }
  const fetchSemesters = async () => {
    console.log("Fetching semester ...", await semesterService.getAllSemesters());
    setSemesters(await semesterService.getAllSemesters());
  };

  const handleAddClass = async (classData) => {
    try {
      console.log("Class data sending", classData);
      const data = await classService.createClass(classData);
      console.log("Class data added", data);
      fetchClasses();
      toast.success("Thêm lớp học thành công")
    } catch (error) {
      toast.error(error?.response?.data?.message || "Lỗi khi lớp học");
      console.log(error);
    }
  }
  const handleUpdateClass = async (classData) => {
    try {
      const { _id, ...payload } = classData;
      const data = await classService.updateClass(selectedClass._id, payload)
      console.log("Class data update", data);
      setSelectedClass(null)
      fetchClasses();
      toast.success("Cập nhật lớp học thành công")
    } catch (error) {
      toast.error(error?.response?.data?.message || "Lỗi khi thêm khóa học");
      console.log(error);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-6">
      <div className="max-w-7xl mx-auto">

        <div className="flex items-center gap-4 mb-3">
            <div className="w-14 h-14 bg-gradient-to-br from-indigo-600 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg">
              <FaLayerGroup className="text-white text-2xl" />
            </div>
            <div>
              <h2 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-blue-600 bg-clip-text text-transparent pb-4">
                Quản lý lớp học
              </h2>
            </div>
          </div>


        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-lg shadow-md p-4 border-l-4 border-blue-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm font-medium">Tổng số lớp</p>
                <p className="text-2xl font-bold text-gray-800">{classes.length}</p>
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
                <p className="text-2xl font-bold text-gray-800">{courses.length}</p>
              </div>
              <div className="bg-green-100 p-3 rounded-lg">
                <FaChalkboardTeacher className="text-green-600 text-xl" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-4 border-l-4 border-purple-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm font-medium">Giảng viên</p>
                <p className="text-2xl font-bold text-gray-800">{teachers.length}</p>
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
                <p className="text-2xl font-bold text-gray-800">{semesters.length}</p>
              </div>
              <div className="bg-orange-100 p-3 rounded-lg">
                <FaCalendarAlt className="text-orange-600 text-xl" />
              </div>
            </div>
          </div>
        </div>


        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="flex justify-between items-center p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-purple-50">
            <div>
              <h3 className="text-xl font-semibold text-gray-800">Danh sách lớp học</h3>
              <p className="text-sm text-gray-600 mt-1">Hiển thị {currentClasses.length} trên tổng số {classes.length} lớp</p>
            </div>
            <button
              className="flex items-center justify-center gap-2 px-5 py-2.5 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg hover:from-green-600 hover:to-green-700 shadow-md hover:shadow-lg transition-all duration-200 font-medium"
              onClick={() => setOpen(true)}
            >
              <FaPlus className="text-sm" />
              Thêm lớp mới
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Tên lớp</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Môn học</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Giảng viên</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Học kỳ</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Lịch học</th>
                  <th className="px-6 py-4 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider">Hành động</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {classes.length > 0 ? (
                  currentClasses.map((c, index) => (
                    <tr key={c.id || index} className="hover:bg-gray-50 transition-colors duration-150">
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10 bg-blue-100 rounded-lg flex items-center justify-center">
                            <FaBook className="text-blue-600" />
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{c.name}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                          {courses.find(co => co._id == c.course)?.title}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-8 w-8 bg-purple-100 rounded-full flex items-center justify-center">
                            <FaChalkboardTeacher className="text-purple-600 text-sm" />
                          </div>
                          <div className="ml-3">
                            <div className="text-sm text-gray-900">{teachers.find(t => t._id == c.teacher)?.full_name}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                          <FaCalendarAlt className="mr-2 text-xs" />
                          {semesters.find(se => se._id == c.semester)?.name}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center text-sm text-gray-700">
                          <FaClock className="mr-2 text-gray-400" />
                          {c.schedule}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <Button
                            onClick={() => {
                              setOpen(true);
                              setSelectedClass(c)
                            }}
                            className="inline-flex items-center justify-center p-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 shadow-sm hover:shadow-md transition-all duration-200"
                            title="Chỉnh sửa"
                          >
                            <FaEdit className="text-sm" />
                          </Button>
                          <Button
                            to={`/admin/classes/class-details/${c._id}`}
                            className="inline-flex items-center justify-center p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 shadow-sm hover:shadow-md transition-all duration-200"
                          >
                            <FaInfo className="text-sm" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center">
                      <div className="flex flex-col items-center justify-center">
                        <div className="bg-gray-100 rounded-full p-6 mb-4">
                          <FaBook className="text-gray-400 text-4xl" />
                        </div>
                        <p className="text-gray-500 font-medium">Chưa có lớp học nào</p>
                        <p className="text-gray-400 text-sm mt-1">Nhấn "Thêm lớp mới" để bắt đầu</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

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
        onClose={() => { setOpen(false); setSelectedClass(null); }}
        onSave={selectedClass ? handleUpdateClass : handleAddClass}
        courses={courses}
        teachers={teachers}
        semesters={semesters}
        initialData={selectedClass}
      />
    </div>
  );
}