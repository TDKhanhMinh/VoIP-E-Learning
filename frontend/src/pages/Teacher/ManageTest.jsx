import { useEffect, useState } from "react";
import { classService } from "../../services/classService";
import { semesterService } from "../../services/semesterService";
import { FaCalendarAlt, FaBookOpen, FaClock, FaTasks } from "react-icons/fa";
import Button from "../../components/UI/Button";

export default function ManageAssignments() {
  const teacherId = sessionStorage.getItem("userId")?.replace(/"/g, "");
  const [teacherClasses, setTeacherClasses] = useState([]);
  const [semesters, setSemesters] = useState([]);
  const [selectedSemester, setSelectedSemester] = useState("all");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [classes, sems] = await Promise.all([
          classService.getClassesByTeacher(teacherId),
          semesterService.getAllSemesters(),
        ]);
        setTeacherClasses(classes || []);
        setSemesters(sems || []);
      } catch (error) {
        console.error("Lỗi khi tải dữ liệu:", error);
      }
    };
    if (teacherId) fetchData();
  }, [teacherId]);

  const filteredClasses =
    selectedSemester === "all"
      ? teacherClasses
      : teacherClasses.filter((cls) => cls.semester === selectedSemester);

  return (
    <div className="p-8 min-h-screen bg-gray-50">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-4">
        <div>
          <h2 className="text-3xl font-bold text-blue-600">Quản lý bài thi</h2>
          <p className="text-gray-500 text-sm mt-1">
            Danh sách các lớp bạn đang giảng dạy và bài thi được tạo
          </p>
        </div>

        <div className="flex items-center gap-3">
          <FaCalendarAlt className="text-blue-600" />
          <select
            value={selectedSemester}
            onChange={(e) => setSelectedSemester(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-400 focus:border-blue-400 outline-none transition-all bg-white shadow-sm"
          >
            <option value="all">Tất cả học kỳ</option>
            {semesters.map((sem) => (
              <option key={sem._id} value={sem._id}>
                {sem.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {filteredClasses.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredClasses.map((cls, index) => {
            const semesterName =
              semesters.find((se) => se._id === cls?.semester)?.name ||
              "Không rõ";
            return (
              <div
                key={cls._id || index}
                className="bg-white border border-gray-200 rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 p-6 flex flex-col justify-between group"
              >
                <div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-2 group-hover:text-blue-600 transition-colors">
                    {cls.name}
                  </h3>
                  <div className="flex flex-col gap-2 text-sm text-gray-600">
                    <div className="flex items-center gap-2">
                      <FaCalendarAlt className="text-blue-500" />
                      <span>
                        Học kỳ:{" "}
                        <strong className="text-gray-800">
                          {semesterName}
                        </strong>
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <FaClock className="text-indigo-500" />
                      <span>
                        Lịch học:{" "}
                        <strong className="text-gray-800">
                          {Array.isArray(cls.schedule) &&
                          cls.schedule.length > 0
                            ? cls.schedule
                                .map((s) => {
                                  const days = {
                                    2: "Thứ 2",
                                    3: "Thứ 3",
                                    4: "Thứ 4",
                                    5: "Thứ 5",
                                    6: "Thứ 6",
                                    7: "Thứ 7",
                                  };
                                  return `${days[s.dayOfWeek] || "?"} - Ca ${
                                    s.shift
                                  }`;
                                })
                                .join("; ")
                            : "Chưa có lịch"}
                        </strong>
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <FaTasks className="text-green-500" />
                      <span>
                        Bài tập:{" "}
                        <strong className="text-gray-800">
                          {cls.assignmentCount ?? 0}
                        </strong>{" "}
                        bài
                      </span>
                    </div>
                  </div>
                </div>

                <Button
                  to={`/teacher/class-details/${cls._id}/tests`}
                  className="mt-6 w-full py-2.5 bg-blue-600 text-white rounded-xl font-medium shadow-md hover:shadow-lg hover:bg-blue-700 transition-all flex items-center justify-center gap-2"
                >
                  Mở bài thi
                </Button>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-20">
          <img
            src="https://cdn-icons-png.flaticon.com/512/4076/4076549.png"
            alt="No classes"
            className="w-40 h-40 mb-6 opacity-70"
          />
          <p className="text-gray-600 text-lg font-medium">
            Không tìm thấy lớp phù hợp.
          </p>
          <p className="text-gray-400 text-sm mt-1">
            Hãy chọn học kỳ khác hoặc liên hệ quản trị viên.
          </p>
        </div>
      )}
    </div>
  );
}
