import { useEffect, useState } from "react";
import { classService } from "../../services/classService";
import { semesterService } from "../../services/semesterService";
import {
  FaClock,
  FaBookOpen,
  FaTasks,
  FaFilter,
  FaChevronDown,
} from "react-icons/fa";
import Button from "../../components/UI/Button";
import { formatSchedule } from "./../../utils/formatSchedule";
import SkeletonCard from "./../../components/SkeletonLoading/SkeletonCard";

export default function ManageAssignments() {
  const teacherId = sessionStorage.getItem("userId")?.replace(/"/g, "");
  const [teacherClasses, setTeacherClasses] = useState([]);
  const [semesters, setSemesters] = useState([]);
  const [selectedSemester, setSelectedSemester] = useState("all");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const [classes, sems] = await Promise.all([
          classService.getClassesByTeacher(teacherId),
          semesterService.getAllSemesters(),
        ]);
        setTeacherClasses(classes || []);
        setSemesters(sems || []);
      } catch (error) {
        console.error("Lỗi khi tải dữ liệu:", error);
      } finally {
        setIsLoading(false);
      }
    };
    if (teacherId) fetchData();
  }, [teacherId]);

  const filteredClasses =
    selectedSemester === "all"
      ? teacherClasses
      : teacherClasses.filter((cls) => cls.semester === selectedSemester);

  return (
    <div className="min-h-screen bg-gray-50/50 dark:bg-gray-900 p-6 md:p-10 font-sans text-slate-800 dark:text-gray-100">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-10 gap-6">
          <div>
            <h2 className="text-3xl md:text-4xl font-extrabold text-slate-800 dark:text-white tracking-tight">
              Quản lý Bài Tập
            </h2>
            <p className="text-slate-500 dark:text-gray-400 mt-2 text-base max-w-xl leading-relaxed">
              Theo dõi và chấm điểm các bài tập đã giao cho sinh viên.
            </p>
          </div>

          <div className="relative group min-w-[220px]">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaFilter className="text-blue-500 dark:text-blue-400" />
            </div>
            <select
              value={selectedSemester}
              onChange={(e) => setSelectedSemester(e.target.value)}
              className="appearance-none w-full pl-10 pr-10 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm font-medium shadow-sm hover:border-blue-400 dark:hover:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all cursor-pointer text-slate-700 dark:text-gray-200"
            >
              <option value="all">Tất cả học kỳ</option>
              {semesters.map((sem) => (
                <option key={sem._id} value={sem._id}>
                  {sem.name}
                </option>
              ))}
            </select>
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
              <FaChevronDown className="text-gray-400 dark:text-gray-500 text-xs" />
            </div>
          </div>
        </div>

        {isLoading ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {[1, 2, 3, 4].map((i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        ) : filteredClasses.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredClasses.map((cls, index) => {
              const semesterName =
                semesters.find((se) => se._id === cls?.semester)?.name || "N/A";
              const assignmentCount = cls.assignmentCount ?? 0;

              return (
                <div
                  key={cls._id || index}
                  className="group bg-white dark:bg-gray-800 rounded-2xl shadow-[0_2px_10px_-4px_rgba(0,0,0,0.1)] hover:shadow-[0_8px_30px_-4px_rgba(0,0,0,0.1)] dark:shadow-[0_2px_10px_-4px_rgba(0,0,0,0.3)] dark:hover:shadow-[0_8px_30px_-4px_rgba(0,0,0,0.4)] border border-gray-100 dark:border-gray-700 overflow-hidden flex flex-col transition-all duration-300 hover:-translate-y-1 relative h-full"
                >
                  <div className="p-6 flex flex-col flex-1">
                    <div className="flex justify-between items-start mb-4">
                      <div className="p-2.5 bg-blue-50 dark:bg-blue-900/30 rounded-lg text-blue-600 dark:text-blue-400">
                        <FaBookOpen size={18} />
                      </div>
                      <span className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 text-xs font-bold uppercase tracking-wider rounded-full">
                        {semesterName}
                      </span>
                    </div>

                    <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-3 line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors min-h-[3.5rem]">
                      {cls.name}
                    </h3>

                    <div className="flex items-center justify-between bg-slate-50 dark:bg-gray-700/50 rounded-xl p-3 mb-4 border border-slate-100 dark:border-gray-600">
                      <div className="flex items-center gap-2">
                        <div
                          className={`w-2 h-2 rounded-full ${
                            assignmentCount > 0
                              ? "bg-green-500 dark:bg-green-400"
                              : "bg-gray-300 dark:bg-gray-600"
                          }`}
                        ></div>
                        <span className="text-sm font-medium text-slate-600 dark:text-gray-300">
                          Bài tập
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5 text-slate-800 dark:text-white">
                        <FaTasks
                          className="text-blue-500/70 dark:text-blue-400/70"
                          size={14}
                        />
                        <span className="text-lg font-bold">
                          {assignmentCount}
                        </span>
                      </div>
                    </div>

                    <div className="mt-auto pt-4 border-t border-slate-50 dark:border-gray-700">
                      <div className="flex items-start gap-2 text-sm text-slate-500 dark:text-gray-400">
                        <FaClock
                          className="mt-1 text-indigo-400 dark:text-indigo-300 shrink-0"
                          size={14}
                        />
                        <div className="flex flex-wrap line-clamp-2">
                          {formatSchedule(cls.schedule)}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 bg-gray-50 dark:bg-gray-700/50 border-t border-gray-100 dark:border-gray-700 mt-auto">
                    <Button
                      to={`/teacher/class-details/${cls._id}/assignments`}
                      className="w-full py-2.5 bg-white dark:bg-gray-800 border border-blue-200 dark:border-blue-700 text-blue-600 dark:text-blue-400 hover:bg-blue-600 dark:hover:bg-blue-600 hover:text-white dark:hover:text-white rounded-xl font-medium transition-all duration-300 flex items-center justify-center gap-2 shadow-sm"
                    >
                      <span>Xem danh sách bài tập</span>
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-24 text-center bg-white dark:bg-gray-800 rounded-3xl border border-dashed border-gray-300 dark:border-gray-700">
            <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-full mb-4">
              <FaTasks className="text-4xl text-blue-300 dark:text-blue-400" />
            </div>
            <h3 className="text-xl font-bold text-slate-700 dark:text-gray-200 mb-2">
              Không tìm thấy lớp học
            </h3>
            <p className="text-gray-500 dark:text-gray-400 text-sm max-w-xs mx-auto mb-6">
              Bạn chưa có lớp nào trong học kỳ này hoặc chưa được phân công.
            </p>
            <button
              onClick={() => setSelectedSemester("all")}
              className="text-blue-600 dark:text-blue-400 font-medium hover:underline text-sm"
            >
              Quay lại danh sách tất cả
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
