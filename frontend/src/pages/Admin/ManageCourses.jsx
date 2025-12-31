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
import CourseModal from "../../components/Modals/CourseModal";
import { courseService } from "../../services/courseService";
import { toast } from "react-toastify";
import Pagination from "../../components/UI/Pagination";
import StatsSkeleton from "./../../components/SkeletonLoading/StatsSkeleton";
import CourseSkeleton from "./../../components/SkeletonLoading/CourseSkeleton";

export default function ManageCourses() {
  const [open, setOpen] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [courses, setCourses] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);

  const [isLoading, setIsLoading] = useState(true);

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
    setIsLoading(true);
    try {
      const data = await courseService.getCourses();
      setCourses(data);
      setFilteredCourses(data);
    } catch (error) {
      console.error("Failed to fetch courses:", error);
      toast.error("Không thể tải danh sách khóa học");
    } finally {
      setIsLoading(false);
    }
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
      "bg-violet-600",
      "bg-indigo-600",
      "bg-cyan-600",
      "bg-sky-600",
      "bg-emerald-600",
    ];
    return colors[index % colors.length];
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900 p-6 transition-colors duration-300">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-3">
            <div className="w-14 h-14 bg-blue-600 dark:bg-blue-500 rounded-2xl flex items-center justify-center shadow-lg dark:shadow-blue-500/40">
              <FaBook className="text-white text-2xl" />
            </div>
            <div>
              <h2 className="text-4xl font-bold text-blue-600 dark:text-blue-400 pb-1">
                Quản lý Môn học
              </h2>
              <p className="text-gray-500 dark:text-gray-400 text-sm">
                Quản lý tất cả các khóa học và chương trình đào tạo
              </p>
            </div>
          </div>

          {isLoading ? (
            <StatsSkeleton />
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                <div className="bg-white dark:bg-slate-800 rounded-2xl p-5 shadow-lg dark:shadow-slate-800/50 border border-gray-100 dark:border-slate-600">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-indigo-100 dark:bg-indigo-500/20 rounded-xl flex items-center justify-center">
                      <FaLayerGroup className="text-indigo-600 dark:text-indigo-300 text-xl" />
                    </div>
                    <div>
                      <div className="text-sm text-gray-600 dark:text-gray-300">
                        Tổng số Môn học
                      </div>
                      <div className="text-3xl font-bold text-gray-800 dark:text-white">
                        {courses.length}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-blue-600 dark:bg-blue-500 rounded-2xl p-5 shadow-lg dark:shadow-blue-500/30 text-white">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-white/20 dark:bg-white/30 rounded-xl flex items-center justify-center">
                      <FaBook className="text-white text-xl" />
                    </div>
                    <div>
                      <div className="text-sm opacity-90 font-medium">
                        Môn học Đang Hoạt động
                      </div>
                      <div className="text-3xl font-bold">{courses.length}</div>
                    </div>
                  </div>
                </div>

                <div className="bg-sky-500 dark:bg-sky-500 rounded-2xl p-5 shadow-lg dark:shadow-sky-500/30 text-white">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-white/20 dark:bg-white/30 rounded-xl flex items-center justify-center">
                      <FaCode className="text-white text-xl" />
                    </div>
                    <div>
                      <div className="text-sm opacity-90 font-medium">
                        Mã Môn học
                      </div>
                      <div className="text-3xl font-bold">{courses.length}</div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg dark:shadow-slate-900/50 border border-gray-100 dark:border-slate-700 p-6 my-6">
                <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                  <div className="relative flex-1 max-w-md w-full">
                    <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-400" />
                    <input
                      type="text"
                      placeholder="Tìm kiếm theo mã môn học, tiêu đề hoặc mô tả..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-blue-500 dark:focus:border-blue-400 outline-none transition-all bg-gray-50 dark:bg-slate-700/50 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
                    />
                  </div>

                  <button
                    onClick={() => {
                      setSelectedCourse(null);
                      setOpen(true);
                    }}
                    className="flex items-center gap-2 bg-blue-600 dark:bg-blue-500 text-white px-6 py-3 rounded-xl hover:bg-blue-700 dark:hover:bg-blue-400 shadow-lg dark:shadow-blue-500/30 transition-all font-semibold hover:shadow-xl hover:-translate-y-0.5 whitespace-nowrap"
                  >
                    <FaPlus />
                    <span>Thêm môn học</span>
                  </button>
                </div>
              </div>
            </>
          )}
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
            {[...Array(6)].map((_, i) => (
              <CourseSkeleton key={i} />
            ))}
          </div>
        ) : currentCourses.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
            {currentCourses.map((course, index) => (
              <div
                key={course.id}
                className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg dark:shadow-slate-900/50 border border-gray-100 dark:border-slate-600 overflow-hidden hover:shadow-xl transition-all transform hover:-translate-y-1 group"
              >
                <div
                  className={`h-32 ${getCourseColor(
                    index
                  )} p-6 relative overflow-hidden`}
                >
                  <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 group-hover:scale-110 transition-transform duration-500"></div>
                  <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full -ml-12 -mb-12 group-hover:scale-110 transition-transform duration-500"></div>
                  <div className="relative z-10">
                    <div className="inline-flex items-center gap-2 bg-black/20 backdrop-blur-sm px-3 py-1.5 rounded-full mb-2 border border-white/10">
                      <FaCode className="text-white text-xs" />
                      <span className="text-white font-bold text-sm tracking-wide">
                        {course.code}
                      </span>
                    </div>
                    <h3 className="text-white font-bold text-xl line-clamp-2 drop-shadow-md">
                      {course.title}
                    </h3>
                  </div>
                </div>

                <div className="p-6">
                  <div className="mb-4">
                    <p className="text-gray-600 dark:text-gray-300 text-sm line-clamp-3 min-h-[60px] leading-relaxed">
                      {course.description || "Chưa có mô tả cho môn học này."}
                    </p>
                  </div>

                  <div className="flex gap-3 pt-4 border-t border-gray-100 dark:border-slate-700">
                    <button
                      onClick={() => {
                        setSelectedCourse(course);
                        setOpen(true);
                      }}
                      className="flex-1 flex items-center justify-center gap-2 bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-500/50 px-4 py-2.5 rounded-xl hover:bg-blue-600 hover:text-white dark:hover:bg-blue-500 dark:hover:text-white transition-all font-semibold"
                    >
                      <FaEdit />
                      <span>Chỉnh sửa</span>
                    </button>
                    <button className="flex-1 flex items-center justify-center gap-2 bg-gray-50 dark:bg-slate-700 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-slate-600 px-4 py-2.5 rounded-xl hover:bg-red-500 hover:text-white hover:border-red-500 dark:hover:bg-red-500 dark:hover:text-white transition-all font-semibold">
                      <FaTrash />
                      <span>Xóa</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg dark:shadow-slate-900/50 border border-gray-100 dark:border-slate-700 p-12">
            <div className="flex flex-col items-center gap-4">
              <div className="w-20 h-20 bg-gray-100 dark:bg-slate-700 rounded-full flex items-center justify-center">
                <FaBook className="text-gray-400 dark:text-gray-500 text-3xl" />
              </div>
              <p className="text-gray-500 dark:text-gray-400 font-medium text-lg">
                {searchQuery
                  ? "Không tìm thấy môn học phù hợp với tìm kiếm của bạn"
                  : "Không tìm thấy môn học nào. Hãy thêm môn học mới ngay bây giờ!"}
              </p>
              {!searchQuery && (
                <button
                  onClick={() => {
                    setSelectedCourse(null);
                    setOpen(true);
                  }}
                  className="flex items-center gap-2 bg-blue-600 dark:bg-blue-500 text-white px-6 py-3 rounded-xl hover:bg-blue-700 dark:hover:bg-blue-400 shadow-lg dark:shadow-blue-500/30 transition-all font-semibold"
                >
                  <FaPlus />
                  <span>Thêm Môn Học Đầu Tiên</span>
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
