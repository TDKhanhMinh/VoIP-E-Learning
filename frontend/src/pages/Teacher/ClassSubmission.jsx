import { useEffect, useState } from "react";
import {
  FaArrowLeft,
  FaFileAlt,
  FaClock,
  FaCheckCircle,
  FaExclamationCircle,
  FaEye,
  FaUsers,
  FaChartPie,
  FaBookOpen,
} from "react-icons/fa";
import { useNavigate, useParams } from "react-router-dom";
import { submissionService } from "../../services/submissionService";
import { assignmentService } from "../../services/assignmentService";
import formatDateTime from "../../utils/formatDateTime";
import { enrollmentService } from "./../../services/enrollmentService";
import HeaderSkeleton from "./../../components/SkeletonLoading/HeaderSkeleton";
import TableSkeleton from "./../../components/SkeletonLoading/TableSkeleton";
import StatsSkeleton from "./../../components/SkeletonLoading/StatsSkeleton";

export default function ClassSubmission() {
  const [submissions, setSubmissions] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [classStudents, setClassStudents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState("all");
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    fetchSubmission();
  }, [id]);

  const fetchSubmission = async () => {
    setIsLoading(true);
    try {
      const [submissionsData, assignmentsData, studentsData] =
        await Promise.all([
          submissionService.getAllSubmissions(),
          assignmentService.getAllAssignmentsByClass(id),
          enrollmentService.getAllEnrollments(id),
        ]);

      setSubmissions(submissionsData);
      setAssignments(assignmentsData);
      setClassStudents(studentsData);

      console.log("Submissions", submissionsData);
      console.log("Class student", studentsData);
      console.log("Assignments", assignmentsData);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const getSubmissionStats = (assignment) => {
    const submitted = submissions.filter(
      (sub) => sub.assignment._id === assignment._id
    ).length;
    const total = classStudents?.length || 0;
    const percentage = total > 0 ? Math.round((submitted / total) * 100) : 0;
    const pending = total - submitted;

    return { submitted, total, percentage, pending };
  };

  const getSubmissionStatus = (assignment) => {
    const stats = getSubmissionStats(assignment);
    const isOverdue = new Date(assignment.due_at) < new Date();

    if (stats.percentage === 100) {
      return { color: "green", label: "Hoàn thành", icon: FaCheckCircle };
    } else if (isOverdue) {
      return { color: "red", label: "Quá hạn", icon: FaExclamationCircle };
    } else if (stats.percentage >= 50) {
      return { color: "yellow", label: "Đang nộp", icon: FaClock };
    } else {
      return { color: "orange", label: "Ít nộp", icon: FaExclamationCircle };
    }
  };

  const isOverdue = (dueDate) => {
    return new Date(dueDate) < new Date();
  };

  const filteredAssignments = assignments.filter((assignment) => {
    const stats = getSubmissionStats(assignment);
    const overdue = isOverdue(assignment.due_at);

    if (filterStatus === "all") return true;
    if (filterStatus === "completed") return stats.percentage === 100;
    if (filterStatus === "pending") return stats.percentage < 100 && !overdue;
    if (filterStatus === "overdue") return overdue && stats.percentage < 100;
    return true;
  });

  const overallStats = {
    totalAssignments: assignments.length,
    totalSubmissions: submissions.length,
    averageCompletion:
      assignments.length > 0
        ? Math.round(
            assignments.reduce(
              (acc, a) => acc + getSubmissionStats(a).percentage,
              0
            ) / assignments.length
          )
        : 0,
    overdueCount: assignments.filter(
      (a) => isOverdue(a.due_at) && getSubmissionStats(a).percentage < 100
    ).length,
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50 p-4 md:p-8">
        <div className="max-w-7xl mx-auto space-y-6">
          <HeaderSkeleton />
          <StatsSkeleton />
          <TableSkeleton />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="mb-6">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-800 font-medium mb-4 transition-colors"
          >
            <FaArrowLeft /> Quay lại
          </button>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-800 flex items-center gap-3">
                <div className="p-3 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl shadow-lg">
                  <FaFileAlt className="text-white text-2xl" />
                </div>
                Bài nộp của sinh viên
              </h1>
              <p className="text-gray-600 mt-2">
                Theo dõi tiến độ nộp bài của sinh viên
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm font-medium">
                  Tổng bài tập
                </p>
                <p className="text-3xl font-bold text-gray-800 mt-2">
                  {overallStats.totalAssignments}
                </p>
              </div>
              <div className="p-4 bg-blue-100 rounded-xl">
                <FaBookOpen className="text-blue-600 text-3xl" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm font-medium">Bài đã nộp</p>
                <p className="text-3xl font-bold text-green-600 mt-2">
                  {overallStats.totalSubmissions}
                </p>
              </div>
              <div className="p-4 bg-green-100 rounded-xl">
                <FaCheckCircle className="text-green-600 text-3xl" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm font-medium">
                  Tỷ lệ hoàn thành
                </p>
                <p className="text-3xl font-bold text-purple-600 mt-2">
                  {overallStats.averageCompletion}%
                </p>
              </div>
              <div className="p-4 bg-purple-100 rounded-xl">
                <FaChartPie className="text-purple-600 text-3xl" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm font-medium">Quá hạn</p>
                <p className="text-3xl font-bold text-red-600 mt-2">
                  {overallStats.overdueCount}
                </p>
              </div>
              <div className="p-4 bg-red-100 rounded-xl">
                <FaExclamationCircle className="text-red-600 text-3xl" />
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-4 border border-gray-100">
          <div className="flex gap-2 overflow-x-auto">
            <button
              onClick={() => setFilterStatus("all")}
              className={`px-5 py-2.5 rounded-xl font-medium transition-all whitespace-nowrap ${
                filterStatus === "all"
                  ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              Tất cả ({assignments.length})
            </button>
            <button
              onClick={() => setFilterStatus("completed")}
              className={`px-5 py-2.5 rounded-xl font-medium transition-all whitespace-nowrap ${
                filterStatus === "completed"
                  ? "bg-gradient-to-r from-green-600 to-emerald-600 text-white shadow-md"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              Hoàn thành
            </button>
            <button
              onClick={() => setFilterStatus("pending")}
              className={`px-5 py-2.5 rounded-xl font-medium transition-all whitespace-nowrap ${
                filterStatus === "pending"
                  ? "bg-gradient-to-r from-yellow-600 to-orange-600 text-white shadow-md"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              Đang nộp
            </button>
            <button
              onClick={() => setFilterStatus("overdue")}
              className={`px-5 py-2.5 rounded-xl font-medium transition-all whitespace-nowrap ${
                filterStatus === "overdue"
                  ? "bg-gradient-to-r from-red-600 to-rose-600 text-white shadow-md"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              Quá hạn
            </button>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
          {filteredAssignments.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 px-4">
              <div className="w-24 h-24 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-full flex items-center justify-center mb-4">
                <FaFileAlt className="text-blue-600 text-4xl" />
              </div>
              <p className="text-gray-600 font-medium text-lg">
                Không có bài tập nào
              </p>
              <p className="text-gray-400 text-sm mt-2">
                {filterStatus === "all"
                  ? "Chưa có bài tập nào trong lớp này"
                  : "Thử thay đổi bộ lọc để xem bài tập khác"}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gradient-to-r from-gray-50 to-blue-50 border-b-2 border-gray-200">
                  <tr>
                    {[
                      "Bài tập",
                      "Hạn nộp",
                      "Tình trạng nộp",
                      "Trạng thái",
                      "Thao tác",
                    ].map((header) => {
                      return (
                        <th
                          key={header}
                          className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
                        >
                          {header}
                        </th>
                      );
                    })}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredAssignments.map((assignment) => {
                    const stats = getSubmissionStats(assignment);
                    const status = getSubmissionStatus(assignment);
                    const StatusIcon = status.icon;
                    const overdueStatus = isOverdue(assignment.due_at);

                    return (
                      <tr
                        key={assignment._id}
                        className="hover:bg-blue-50 transition-colors duration-150"
                      >
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div
                              className={`p-3 rounded-xl ${
                                overdueStatus ? "bg-red-100" : "bg-blue-100"
                              }`}
                            >
                              <FaBookOpen
                                className={`${
                                  overdueStatus
                                    ? "text-red-600"
                                    : "text-blue-600"
                                } text-lg`}
                              />
                            </div>
                            <div>
                              <p className="font-semibold text-gray-800">
                                {assignment.title}
                              </p>
                              {overdueStatus && stats.percentage < 100 && (
                                <span className="inline-flex items-center gap-1 text-xs text-red-600 mt-1">
                                  <FaExclamationCircle /> Đã quá hạn
                                </span>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2 text-gray-600">
                            <FaClock
                              className={
                                overdueStatus ? "text-red-500" : "text-gray-400"
                              }
                            />
                            <span
                              className={
                                overdueStatus && stats.percentage < 100
                                  ? "text-red-600 font-medium"
                                  : ""
                              }
                            >
                              {formatDateTime(assignment.due_at)}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="space-y-2">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <FaUsers className="text-gray-400" />
                                <span className="text-sm font-semibold text-gray-700">
                                  {stats.submitted}/{stats.total}
                                </span>
                              </div>
                              <span
                                className={`text-sm font-bold text-${status.color}-600`}
                              >
                                {stats.percentage}%
                              </span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2.5">
                              <div
                                className={`bg-gradient-to-r from-${status.color}-500 to-${status.color}-600 h-2.5 rounded-full transition-all duration-300`}
                                style={{ width: `${stats.percentage}%` }}
                              ></div>
                            </div>
                            <p className="text-xs text-gray-500">
                              {stats.pending} sinh viên chưa nộp
                            </p>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <span
                            className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium bg-${status.color}-100 text-${status.color}-700`}
                          >
                            <StatusIcon className="text-xs" />
                            {status.label}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <button
                            onClick={() =>
                              navigate(`/teacher/submissions/${assignment._id}`)
                            }
                            className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl font-medium shadow-md hover:shadow-lg transition-all duration-200 transform hover:-translate-y-0.5"
                          >
                            <FaEye /> Xem chi tiết
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
