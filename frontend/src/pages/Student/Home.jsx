import { useEffect, useState } from "react";
import { enrollmentService } from "../../services/enrollmentService";
import { useNavigate } from "react-router-dom";
import CourseSkeleton from "./../../components/SkeletonLoading/CourseSkeleton";
import { FaChalkboardTeacher, FaCalendarAlt } from "react-icons/fa";

function Home() {
  const [userClass, setUserClass] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    setIsLoading(true);
    try {
      const storedId = sessionStorage.getItem("userId");
      if (!storedId) return;

      const userId = storedId.replace(/"/g, "");

      const userEnrolledClasses =
        await enrollmentService.getAllEnrollmentsByStudentId(userId);
      setUserClass(userEnrolledClasses);
    } catch (error) {
      console.error("Failed to fetch enrollments:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const cardTheme = {
    bg: "bg-blue-600 dark:bg-blue-700",
    hover: "group-hover:border-blue-400 dark:group-hover:border-blue-500",
    textHover: "group-hover:text-blue-600 dark:group-hover:text-blue-700",
  };

  const handleNavigate = (classId) => {
    if (!classId) return;
    const cleanId = classId.toString().replace(/"/g, "");
    navigate(`/home/class-details/${cleanId}`);
  };

  return (
    <div className="p-6 bg-gray-50 dark:bg-slate-900 min-h-screen transition-colors duration-200">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100">
            Lớp học của tôi
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            Danh sách các lớp học phần bạn đang tham gia
          </p>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {Array(8)
              .fill(0)
              .map((_, index) => (
                <CourseSkeleton key={index} />
              ))}
          </div>
        ) : userClass.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {userClass.map((item, index) => {
              const classInfo = item.class;

              if (!classInfo) return null;

              return (
                <div
                  key={index}
                  onClick={() => handleNavigate(classInfo._id)}
                  className={`group w-full cursor-pointer bg-white dark:bg-slate-800 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-200 dark:border-slate-700 overflow-hidden flex flex-col h-full transform hover:-translate-y-1 ${cardTheme.hover}`}
                >
                  <div
                    className={`${cardTheme.bg} p-6 relative h-28 transition-colors`}
                  >
                    <h2 className="text-xl font-bold text-white truncate pr-4 relative z-10 group-hover:underline decoration-2 underline-offset-4">
                      {classInfo.name}
                    </h2>
                    <p className="text-blue-100 text-sm mt-1 font-medium relative z-10 truncate">
                      {classInfo.course?.code || "Mã lớp học phần"}
                    </p>

                    <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full -mr-10 -mt-10 pointer-events-none"></div>
                    <div className="absolute bottom-0 left-0 w-16 h-16 bg-white/10 rounded-full -ml-8 -mb-8 pointer-events-none"></div>
                  </div>

                  <div className="p-5 pt-12 flex-1 relative flex flex-col gap-3">
                    <div className="absolute -top-8 right-5 w-16 h-16 rounded-xl bg-white dark:bg-slate-800 p-1 shadow-md group-hover:scale-105 transition-transform border border-gray-100 dark:border-slate-700">
                      <img
                        src="/logo.jpg"
                        alt="Subject Logo"
                        className="w-full h-full object-cover rounded-lg"
                        onError={(e) => {
                          e.target.src =
                            "https://ui-avatars.com/api/?name=Course&background=0D8ABC&color=fff";
                        }}
                      />
                    </div>

                    <div className="flex items-center gap-3 text-gray-700 dark:text-gray-300">
                      <FaChalkboardTeacher className="text-blue-500 dark:text-blue-400 text-lg flex-shrink-0" />
                      <span className="text-sm font-medium truncate">
                        {classInfo.teacher?.full_name || "Chưa cập nhật GV"}
                      </span>
                    </div>

                    <div className="flex items-start gap-3 text-gray-600 dark:text-gray-400">
                      <FaCalendarAlt className="text-blue-500 dark:text-blue-400 text-lg flex-shrink-0 mt-0.5" />
                      <div className="text-sm flex flex-col gap-1">
                        {Array.isArray(classInfo.schedule) &&
                        classInfo.schedule.length > 0 ? (
                          classInfo.schedule.map((s, idx) => {
                            const days = {
                              2: "Thứ 2",
                              3: "Thứ 3",
                              4: "Thứ 4",
                              5: "Thứ 5",
                              6: "Thứ 6",
                              7: "Thứ 7",
                              8: "CN",
                            };
                            return (
                              <span key={idx} className="block">
                                {days[s.dayOfWeek] || "T?"} (Ca {s.shift}) - P.
                                {s.room}
                              </span>
                            );
                          })
                        ) : (
                          <span className="italic text-gray-400">
                            Chưa có lịch học
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="px-5 py-4 border-t border-gray-100 dark:border-slate-700/50 bg-gray-50 dark:bg-slate-800/50 flex justify-between items-center mt-auto group-hover:bg-blue-50 dark:group-hover:bg-blue-900/10 transition-colors">
                    <span className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      {classInfo.semester?.name || "Học kỳ"}
                    </span>
                    <span
                      className={`text-xs font-bold dark:text-blue-400 transition-transform flex items-center gap-1 group-hover:translate-x-1 ${cardTheme.textHover}`}
                    >
                      Vào lớp &rarr;
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 bg-white dark:bg-slate-800 rounded-3xl shadow-sm border border-gray-200 dark:border-slate-700 text-center">
            <div className="w-24 h-24 bg-blue-50 dark:bg-slate-700 rounded-full flex items-center justify-center mb-6">
              <FaChalkboardTeacher className="text-blue-300 dark:text-slate-500 text-5xl" />
            </div>
            <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2">
              Bạn chưa đăng ký lớp học nào
            </h3>
            <p className="text-gray-500 dark:text-gray-400 max-w-md mx-auto mb-6">
              Hiện tại bạn chưa tham gia lớp học phần nào. Hãy đăng ký môn học
              để bắt đầu.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default Home;
