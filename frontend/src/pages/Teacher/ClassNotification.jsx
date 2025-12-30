import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  FaBell,
  FaPlus,
  FaEdit,
  FaTrash,
  FaArrowLeft,
  FaClock,
  FaUser,
  FaCheckCircle,
  FaInfoCircle,
  FaDownload,
} from "react-icons/fa";
import { toast } from "react-toastify";
import { classService } from "../../services/classService";
import { announcementService } from "./../../services/announcementService";
import NotificationModal from "./../../components/Modals/NotificationModal";
import ConfirmDialog from "./../../components/UI/ConfirmDialog";
import StatsSkeleton from "./../../components/SkeletonLoading/StatsSkeleton";
import HeaderSkeleton from "./../../components/SkeletonLoading/HeaderSkeleton";

export default function ClassNotification() {
  const teacherId = sessionStorage.getItem("userId")?.replace(/"/g, "");
  const [notifications, setNotifications] = useState([]);
  const [selectedNotification, setSelectedNotification] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [openConfirmModal, setOpenConfirmModal] = useState(false);
  const [classInfo, setClassInfo] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [filterType, setFilterType] = useState("all");
  const { id } = useParams();
  const navigate = useNavigate();

  const fetchClassAndNotifications = async () => {
    setIsLoading(true);
    try {
      const [classData, notificationsData] = await Promise.all([
        classService.getClassById(id),
        announcementService.getAnnouncementByClassId(id),
      ]);
      setClassInfo(classData);
      setNotifications(notificationsData);
      console.log("Notifications:", notificationsData);
    } catch (error) {
      console.error("Lỗi khi tải dữ liệu:", error);
      toast.error("Không thể tải thông báo");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchClassAndNotifications();
  }, [id]);

  const handleDelete = async (notificationId) => {
    try {
      await announcementService.deleteAnnouncement(notificationId);
      toast.success("Đã xóa thông báo");
      fetchClassAndNotifications();
    } catch {
      toast.error("Lỗi khi xóa thông báo");
    }
  };

  const handlerAddNotification = async (notificationData) => {
    try {
      const payload = {
        class: id,
        created_by: teacherId,
        ...notificationData,
      };
      await announcementService.createAnnouncement(payload);
      toast.success("Tạo thông báo thành công");
      setIsOpen(false);
      fetchClassAndNotifications();
    } catch (error) {
      toast.error("Lỗi khi tạo thông báo");
      console.log(error);
    }
  };

  const handlerUpdateNotification = async (notificationData) => {
    try {
      await announcementService.updateAnnouncement(
        selectedNotification._id,
        notificationData
      );
      toast.success("Cập nhật thông báo thành công");
      setIsOpen(false);
      fetchClassAndNotifications();
    } catch (error) {
      toast.error("Lỗi khi cập nhật thông báo");
      console.log(error);
    }
  };

  const isRecent = (date) => {
    const daysDiff = (new Date() - new Date(date)) / (1000 * 60 * 60 * 24);
    return daysDiff <= 7;
  };

  const filteredNotifications = notifications?.filter((n) => {
    if (filterType === "all") return true;
    if (filterType === "recent") return isRecent(n.createdAt);
    if (filterType === "older") return !isRecent(n.createdAt);
    return true;
  });

  const formatDate = (date) => {
    const d = new Date(date);
    const now = new Date();
    const diffInHours = (now - d) / (1000 * 60 * 60);

    if (diffInHours < 1) {
      return "Vừa xong";
    } else if (diffInHours < 24) {
      return `${Math.floor(diffInHours)} giờ trước`;
    } else if (diffInHours < 48) {
      return "Hôm qua";
    } else {
      return d.toLocaleDateString("vi-VN", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    }
  };

  const stats = {
    total: notifications?.length || 0,
    recent: notifications?.filter((n) => isRecent(n.createdAt)).length || 0,
    older: notifications?.filter((n) => !isRecent(n.createdAt)).length || 0,
  };

  const ListSkeleton = () => (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden animate-pulse">
      <div className="p-4 border-b border-gray-100 flex gap-2">
        <div className="h-8 bg-gray-200 rounded w-24"></div>
        <div className="h-8 bg-gray-200 rounded w-24"></div>
        <div className="h-8 bg-gray-200 rounded w-24"></div>
      </div>
      <div className="divide-y divide-gray-100">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="p-6">
            <div className="flex gap-4">
              <div className="w-12 h-12 bg-gray-200 rounded-xl"></div>
              <div className="flex-1 space-y-3">
                <div className="h-6 bg-gray-200 rounded w-3/4"></div>
                <div className="h-4 bg-gray-200 rounded w-full"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-900 p-4 md:p-8">
        <div className="max-w-7xl mx-auto space-y-6">
          <HeaderSkeleton />
          <StatsSkeleton />
          <ListSkeleton />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-900 p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="mb-6">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200 font-medium mb-4 transition-colors"
          >
            <FaArrowLeft /> Quay lại
          </button>
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 border border-gray-100 dark:border-gray-700">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-start gap-4">
                <div className="p-4 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl shadow-lg">
                  <FaBell className="text-white text-3xl" />
                </div>
                <div>
                  <h1 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-white mb-1">
                    Thông báo lớp học
                  </h1>
                  <p className="text-gray-600 dark:text-gray-400 flex items-center gap-2">
                    <FaInfoCircle className="text-blue-600 dark:text-blue-400" />
                    {classInfo?.name || "Đang tải..."}
                  </p>
                </div>
              </div>
              <button
                onClick={() => {
                  setSelectedNotification(null);
                  setIsOpen(true);
                }}
                className="flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-6 py-3 rounded-xl font-medium shadow-lg hover:shadow-xl transition-all duration-200 transform hover:-translate-y-0.5"
              >
                <FaPlus /> Tạo thông báo mới
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 border border-gray-100 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">
                  Tổng thông báo
                </p>
                <p className="text-3xl font-bold text-gray-800 dark:text-white mt-2">
                  {stats.total}
                </p>
              </div>
              <div className="p-4 bg-blue-100 dark:bg-blue-900/30 rounded-xl">
                <FaBell className="text-blue-600 dark:text-blue-400 text-3xl" />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 border border-gray-100 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">
                  Gần đây (7 ngày)
                </p>
                <p className="text-3xl font-bold text-green-600 dark:text-green-400 mt-2">
                  {stats.recent}
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
                  Cũ hơn
                </p>
                <p className="text-3xl font-bold text-purple-600 dark:text-purple-400 mt-2">
                  {stats.older}
                </p>
              </div>
              <div className="p-4 bg-purple-100 dark:bg-purple-900/30 rounded-xl">
                <FaClock className="text-purple-600 dark:text-purple-400 text-3xl" />
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-4 border border-gray-100 dark:border-gray-700">
          <div className="flex gap-2 overflow-x-auto">
            <button
              onClick={() => setFilterType("all")}
              className={`px-5 py-2.5 rounded-xl font-medium transition-all whitespace-nowrap ${
                filterType === "all"
                  ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
              }`}
            >
              Tất cả ({stats.total})
            </button>
            <button
              onClick={() => setFilterType("recent")}
              className={`px-5 py-2.5 rounded-xl font-medium transition-all whitespace-nowrap ${
                filterType === "recent"
                  ? "bg-gradient-to-r from-green-600 to-emerald-600 text-white shadow-md"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
              }`}
            >
              Gần đây ({stats.recent})
            </button>
            <button
              onClick={() => setFilterType("older")}
              className={`px-5 py-2.5 rounded-xl font-medium transition-all whitespace-nowrap ${
                filterType === "older"
                  ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-md"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
              }`}
            >
              Cũ hơn ({stats.older})
            </button>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 overflow-hidden">
          {filteredNotifications?.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 px-4">
              <div className="w-24 h-24 bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-blue-900/30 dark:to-indigo-900/30 rounded-full flex items-center justify-center mb-4">
                <FaBell className="text-blue-600 dark:text-blue-400 text-4xl" />
              </div>
              <p className="text-gray-600 dark:text-gray-300 font-medium text-lg">
                {filterType === "all"
                  ? "Chưa có thông báo nào"
                  : "Không có thông báo nào"}
              </p>
              <p className="text-gray-400 dark:text-gray-500 text-sm mt-2">
                {filterType === "all"
                  ? "Nhấn 'Tạo thông báo mới' để bắt đầu"
                  : "Thử thay đổi bộ lọc để xem thông báo khác"}
              </p>
            </div>
          ) : (
            <div className="divide-y divide-gray-100 dark:divide-gray-700">
              {filteredNotifications.map((n) => {
                const recent = isRecent(n.createdAt);

                return (
                  <div
                    key={n._id}
                    className="p-6 hover:bg-blue-50 dark:hover:bg-gray-700 transition-colors duration-150 group"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start gap-3 mb-3">
                          <div
                            className={`p-3 rounded-xl ${
                              recent
                                ? "bg-green-100 dark:bg-green-900/30"
                                : "bg-blue-100 dark:bg-blue-900/30"
                            }`}
                          >
                            <FaBell
                              className={`${
                                recent
                                  ? "text-green-600 dark:text-green-400"
                                  : "text-blue-600 dark:text-blue-400"
                              } text-xl`}
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-2">
                              <h3 className="text-lg font-bold text-gray-800 dark:text-white truncate">
                                {n.title}
                              </h3>
                              {recent && (
                                <span className="px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-xs font-semibold rounded-full">
                                  Mới
                                </span>
                              )}
                            </div>
                            <p className="text-gray-600 dark:text-gray-300 leading-relaxed line-clamp-2">
                              {n.content}
                            </p>
                            {n.file_url && (
                              <a
                                href={n.file_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-600 dark:text-blue-400 hover:underline items-center gap-2 mt-2 inline-block font-medium group"
                              >
                                <FaDownload className="group-hover:animate-bounce" />
                                {n.file_name.split(".")[0] || "Tệp đính kèm"}
                              </a>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400 ml-14">
                          <div className="flex items-center gap-2">
                            <FaClock className="text-gray-400 dark:text-gray-500" />
                            <span>{formatDate(n.createdAt)}</span>
                          </div>
                          {n.created_by?.full_name && (
                            <div className="flex items-center gap-2">
                              <FaUser className="text-gray-400 dark:text-gray-500" />
                              <span>{n.created_by.full_name}</span>
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => {
                            setSelectedNotification(n);
                            setIsOpen(true);
                          }}
                          className="p-3 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/30 rounded-xl transition-all"
                          title="Chỉnh sửa"
                        >
                          <FaEdit className="text-lg" />
                        </button>
                        <button
                          onClick={() => {
                            setSelectedNotification(n);
                            setOpenConfirmModal(true);
                          }}
                          className="p-3 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-xl transition-all"
                          title="Xóa"
                        >
                          <FaTrash className="text-lg" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {isOpen && (
        <NotificationModal
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
          initialData={selectedNotification}
          onSubmitData={
            selectedNotification
              ? handlerUpdateNotification
              : handlerAddNotification
          }
        />
      )}
      <ConfirmDialog
        isOpen={openConfirmModal}
        title="Xác nhận xóa thông báo"
        message={`Bạn có chắc chắn muốn xóa thông báo "${selectedNotification?.title}" không? Hành động này không thể hoàn tác.`}
        onCancel={() => setOpenConfirmModal(false)}
        onConfirm={() => {
          handleDelete(selectedNotification._id);
          setOpenConfirmModal(false);
        }}
        btnDelete="Xóa"
        btnCancel="Hủy"
      />
    </div>
  );
}
