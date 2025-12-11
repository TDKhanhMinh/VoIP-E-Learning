import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  FaBell,
  FaEdit,
  FaArrowLeft,
  FaClock,
  FaUser,
  FaCheckCircle,
  FaInfoCircle,
} from "react-icons/fa";
import {
  MdPublic,
  MdPublicOff,
  MdCheckCircleOutline,
  MdOutlineRecordVoiceOver,
} from "react-icons/md";
import { BsFillSendCheckFill } from "react-icons/bs";
import { IoMdCloseCircleOutline } from "react-icons/io";
import { toast } from "react-toastify";
import { classService } from "../../services/classService";
import { recordingService } from "./../../services/recordingService";
import SummaryEditModal from "./../../components/Modals/SummaryEditModal";
import ConfirmDialog from "./../../components/UI/ConfirmDialog";
import { convertHtmlToWord } from "../../utils/convertToWord";
import { uploadService } from "../../services/uploadService";
import { announcementService } from "./../../services/announcementService";
import HeaderSkeleton from "./../../components/SkeletonLoading/HeaderSkeleton";
import StatsSkeleton from "./../../components/SkeletonLoading/StatsSkeleton";

export default function ClassRecords() {
  const [records, setRecords] = useState([]);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [isOpenConfirmModal, setIsOpenConfirmModal] = useState(false);
  const [classInfo, setClassInfo] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [filterType, setFilterType] = useState("all");
  const { id } = useParams();
  const navigate = useNavigate();

  const fetchClassAndRecords = async () => {
    setIsLoading(true);
    try {
      const [classData, recordsData] = await Promise.all([
        classService.getClassById(id),
        recordingService.getListRecordings(id),
      ]);
      setClassInfo(classData);
      setRecords(recordsData);
      console.log("records:", recordsData);
    } catch (error) {
      console.error("Lỗi khi tải dữ liệu:", error);
      toast.error("Không thể tải dữ liệu. Vui lòng thử lại sau.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchClassAndRecords();
  }, [id]);

  const handlerUpdateSummary = async (summaryData) => {
    try {
      await recordingService.updateAISummaryByRecordId(
        selectedRecord._id,
        summaryData
      );
      toast.success("Cập nhật tóm tắt thành công");
      setIsOpen(false);
      setSelectedRecord(null);
      fetchClassAndRecords();
    } catch (error) {
      toast.error("Lỗi khi cập nhật tóm tắt");
      console.log(error);
    }
  };

  const isRecent = (date) => {
    const daysDiff = (new Date() - new Date(date)) / (1000 * 60 * 60 * 24);
    return daysDiff <= 7;
  };

  const filteredRecords = records?.filter((n) => {
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
    total: records?.length || 0,
    recent: records?.filter((n) => isRecent(n.createdAt)).length || 0,
    older: records?.filter((n) => !isRecent(n.createdAt)).length || 0,
  };
  const handlePublishRecord = async () => {
    setIsLoading(true);
    try {
      const wordResult = await convertHtmlToWord(
        selectedRecord.aiSummary,
        selectedRecord.summaryTitle
      );
      console.log("Word Blob:", wordResult);
      const publishData = await uploadService.uploadFile(
        wordResult,
        (progress) => {
          console.log(`Upload progress: ${progress}%`);
        }
      );
      console.log("Published Data:", publishData);
      await announcementService.createAnnouncement({
        file_url: publishData.url,
        file_name: publishData.file_name,
        class: id,
        created_by: selectedRecord.createdBy,
        title: `Bản ghi tóm tắt bài học`,
        content: `Giảng viên đã công bố bản ghi tóm tắt cho buổi học. Vui lòng tải về để xem chi tiết.`,
      });
      await recordingService.publishRecordingById(selectedRecord._id);
      toast.success("Bản ghi đã được công bố thành công");
      setIsOpenConfirmModal(false);
      setSelectedRecord(null);
      fetchClassAndRecords();
    } catch (error) {
      setIsLoading(false);
      setIsOpenConfirmModal(false);
      toast.error("Lỗi khi công bố bản ghi");
      console.log(error);
    } finally {
      setIsLoading(false);
    }
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
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50 p-4 md:p-8">
        <div className="max-w-7xl mx-auto space-y-6">
          <HeaderSkeleton />
          <StatsSkeleton />
          <ListSkeleton />
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
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-start gap-4">
                <div className="p-4 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl shadow-lg">
                  <MdOutlineRecordVoiceOver className="text-white text-3xl" />
                </div>
                <div>
                  <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-1">
                    Quản lí tóm tắt bài giảng online
                  </h1>
                  <p className="text-gray-600 flex items-center gap-2">
                    <FaInfoCircle className="text-blue-600" />
                    {classInfo?.name || "Đang tải..."}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm font-medium">
                  Tổng bản ghi
                </p>
                <p className="text-3xl font-bold text-gray-800 mt-2">
                  {stats.total}
                </p>
              </div>
              <div className="p-4 bg-blue-100 rounded-xl">
                <FaBell className="text-blue-600 text-3xl" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm font-medium">
                  Gần đây (7 ngày)
                </p>
                <p className="text-3xl font-bold text-green-600 mt-2">
                  {stats.recent}
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
                <p className="text-gray-500 text-sm font-medium">Cũ hơn</p>
                <p className="text-3xl font-bold text-purple-600 mt-2">
                  {stats.older}
                </p>
              </div>
              <div className="p-4 bg-purple-100 rounded-xl">
                <FaClock className="text-purple-600 text-3xl" />
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-4 border border-gray-100">
          <div className="flex gap-2 overflow-x-auto">
            <button
              onClick={() => setFilterType("all")}
              className={`px-5 py-2.5 rounded-xl font-medium transition-all whitespace-nowrap ${
                filterType === "all"
                  ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              Tất cả ({stats.total})
            </button>
            <button
              onClick={() => setFilterType("recent")}
              className={`px-5 py-2.5 rounded-xl font-medium transition-all whitespace-nowrap ${
                filterType === "recent"
                  ? "bg-gradient-to-r from-green-600 to-emerald-600 text-white shadow-md"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              Gần đây ({stats.recent})
            </button>
            <button
              onClick={() => setFilterType("older")}
              className={`px-5 py-2.5 rounded-xl font-medium transition-all whitespace-nowrap ${
                filterType === "older"
                  ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-md"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              Cũ hơn ({stats.older})
            </button>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
          {filteredRecords?.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 px-4">
              <div className="w-24 h-24 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-full flex items-center justify-center mb-4">
                <MdOutlineRecordVoiceOver className="text-blue-600 text-4xl" />
              </div>
              <p className="text-gray-600 font-medium text-lg">
                {filterType === "all"
                  ? "Chưa có bản ghi nào"
                  : "Không có bản ghi nào"}
              </p>
              <p className="text-gray-400 text-sm mt-2">
                {filterType === "all"
                  ? "Chưa có bản ghi nào được tạo trong lớp học này"
                  : "Thử thay đổi bộ lọc để xem bản ghi khác"}
              </p>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {filteredRecords.map((n) => {
                const recent = isRecent(n.createdAt);

                return (
                  <div
                    key={n._id}
                    className="p-6 hover:bg-blue-50 transition-colors duration-150 group"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start gap-3 mb-3">
                          <div
                            className={`p-3 rounded-xl ${
                              recent ? "bg-green-100" : "bg-blue-100"
                            }`}
                          >
                            <FaBell
                              className={`${
                                recent ? "text-green-600" : "text-blue-600"
                              } text-xl`}
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-2">
                              <h3 className="text-lg font-bold text-gray-800 truncate">
                                {n.roomName}
                              </h3>
                              {recent && (
                                <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded-full">
                                  Mới
                                </span>
                              )}
                            </div>
                            <h4 className="ttext-lg font-bold text-gray-800 truncate mb-1">
                              {n.summaryTitle || "Chưa có tiêu đề AI"}
                            </h4>
                          </div>
                        </div>

                        <div className="flex items-center gap-4 text-sm text-gray-500 ml-14">
                          <div className="flex items-center gap-2">
                            <FaClock className="text-gray-400" />
                            <span>{formatDate(n.createdAt)}</span>
                          </div>
                          {n.createdBy && (
                            <div className="flex items-center gap-2">
                              <FaUser className="text-gray-400" />
                              <span>{n.createdBy || "Trần Đỗ Khánh Minh"}</span>
                            </div>
                          )}
                          {
                            <div className="flex items-center gap-2">
                              {!n.isReviewed ? (
                                <IoMdCloseCircleOutline className="text-gray-400" />
                              ) : (
                                <MdCheckCircleOutline className="text-green-400" />
                              )}
                              <span>
                                {!n.isReviewed
                                  ? "Chưa đánh giá"
                                  : "Đã đánh giá"}
                              </span>
                            </div>
                          }
                          {
                            <div className="flex items-center gap-2">
                              {!n.isPublished ? (
                                <MdPublicOff className="text-gray-400" />
                              ) : (
                                <MdPublic className="text-green-400" />
                              )}
                              <span>
                                {!n.isPublished ? "Chưa công bố" : "Đã công bố"}
                              </span>
                            </div>
                          }
                        </div>
                      </div>

                      <div className="flex items-center gap-2 ml-4">
                        <button
                          onClick={() => {
                            setSelectedRecord(n);
                            setIsOpen(true);
                          }}
                          className="p-3 text-blue-600 hover:bg-blue-100 rounded-xl transition-all"
                          title="Chỉnh sửa"
                        >
                          <FaEdit className="text-lg" />
                        </button>
                        {n.isReviewed && (
                          <button
                            onClick={() => {
                              setSelectedRecord(n);
                              setIsOpenConfirmModal(true);
                            }}
                            className="p-3 text-blue-600 hover:bg-blue-100 rounded-xl transition-all"
                            title="Công bố bản ghi"
                          >
                            <BsFillSendCheckFill className="text-lg" />
                          </button>
                        )}
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
        <SummaryEditModal
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
          initialData={selectedRecord.aiSummary}
          onSave={handlerUpdateSummary}
        />
      )}
      {isOpenConfirmModal && (
        <ConfirmDialog
          isOpen={isOpenConfirmModal}
          onCancel={() => setIsOpenConfirmModal(false)}
          onConfirm={() => handlePublishRecord()}
          btnDelete="Công bố"
          title="Xác nhận công bố"
          message="Bạn có chắc chắn muốn công bố bản ghi tóm tắt bài học này?"
        />
      )}
    </div>
  );
}
