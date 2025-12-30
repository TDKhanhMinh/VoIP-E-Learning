import { useEffect, useState } from "react";
import { attendanceService } from "../../services/attendanceService";
import formatDateTime from "../../utils/formatDateTime";
import AttendanceSkeleton from "./../../components/SkeletonLoading/AttendanceSkeleton";

export default function Attendance() {
  const [attendances, setAttendances] = useState([]);
  const [expandedClass, setExpandedClass] = useState(null);

  const [isLoading, setIsLoading] = useState(true);

  const userId = sessionStorage
    .getItem("userId")
    ?.split('"')
    .join("")
    .toString();

  useEffect(() => {
    const fetchAttendances = async () => {
      setIsLoading(true);
      try {
        const data = await attendanceService.getAttendanceByStudentId(userId);
        setAttendances(data);
      } catch (err) {
        console.error("Error loading attendance:", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchAttendances();
  }, [userId]);

  const groupedByClass = attendances.reduce((acc, record) => {
    const className = record.class?.name || "Không xác định";
    if (!acc[className]) acc[className] = [];
    acc[className].push(record);
    return acc;
  }, {});

  const toggleExpand = (className) => {
    setExpandedClass(expandedClass === className ? null : className);
  };

  return (
    <div className="mx-4">
      <h1 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white text-start mt-4">
        Xem điểm danh
      </h1>

      <div className="space-y-4">
        {isLoading ? (
          <>
            <AttendanceSkeleton />
            <AttendanceSkeleton />
            <AttendanceSkeleton />
            <AttendanceSkeleton />
          </>
        ) : Object.entries(groupedByClass).length > 0 ? (
          Object.entries(groupedByClass).map(([className, records]) => {
            const totalAbsent = records.filter(
              (r) => r.status === "absent"
            ).length;
            const totalPresent = records.filter(
              (r) => r.status === "present"
            ).length;
            const totalLate = records.filter((r) => r.status === "late").length;

            return (
              <div
                key={className}
                className="border border-gray-200 dark:border-gray-700 rounded-lg shadow hover:shadow-lg transition bg-white dark:bg-gray-800"
              >
                <div
                  className="flex justify-between items-center p-4 cursor-pointer bg-gray-50 dark:bg-gray-700 hover:bg-indigo-50 dark:hover:bg-gray-600"
                  onClick={() => toggleExpand(className)}
                >
                  <div>
                    <h2 className="font-semibold text-gray-800 dark:text-white text-lg">
                      {className}
                    </h2>
                    <p className="text-gray-500 dark:text-gray-400 text-sm">
                      Tổng số buổi: {records.length} | Có mặt: {totalPresent} |
                      Muộn: {totalLate} | Vắng: {totalAbsent}
                    </p>
                  </div>
                  <div className="text-indigo-600 dark:text-indigo-400 font-medium">
                    {expandedClass === className
                      ? "▲ Thu gọn"
                      : "▼ Xem chi tiết"}
                  </div>
                </div>

                {expandedClass === className && (
                  <div className="overflow-x-auto">
                    <table className="w-full border-t border-gray-200 dark:border-gray-700 text-sm">
                      <thead className="bg-indigo-600 dark:bg-indigo-700 text-white">
                        <tr>
                          <th className="p-3 text-left">Buổi</th>
                          <th className="p-3 text-left">Trạng thái</th>
                          <th className="p-3 text-left">Thời gian</th>
                        </tr>
                      </thead>
                      <tbody>
                        {records.map((r, idx) => (
                          <tr
                            key={idx}
                            className="border-t dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700"
                          >
                            <td className="p-3 text-gray-700 dark:text-gray-300 font-medium">
                              Buổi {r.lesson}
                            </td>
                            <td
                              className={`p-3 font-semibold ${
                                r.status === "present"
                                  ? "text-green-600 dark:text-green-400"
                                  : r.status === "late"
                                  ? "text-yellow-600 dark:text-yellow-400"
                                  : "text-red-600 dark:text-red-400"
                              }`}
                            >
                              {r.status === "present"
                                ? "Có mặt"
                                : r.status === "late"
                                ? "Đi muộn"
                                : "Vắng mặt"}
                            </td>
                            <td className="p-3 text-gray-600 dark:text-gray-400">
                              {formatDateTime(r.attend_at)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            );
          })
        ) : (
          <div className="text-center text-gray-500 dark:text-gray-400 py-10">
            Không có dữ liệu điểm danh nào.
          </div>
        )}
      </div>
    </div>
  );
}
