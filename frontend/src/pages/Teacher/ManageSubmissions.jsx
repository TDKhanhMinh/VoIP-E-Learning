import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { submissionService } from "../../services/submissionService";
import { assignmentService } from "../../services/assignmentService";
import formatDateTime from "../../utils/formatDateTime";
import GradeModal from "../../components/Modals/GradeModal";
import { toast } from "react-toastify";
import TableSkeleton from "./../../components/SkeletonLoading/TableSkeleton";
import StatsSkeleton from "./../../components/SkeletonLoading/StatsSkeleton";
import HeaderSkeleton from "./../../components/SkeletonLoading/HeaderSkeleton";
import {
  FaArrowLeft,
  FaFileAlt,
  FaDownload,
  FaCheckCircle,
  FaClock,
  FaEdit,
  FaUsers,
  FaChartBar,
  FaStar,
  FaExclamationCircle,
  FaCalendarAlt,
} from "react-icons/fa";

export default function ManageSubmissions() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [submissions, setSubmissions] = useState([]);
  const [assignment, setAssignment] = useState();
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState("all");

  const handleGrade = (submission) => {
    setSelected(submission);
    setIsOpen(true);
  };

  const handleSaveGrade = async (data) => {
    try {
      console.log("Dữ liệu chấm điểm:", data);
      await submissionService.updateSubmission(selected._id, data);
      fetchSubmission();
      toast.success("Chấm điểm thành công");
      setIsOpen(false);
    } catch (error) {
      toast.error(error?.response?.data?.message || "Lỗi khi chấm điểm");
    }
  };

  useEffect(() => {
    fetchSubmission();
  }, [id]);

  const fetchSubmission = async () => {
    setIsLoading(true);
    try {
      const [submissionsData, assignmentData] = await Promise.all([
        submissionService.getSubmissionByAssignmentId(id),
        assignmentService.getAssignmentsById(id),
      ]);

      setSubmissions(submissionsData);
      setAssignment(assignmentData);
    } catch (error) {
      console.error("Error fetching data:", error);
      toast.error("Không thể tải dữ liệu bài nộp");
    } finally {
      setIsLoading(false);
    }
  };

  const stats = {
    total: submissions.length,
    graded: submissions.filter((s) => s.graded).length,
    ungraded: submissions.filter((s) => !s.graded).length,
    averageScore:
      submissions.filter((s) => s.score != null).length > 0
        ? (
            submissions.reduce((acc, s) => acc + (s.score || 0), 0) /
            submissions.filter((s) => s.score != null).length
          ).toFixed(1)
        : "N/A",
  };

  const filteredSubmissions = submissions.filter((sub) => {
    if (filterStatus === "all") return true;
    if (filterStatus === "graded") return sub.graded;
    if (filterStatus === "ungraded") return !sub.graded;
    return true;
  });

  const getScoreColor = (score) => {
    if (score == null) return "gray";
    if (score >= 8) return "green";
    if (score >= 6.5) return "blue";
    if (score >= 5) return "yellow";
    return "red";
  };

  const isLateSubmission = (submittedAt, dueAt) => {
    return new Date(submittedAt) > new Date(dueAt);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 md:p-8">
        <div className="max-w-7xl mx-auto space-y-6">
          <HeaderSkeleton />
          <StatsSkeleton />
          <TableSkeleton />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="mb-6">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200 font-medium mb-4 transition-colors"
          >
            <FaArrowLeft /> Quay lại
          </button>
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 border border-gray-100 dark:border-gray-700">
            <div className="flex items-start gap-4">
              <div className="p-4 bg-blue-600 rounded-xl shadow-lg">
                <FaFileAlt className="text-white text-3xl" />
              </div>
              <div className="flex-1">
                <h1 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-white mb-2">
                  {assignment?.title || "Đang tải..."}
                </h1>
                <div className="flex flex-wrap gap-4 text-sm text-gray-600 dark:text-gray-300">
                  <div className="flex items-center gap-2">
                    <FaCalendarAlt className="text-gray-400 dark:text-gray-500" />
                    <span>
                      Hạn nộp:{" "}
                      <strong>
                        {assignment?.due_at
                          ? formatDateTime(assignment.due_at)
                          : "—"}
                      </strong>
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <FaUsers className="text-gray-400 dark:text-gray-500" />
                    <span>
                      <strong>{submissions.length}</strong> bài nộp
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 border border-gray-100 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">
                  Tổng bài nộp
                </p>
                <p className="text-3xl font-bold text-gray-800 dark:text-white mt-2">
                  {stats.total}
                </p>
              </div>
              <div className="p-4 bg-blue-100 dark:bg-blue-900/30 rounded-xl">
                <FaFileAlt className="text-blue-600 dark:text-blue-400 text-3xl" />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 border border-gray-100 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">
                  Đã chấm điểm
                </p>
                <p className="text-3xl font-bold text-green-600 dark:text-green-400 mt-2">
                  {stats.graded}
                </p>
              </div>
              <div className="p-4 bg-green-100 dark:bg-green-900/30 rounded-xl">
                <FaCheckCircle className="text-green-600 dark:text-green-400 text-3xl" />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 border border-gray-100 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">
                  Chưa chấm
                </p>
                <p className="text-3xl font-bold text-orange-600 dark:text-orange-400 mt-2">
                  {stats.ungraded}
                </p>
              </div>
              <div className="p-4 bg-orange-100 dark:bg-orange-900/30 rounded-xl">
                <FaClock className="text-orange-600 dark:text-orange-400 text-3xl" />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 border border-gray-100 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">
                  Điểm TB
                </p>
                <p className="text-3xl font-bold text-purple-600 dark:text-purple-400 mt-2">
                  {stats.averageScore}
                </p>
              </div>
              <div className="p-4 bg-purple-100 dark:bg-purple-900/30 rounded-xl">
                <FaChartBar className="text-purple-600 dark:text-purple-400 text-3xl" />
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-4 border border-gray-100 dark:border-gray-700">
          <div className="flex gap-2 overflow-x-auto">
            <button
              onClick={() => setFilterStatus("all")}
              className={`px-5 py-2.5 rounded-xl font-medium transition-all whitespace-nowrap ${
                filterStatus === "all"
                  ? "bg-blue-600 text-white shadow-md"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
              }`}
            >
              Tất cả ({stats.total})
            </button>
            <button
              onClick={() => setFilterStatus("graded")}
              className={`px-5 py-2.5 rounded-xl font-medium transition-all whitespace-nowrap ${
                filterStatus === "graded"
                  ? "bg-green-600 text-white shadow-md"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
              }`}
            >
              Đã chấm ({stats.graded})
            </button>
            <button
              onClick={() => setFilterStatus("ungraded")}
              className={`px-5 py-2.5 rounded-xl font-medium transition-all whitespace-nowrap ${
                filterStatus === "ungraded"
                  ? "bg-orange-600 text-white shadow-md"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
              }`}
            >
              Chưa chấm ({stats.ungraded})
            </button>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 overflow-hidden">
          {filteredSubmissions.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 px-4">
              <div className="w-24 h-24 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mb-4">
                <FaFileAlt className="text-blue-600 dark:text-blue-400 text-4xl" />
              </div>
              <p className="text-gray-600 dark:text-gray-300 font-medium text-lg">
                Không có bài nộp nào
              </p>
              <p className="text-gray-400 dark:text-gray-500 text-sm mt-2">
                {filterStatus === "all"
                  ? "Chưa có sinh viên nào nộp bài"
                  : "Thử thay đổi bộ lọc để xem bài nộp khác"}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-100 dark:bg-gray-700 border-b-2 border-gray-200 dark:border-gray-600">
                  <tr>
                    {[
                      "Sinh viên",
                      "File bài nộp",
                      "Thời gian nộp",
                      "Điểm số",
                      "Thao tác",
                    ].map((header) => (
                      <th
                        key={header}
                        className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider"
                      >
                        {header}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                  {filteredSubmissions.map((s) => {
                    const scoreColor = getScoreColor(s.score);
                    const isLate = isLateSubmission(
                      s.createdAt,
                      assignment?.due_at
                    );

                    return (
                      <tr
                        key={s._id}
                        className="hover:bg-blue-50 dark:hover:bg-gray-700 transition-colors duration-150"
                      >
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-semibold">
                              {s.student?.full_name?.charAt(0)?.toUpperCase() ||
                                "?"}
                            </div>
                            <div>
                              <p className="font-semibold text-gray-800 dark:text-white">
                                {s.student?.full_name || "—"}
                              </p>
                              <p className="text-xs text-gray-500 dark:text-gray-400">
                                {s.student?.email || "—"}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <a
                            href={s.file_url}
                            download
                            className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-medium group"
                          >
                            <FaDownload className="group-hover:animate-bounce" />
                            <span className="underline">
                              {s.file_name?.split(".")[0] || "Tải xuống"}
                            </span>
                          </a>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <FaClock
                              className={
                                isLate
                                  ? "text-red-500 dark:text-red-400"
                                  : "text-gray-400 dark:text-gray-500"
                              }
                            />
                            <div>
                              <p
                                className={`text-sm ${
                                  isLate
                                    ? "text-red-600 dark:text-red-400 font-medium"
                                    : "text-gray-600 dark:text-gray-300"
                                }`}
                              >
                                {formatDateTime(s.createdAt)}
                              </p>
                              {isLate && (
                                <span className="inline-flex items-center gap-1 text-xs text-red-600 dark:text-red-400 mt-1">
                                  <FaExclamationCircle /> Nộp trễ
                                </span>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-center">
                          {s.score != null ? (
                            <div className="inline-flex items-center gap-2">
                              <span
                                className={`inline-flex items-center gap-1 px-4 py-2 rounded-xl text-lg font-bold bg-${scoreColor}-100 dark:bg-${scoreColor}-900/30 text-${scoreColor}-700 dark:text-${scoreColor}-400`}
                              >
                                <FaStar className="text-sm" />
                                {s.score}/10
                              </span>
                            </div>
                          ) : (
                            <span className="inline-flex items-center gap-2 px-3 py-1.5 bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 rounded-xl text-sm font-medium">
                              <FaClock className="text-xs" />
                              Chưa chấm
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4 text-center">
                          <button
                            onClick={() => handleGrade(s)}
                            className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl font-medium shadow-md hover:shadow-lg transition-all duration-200 transform hover:-translate-y-0.5 ${
                              s.graded
                                ? "bg-blue-600 hover:bg-blue-700 text-white"
                                : "bg-green-600 hover:bg-green-700 text-white"
                            }`}
                          >
                            {s.graded ? (
                              <>
                                <FaEdit /> Chỉnh sửa
                              </>
                            ) : (
                              <>
                                <FaCheckCircle /> Chấm điểm
                              </>
                            )}
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

      <GradeModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        onSave={handleSaveGrade}
        initialData={selected}
      />
    </div>
  );
}
