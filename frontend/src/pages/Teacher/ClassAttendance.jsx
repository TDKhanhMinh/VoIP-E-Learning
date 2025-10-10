import { useEffect, useState } from "react";
import { FaArrowLeft, FaCalendarAlt, FaListUl } from "react-icons/fa";
import { useNavigate, useParams } from "react-router-dom";
import formatDate from "./../../utils/formatDate";
import { enrollmentService } from "./../../services/enrollmentService";
import { toast } from "react-toastify";
import { attendanceService } from "../../services/attendanceService";
import formatDateTime from './../../utils/formatDateTime';

export default function ClassAttendance() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [students, setStudents] = useState([]);
  const [showSaved, setShowSaved] = useState(false);
  const [savedAttendances, setSavedAttendances] = useState([]);
  const [filteredAttendances, setFilteredAttendances] = useState(null);

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const result = await enrollmentService.getAllEnrollments(id);
        const formatted = result.map((item) => ({
          ...item,
          status: item.status || "present",
        }));
        setStudents(formatted);
      } catch (error) {
        console.log("Fetching students error", error);
      }
    };
    fetchStudents();
  }, [id]);

  const handleStatusChange = (id, newStatus) => {
    setStudents((prev) =>
      prev.map((s) =>
        s.student._id === id ? { ...s, status: newStatus } : s
      )
    );
  };

  const handleSaveAttendance = async () => {
    try {
      const payload = {
        class: id,
        attendances: students.map((s) => ({
          student: s.student._id,
          status: s.status,
        })),
      };
      await attendanceService.createAttendance(payload);
      toast.success("Lưu điểm danh thành công");
    } catch (error) {
      toast.error(error?.response?.data?.message || "Lỗi khi lưu điểm danh");
      console.error("Error in attendance:", error);
    }
  };

  const handleViewSavedAttendance = async () => {
    try {
      const res = await attendanceService.getAttendanceByClassId(id);
      if (!res || res.length === 0) {
        toast.info("Chưa có dữ liệu điểm danh nào được lưu");
      } else {
        setSavedAttendances(res);
        setShowSaved(true);
      }
    } catch (error) {
      console.error("Lỗi khi lấy danh sách điểm danh:", error);
      toast.error("Không thể tải danh sách điểm danh");
    }
  };

  return (
    <div className="p-6 space-y-6">

      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-gray-600 hover:text-gray-800 font-medium transition-colors"
      >
        <FaArrowLeft /> Quay lại
      </button>


      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-semibold text-gray-800 flex items-center gap-2">
            Điểm danh sinh viên
          </h2>
          <p className="text-gray-500 flex items-center gap-2 mt-1">
            <FaCalendarAlt className="text-blue-600" />
            <span className="font-medium text-gray-800">
              {formatDate(new Date())}
            </span>
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleViewSavedAttendance}
            className="bg-gray-100 border border-gray-300 text-gray-700 px-4 py-2.5 rounded-lg hover:bg-gray-200 shadow-sm transition-all duration-200 flex items-center gap-2"
          >
            <FaListUl /> Xem điểm danh đã lưu
          </button>

          {
            savedAttendances.length == 0 &&
            <button
              onClick={handleSaveAttendance}
              className="bg-green-600 text-white px-5 py-2.5 rounded-lg hover:bg-green-700 shadow-md transition-all duration-200"
            >
              Lưu điểm danh
            </button>
          }
        </div>
      </div>


      {savedAttendances.length === 0 &&
        <div className="bg-white shadow-lg rounded-xl p-5 border border-gray-100 overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-gray-100 text-gray-700 uppercase text-sm">
              <tr>
                <th className="p-3 w-16">Email</th>
                <th className="p-3">Họ và tên</th>
                <th className="p-3 text-center w-32">Có mặt</th>
                <th className="p-3 text-center w-32">Trễ</th>
                <th className="p-3 text-center w-32">Vắng</th>
              </tr>
            </thead>
            <tbody>
              {students.map((s, index) => (
                <tr
                  key={s.student._id || index}
                  className="border-t hover:bg-gray-50 transition"
                >
                  <td className="p-3 text-gray-600">{s.student.email}</td>
                  <td className="p-3 font-medium text-gray-800">
                    {s.student.full_name}
                  </td>

                  <td className="p-3 text-center">
                    <input
                      type="radio"
                      name={`status-${s.student._id}`}
                      value="present"
                      checked={s.status === "present"}
                      onChange={() =>
                        handleStatusChange(s.student._id, "present")
                      }
                      className="accent-green-600 w-5 h-5 cursor-pointer"
                    />
                  </td>

                  <td className="p-3 text-center">
                    <input
                      type="radio"
                      name={`status-${s.student._id}`}
                      value="late"
                      checked={s.status === "late"}
                      onChange={() => handleStatusChange(s.student._id, "late")}
                      className="accent-yellow-500 w-5 h-5 cursor-pointer"
                    />
                  </td>

                  <td className="p-3 text-center">
                    <input
                      type="radio"
                      name={`status-${s.student._id}`}
                      value="absent"
                      checked={s.status === "absent"}
                      onChange={() =>
                        handleStatusChange(s.student._id, "absent")
                      }
                      className="accent-red-500 w-5 h-5 cursor-pointer"
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>}


      {showSaved && (
        <div className="bg-white shadow-xl rounded-xl p-6 border border-gray-200 mt-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
              <FaListUl className="text-blue-600" /> Danh sách điểm danh đã lưu
            </h3>
            <button
              onClick={() => {
                setShowSaved(false);
                setSavedAttendances([]);
              }}
              className="text-red-500 text-sm hover:underline"
            >
              Đóng
            </button>
          </div>

          <div className="flex items-center gap-3 mb-4">
            <label htmlFor="lessonFilter" className="text-gray-700 font-medium">
              Lọc theo buổi:
            </label>
            <select
              id="lessonFilter"
              onChange={(e) => {
                const value = e.target.value;
                if (value === "all") {
                  setFilteredAttendances(savedAttendances);
                } else {
                  setFilteredAttendances(
                    savedAttendances.filter((a) => a.lesson === Number(value))
                  );
                }
              }}
              className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            >
              <option value="all">Tất cả</option>
              {[...new Set(savedAttendances.map((a) => a.lesson))].map((lesson) => (
                <option key={lesson} value={lesson}>
                  Buổi {lesson}
                </option>
              ))}
            </select>
          </div>

          <table className="w-full text-left border-collapse">
            <thead className="bg-gray-100 text-gray-700 uppercase text-sm">
              <tr>
                <th className="p-3">Buổi</th>
                <th className="p-3">Sinh viên</th>
                <th className="p-3">Trạng thái</th>
                <th className="p-3">Thời gian</th>
              </tr>
            </thead>
            <tbody>
              {(filteredAttendances || savedAttendances).map((a, idx) => (
                <tr key={idx} className="border-t hover:bg-gray-50">
                  <td className="p-3 text-gray-700">Buổi {a.lesson}</td>
                  <td className="p-3">{a.student?.full_name}</td>
                  <td
                    className={`p-3 font-medium ${a.status === "present"
                      ? "text-green-600"
                      : a.status === "late"
                        ? "text-yellow-600"
                        : "text-red-600"
                      }`}
                  >
                    {a.status === "present"
                      ? "Có mặt"
                      : a.status === "late"
                        ? "Trễ"
                        : "Vắng"}
                  </td>
                  <td className="p-3 text-gray-500">
                    {a.attend_at ? formatDateTime(new Date(a.attend_at)) : "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
