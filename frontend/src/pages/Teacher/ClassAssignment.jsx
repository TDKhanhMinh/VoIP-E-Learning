import { useEffect, useState } from "react";
import { FaArrowLeft, FaBookOpen, FaPlus, FaEye, FaEdit, FaTrash, FaClock, FaCheckCircle, FaExclamationCircle, FaUsers } from "react-icons/fa";
import { useNavigate, useParams } from "react-router-dom";
import AssignmentModal from "../../components/AssignmentModal";
import { toast } from "react-toastify";
import { assignmentService } from "../../services/assignmentService";
import formatDateTime from './../../utils/formatDateTime';
import ConfirmDialog from "../../components/ConfirmDialog";

export default function ClassAssignment() {
  const [assignments, setAssignments] = useState([]);
  const navigate = useNavigate();
  const [open, setModalOpen] = useState(false);
  const { id } = useParams();
  const [selectedAssignment, setSelectedAssignment] = useState(null);
  const [openConfirmModal, setOpenConfirmModal] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState("all");

  useEffect(() => {
    fetchAssignments();
  }, [id]);

  const fetchAssignments = async () => {
    setIsLoading(true);
    try {
      const data = await assignmentService.getAllAssignmentsByClass(id);
      setAssignments(data);
    } catch (error) {
      console.log("Error fetching assignment", error);
      toast.error("Không thể tải danh sách bài tập");
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddAssignment = async (newAssignment) => {
    try {
      const data = await assignmentService.createAssignment(newAssignment);
      console.log("New Assignment data", data);
      setModalOpen(false);
      fetchAssignments();
      toast.success("Thêm bài tập thành công");
    } catch (error) {
      toast.error(error?.response?.data?.message || "Lỗi khi thêm bài tập");
      console.error("Error in assignment:", error);
    }
  };

  const handleUpdateAssignment = async (newAssignment) => {
    try {
      const data = await assignmentService.updateAssignment(selectedAssignment._id, newAssignment);
      console.log("update Assignment data", data);
      setModalOpen(false);
      fetchAssignments();
      toast.success("Cập nhật bài tập thành công");
    } catch (error) {
      toast.error(error?.response?.data?.message || "Lỗi khi cập nhật bài tập");
      console.error("Error in assignment:", error);
    }
  };

  const handleDeleteAssignment = async () => {
    try {
      const data = await assignmentService.deleteAssignment(selectedAssignment._id);
      console.log("delete Assignment data", data);
      setModalOpen(false);
      fetchAssignments();
      toast.success("Xóa bài tập thành công");
    } catch (error) {
      toast.error(error?.response?.data?.message || "Lỗi khi xóa bài tập");
      console.error("Error in assignment:", error);
    }
  };

  const getSubmissionStatus = (assignment) => {
    const submissionRate = (assignment.submissions / assignment.total) * 100;
    if (submissionRate >= 80) return { color: "green", label: "Tốt", icon: FaCheckCircle };
    if (submissionRate >= 50) return { color: "yellow", label: "Trung bình", icon: FaClock };
    return { color: "red", label: "Thấp", icon: FaExclamationCircle };
  };

  const isOverdue = (dueDate) => {
    return new Date(dueDate) < new Date();
  };

  const filteredAssignments = assignments.filter(a => {
    if (filterStatus === "all") return true;
    if (filterStatus === "active") return !isOverdue(a.due_at);
    if (filterStatus === "overdue") return isOverdue(a.due_at);
    return true;
  });

  // Calculate statistics
  const stats = {
    total: assignments.length,
    active: assignments.filter(a => !isOverdue(a.due_at)).length,
    overdue: assignments.filter(a => isOverdue(a.due_at)).length,
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Đang tải dữ liệu...</p>
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
                  <FaBookOpen className="text-white text-2xl" />
                </div>
                Quản lý bài tập
              </h1>
            </div>
            <button
              onClick={() => {
                setSelectedAssignment(null);
                setModalOpen(true);
              }}
              className="flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-6 py-3 rounded-xl font-medium shadow-lg hover:shadow-xl transition-all duration-200 transform hover:-translate-y-0.5"
            >
              <FaPlus /> Tạo bài tập mới
            </button>
          </div>
        </div>

        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm font-medium">Tổng bài tập</p>
                <p className="text-3xl font-bold text-gray-800 mt-2">{stats.total}</p>
              </div>
              <div className="p-4 bg-blue-100 rounded-xl">
                <FaBookOpen className="text-blue-600 text-3xl" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm font-medium">Đang mở</p>
                <p className="text-3xl font-bold text-green-600 mt-2">{stats.active}</p>
              </div>
              <div className="p-4 bg-green-100 rounded-xl">
                <FaCheckCircle className="text-green-600 text-3xl" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm font-medium">Quá hạn</p>
                <p className="text-3xl font-bold text-red-600 mt-2">{stats.overdue}</p>
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
              className={`px-5 py-2.5 rounded-xl font-medium transition-all whitespace-nowrap ${filterStatus === "all"
                  ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
            >
              Tất cả ({stats.total})
            </button>
            <button
              onClick={() => setFilterStatus("active")}
              className={`px-5 py-2.5 rounded-xl font-medium transition-all whitespace-nowrap ${filterStatus === "active"
                  ? "bg-gradient-to-r from-green-600 to-emerald-600 text-white shadow-md"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
            >
              Đang mở ({stats.active})
            </button>
            <button
              onClick={() => setFilterStatus("overdue")}
              className={`px-5 py-2.5 rounded-xl font-medium transition-all whitespace-nowrap ${filterStatus === "overdue"
                  ? "bg-gradient-to-r from-red-600 to-rose-600 text-white shadow-md"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
            >
              Quá hạn ({stats.overdue})
            </button>
          </div>
        </div>

        
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
          {filteredAssignments.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 px-4">
              <div className="w-24 h-24 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-full flex items-center justify-center mb-4">
                <FaBookOpen className="text-blue-600 text-4xl" />
              </div>
              <p className="text-gray-600 font-medium text-lg">
                {filterStatus === "all" ? "Chưa có bài tập nào" : "Không có bài tập nào"}
              </p>
              <p className="text-gray-400 text-sm mt-2">
                {filterStatus === "all"
                  ? "Nhấn nút 'Tạo bài tập mới' để bắt đầu"
                  : "Thử thay đổi bộ lọc để xem bài tập khác"}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gradient-to-r from-gray-50 to-blue-50 border-b-2 border-gray-200">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Tên bài tập
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Hạn nộp
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Tình trạng nộp
                    </th>
                    <th className="px-6 py-4 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Thao tác
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredAssignments.map((a) => {
                    const status = getSubmissionStatus(a);
                    const StatusIcon = status.icon;
                    const overdueStatus = isOverdue(a.due_at);

                    return (
                      <tr key={a._id || a.id} className="hover:bg-blue-50 transition-colors duration-150">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className={`p-3 rounded-xl ${overdueStatus ? "bg-red-100" : "bg-blue-100"
                              }`}>
                              <FaBookOpen className={`${overdueStatus ? "text-red-600" : "text-blue-600"
                                } text-lg`} />
                            </div>
                            <div>
                              <p className="font-semibold text-gray-800">{a.title}</p>
                              {overdueStatus && (
                                <span className="inline-flex items-center gap-1 text-xs text-red-600 mt-1">
                                  <FaExclamationCircle /> Đã quá hạn
                                </span>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2 text-gray-600">
                            <FaClock className={overdueStatus ? "text-red-500" : "text-gray-400"} />
                            <span className={overdueStatus ? "text-red-600 font-medium" : ""}>
                              {formatDateTime(a.due_at)}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="flex-1">
                              <div className="flex items-center justify-between mb-1">
                                <span className="text-sm font-medium text-gray-700">
                                  {a.submissions}/{a.total}
                                </span>
                                <span className={`text-xs font-semibold text-${status.color}-600`}>
                                  {Math.round((a.submissions / a.total) * 100)}%
                                </span>
                              </div>
                              <div className="w-full bg-gray-200 rounded-full h-2">
                                <div
                                  className={`bg-gradient-to-r from-${status.color}-500 to-${status.color}-600 h-2 rounded-full transition-all duration-300`}
                                  style={{ width: `${(a.submissions / a.total) * 100}%` }}
                                ></div>
                              </div>
                            </div>
                            <StatusIcon className={`text-${status.color}-600 text-lg`} />
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center justify-center gap-2">
                            <button
                              onClick={() => navigate(`/teacher/assignments/${a._id || a.id}`)}
                              className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                              title="Xem chi tiết"
                            >
                              <FaEye className="text-lg" />
                            </button>
                            <button
                              onClick={() => {
                                setSelectedAssignment(a);
                                setModalOpen(true);
                              }}
                              className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-all"
                              title="Chỉnh sửa"
                            >
                              <FaEdit className="text-lg" />
                            </button>
                            <button
                              onClick={() => {
                                setSelectedAssignment(a);
                                setOpenConfirmModal(true);
                              }}
                              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-all"
                              title="Xóa"
                            >
                              <FaTrash className="text-lg" />
                            </button>
                          </div>
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

      
      <AssignmentModal
        isOpen={open}
        onClose={() => setModalOpen(false)}
        onSave={selectedAssignment ? handleUpdateAssignment : handleAddAssignment}
        classId={id}
        initialData={selectedAssignment}
      />
      <ConfirmDialog
        isOpen={openConfirmModal}
        title="Xác nhận xóa bài tập"
        message={`Bạn có chắc chắn muốn xóa bài tập "${selectedAssignment?.title}" không? Hành động này không thể hoàn tác.`}
        onCancel={() => setOpenConfirmModal(false)}
        onConfirm={() => {
          handleDeleteAssignment(selectedAssignment);
          setOpenConfirmModal(false);
        }}
        btnDelete="Xóa"
        btnCancel="Hủy"
      />
    </div>
  );
}