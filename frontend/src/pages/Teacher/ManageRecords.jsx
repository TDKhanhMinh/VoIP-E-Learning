import { useEffect, useState } from "react";
import { classService } from "../../services/classService";
import { semesterService } from "../../services/semesterService";
import {
  FaCalendarAlt,
  FaClock,
  FaVideo,
  FaFilter,
  FaChevronDown,
  FaPlayCircle,
  FaYoutube,
} from "react-icons/fa";
import Button from "../../components/UI/Button";
import { formatSchedule } from './../../utils/formatSchedule';

export default function ManageRecords() {
  const teacherId = sessionStorage.getItem("userId")?.replace(/"/g, "");
  const [teacherClasses, setTeacherClasses] = useState([]);
  const [semesters, setSemesters] = useState([]);
  const [selectedSemester, setSelectedSemester] = useState("all");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchAllClasses = async () => {
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
    if (teacherId) fetchAllClasses();
  }, [teacherId]);

  const filteredClasses =
    selectedSemester === "all"
      ? teacherClasses
      : teacherClasses.filter((cls) => cls.semester === selectedSemester);

  

  return (
    <div className="min-h-screen bg-gray-50/50 p-6 md:p-10 font-sans text-slate-800">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-10 gap-6">
          <div>
            <h2 className="text-3xl md:text-4xl font-extrabold text-slate-800 tracking-tight">
              Tóm tắt Bài Giảng Online
            </h2>
            <p className="text-slate-500 mt-2 text-base max-w-xl leading-relaxed">
              Quản lý video ghi lại bài giảng và tài liệu tóm tắt cho các lớp
              học trực tuyến.
            </p>
          </div>

          <div className="relative group min-w-[220px]">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaFilter className="text-blue-500" />
            </div>
            <select
              value={selectedSemester}
              onChange={(e) => setSelectedSemester(e.target.value)}
              className="appearance-none w-full pl-10 pr-10 py-3 bg-white border border-gray-200 rounded-xl text-sm font-medium shadow-sm hover:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all cursor-pointer text-slate-700"
            >
              <option value="all">Tất cả học kỳ</option>
              {semesters.map((sem) => (
                <option key={sem._id} value={sem._id}>
                  {sem.name}
                </option>
              ))}
            </select>
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
              <FaChevronDown className="text-gray-400 text-xs" />
            </div>
          </div>
        </div>

        {isLoading ? (
          /* Skeleton Loader */
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 h-64 animate-pulse flex flex-col"
              >
                <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-1/3 mb-auto"></div>
                <div className="h-10 bg-gray-200 rounded-xl w-full"></div>
              </div>
            ))}
          </div>
        ) : filteredClasses.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredClasses.map((cls, index) => {
              const semesterName =
                semesters.find((se) => se._id === cls?.semester)?.name || "N/A";

              return (
                <div
                  key={cls._id || index}
                  className="group bg-white rounded-2xl shadow-[0_2px_10px_-4px_rgba(0,0,0,0.1)] hover:shadow-[0_8px_30px_-4px_rgba(0,0,0,0.1)] border border-gray-100 overflow-hidden flex flex-col transition-all duration-300 hover:-translate-y-1 relative"
                >
                  <div className="p-6 flex flex-col flex-1">
                    <div className="flex justify-between items-start mb-4">
                      <div className="p-2.5 bg-blue-50 rounded-lg text-blue-600">
                        <FaVideo size={18} />
                      </div>
                      <span className="px-3 py-1 bg-gray-100 text-gray-600 text-xs font-bold uppercase tracking-wider rounded-full">
                        {semesterName}
                      </span>
                    </div>

                    <h3 className="text-lg font-bold text-slate-800 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors h-[3.5rem]">
                      {cls.name}
                    </h3>
                    <div className="h-px bg-gray-100 w-full my-3"></div>

                    <div className="mt-auto">
                      <div className="flex items-start gap-2 text-sm text-slate-500">
                        <FaClock
                          className="mt-1 text-blue-400 shrink-0"
                          size={14}
                        />
                        <div className="flex flex-wrap">
                          {formatSchedule(cls.schedule)}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 bg-gray-50 border-t border-gray-100">
                    <Button
                      to={`/teacher/class-details/${cls._id}/recordings`}
                      className="w-full py-2.5 bg-white border border-blue-200 text-blue-600 hover:bg-blue-600 hover:text-white rounded-xl font-medium transition-all duration-300 flex items-center justify-center gap-2 shadow-sm"
                    >
                      <span>Xem kho bài giảng</span>
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          /* Empty State */
          <div className="flex flex-col items-center justify-center py-24 text-center bg-white rounded-3xl border border-dashed border-gray-300">
            <div className="bg-blue-50 p-6 rounded-full mb-4">
              <FaYoutube className="text-4xl text-blue-300" />
            </div>
            <h3 className="text-xl font-bold text-slate-700 mb-2">
              Chưa có dữ liệu bài giảng
            </h3>
            <p className="text-gray-500 text-sm max-w-xs mx-auto mb-6">
              Bạn chưa có lớp học trực tuyến nào cần quản lý trong học kỳ này.
            </p>
            <button
              onClick={() => setSelectedSemester("all")}
              className="text-blue-600 font-medium hover:underline text-sm"
            >
              Xem tất cả học kỳ
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
