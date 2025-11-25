import { useEffect, useState } from "react";
import {
  FaPlus,
  FaEdit,
  FaTrash,
  FaBook,
  FaCode,
  FaSearch,
  FaLayerGroup,
} from "react-icons/fa";
import Button from "./../../components/Button";
import CourseModal from "../../components/CourseModal";
import { courseService } from "../../services/courseService";
import { toast } from "react-toastify";
import Pagination from "../../components/Pagination";

export default function ManageCourses() {
  const [open, setOpen] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [courses, setCourses] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);

  const itemsPerPage = 6;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentCourses = filteredCourses.slice(startIndex, endIndex);
  const totalPages = Math.ceil(filteredCourses.length / itemsPerPage);

  useEffect(() => {
    fetchCourses();
  }, []);

  useEffect(() => {
    filterCourses();
  }, [searchQuery, courses]);

  const fetchCourses = async () => {
    const data = await courseService.getCourses();
    setCourses(data);
    setFilteredCourses(data);
  };

  const filterCourses = () => {
    if (!searchQuery) {
      setFilteredCourses(courses);
    } else {
      const filtered = courses.filter(
        (course) =>
          course.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
          course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          course.description?.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredCourses(filtered);
    }
    setCurrentPage(1);
  };

  const handleAddCourse = async (courseData) => {
    try {
      const data = await courseService.createCourse(courseData);
      console.log("Course added:", data);
      toast.success("Thêm khóa học thành công");
      fetchCourses();
      setOpen(false);
    } catch (error) {
      toast.error(error?.response?.data?.message || "Lỗi khi thêm khóa học");
      console.error("Error add Course:", error);
    }
  };

  const handleUpdateCourse = async (courseData) => {
    try {
      const { _id, ...payload } = courseData;
      const data = await courseService.updateCourse(
        selectedCourse._id,
        payload
      );
      console.log("Course update:", data);
      toast.success("Cập nhật môn học thành công");
      setSelectedCourse(null);
      fetchCourses();
      setOpen(false);
    } catch (error) {
      toast.error(error?.response?.data?.message || "Lỗi khi cập nhật môn học");
      console.error("Error update Course:", error);
    }
  };

  const getCourseColor = (index) => {
    const colors = [
      "bg-blue-600",
      "bg-blue-500",
      "bg-indigo-600",
      "bg-cyan-600",
      "bg-sky-600",
      "bg-blue-700",
    ];
    return colors[index % colors.length];
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-3">
            <div className="w-14 h-14 bg-blue-600 rounded-2xl flex items-center justify-center shadow-lg">
              <FaBook className="text-white text-2xl" />
            </div>
            <div>
              <h2 className="text-4xl font-bold text-blue-600 pb-4">
                Quản lý Môn học
              </h2>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
            <div className="bg-white rounded-2xl p-5 shadow-lg border border-gray-100">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center">
                  <FaLayerGroup className="text-indigo-600 text-xl" />
                </div>
                <div>
                  <div className="text-sm text-gray-600">Total Courses</div>
                  <div className="text-3xl font-bold text-gray-800">
                    {courses.length}
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-blue-600 rounded-2xl p-5 shadow-lg text-white">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                  <FaBook className="text-white text-xl" />
                </div>
                <div>
                  <div className="text-sm opacity-90">Active Courses</div>
                  <div className="text-3xl font-bold">{courses.length}</div>
                </div>
              </div>
            </div>

            <div className="bg-blue-500 rounded-2xl p-5 shadow-lg text-white">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                  <FaCode className="text-white text-xl" />
                </div>
                <div>
                  <div className="text-sm opacity-90">Course Codes</div>
                  <div className="text-3xl font-bold">{courses.length}</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 mb-6">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="relative flex-1 max-w-md w-full">
              <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search by code, title, or description..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
              />
            </div>

            <button
              onClick={() => {
                setSelectedCourse(null);
                setOpen(true);
              }}
              className="flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700 shadow-lg transition-all font-semibold hover:shadow-xl hover:-translate-y-0.5 whitespace-nowrap"
            >
              <FaPlus />
              <span>Thêm môn học</span>
            </button>
          </div>
        </div>

        {currentCourses.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
            {currentCourses.map((course, index) => (
              <div
                key={course.id}
                className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-all transform hover:-translate-y-1"
              >
                <div
                  className={`h-32 ${getCourseColor(
                    index
                  )} p-6 relative overflow-hidden`}
                >
                  <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
                  <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full -ml-12 -mb-12"></div>
                  <div className="relative z-10">
                    <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-3 py-1.5 rounded-full mb-2">
                      <FaCode className="text-white text-xs" />
                      <span className="text-white font-bold text-sm">
                        {course.code}
                      </span>
                    </div>
                    <h3 className="text-white font-bold text-xl line-clamp-2">
                      {course.title}
                    </h3>
                  </div>
                </div>

                <div className="p-6">
                  <div className="mb-4">
                    <p className="text-gray-600 text-sm line-clamp-3 min-h-[60px]">
                      {course.description || "No description available"}
                    </p>
                  </div>

                  <div className="flex gap-2 pt-4 border-t border-gray-100">
                    <button
                      onClick={() => {
                        setSelectedCourse(course);
                        setOpen(true);
                      }}
                      className="flex-1 flex items-center justify-center gap-2 bg-blue-500 text-white px-4 py-2.5 rounded-xl hover:bg-blue-600 transition-all hover:shadow-lg font-semibold"
                    >
                      <FaEdit />
                      <span>Edit</span>
                    </button>
                    <button className="flex-1 flex items-center justify-center gap-2 bg-gray-500 text-white px-4 py-2.5 rounded-xl hover:bg-gray-600 transition-all hover:shadow-lg font-semibold">
                      <FaTrash />
                      <span>Delete</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-12">
            <div className="flex flex-col items-center gap-4">
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center">
                <FaBook className="text-gray-400 text-3xl" />
              </div>
              <p className="text-gray-500 font-medium text-lg">
                {searchQuery
                  ? "No courses found matching your search"
                  : "No courses found"}
              </p>
              {!searchQuery && (
                <button
                  onClick={() => {
                    setSelectedCourse(null);
                    setOpen(true);
                  }}
                  className="flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700 shadow-lg transition-all font-semibold"
                >
                  <FaPlus />
                  <span>Add Your First Course</span>
                </button>
              )}
            </div>
          </div>
        )}

        {filteredCourses.length > itemsPerPage && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        )}
      </div>

      <CourseModal
        isOpen={open}
        onClose={() => {
          setOpen(false);
          setSelectedCourse(null);
        }}
        onSave={selectedCourse ? handleUpdateCourse : handleAddCourse}
        initialData={selectedCourse}
      />
    </div>
  );
}
