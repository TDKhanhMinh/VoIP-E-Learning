import { useCallback, useEffect, useState } from "react";
import {
  FaPlus,
  FaEdit,
  FaCalendarAlt,
  FaClock,
  FaGraduationCap,
  FaUser,
  FaArrowLeft,
} from "react-icons/fa";
import SemesterModal from "../../components/Modals/SemesterModal";
import { semesterService } from "../../services/semesterService";
import { toast } from "react-toastify";
import formatDate from "../../utils/formatDate";
import Pagination from "../../components/UI/Pagination";
import { classService } from "./../../services/classService";
import { userService } from "./../../services/userService";
import { useNavigate } from "react-router-dom";
import ListItemSkeleton from "./../../components/SkeletonLoading/ListItemSkeleton";
import StatsSkeleton from "./../../components/SkeletonLoading/StatsSkeleton";

export default function ManageSemester() {
  const [open, setOpen] = useState(false);
  const [semesters, setSemesters] = useState([]);
  const [classes, setClasses] = useState([]);
  const [users, setUsers] = useState([]);

  const [isLoading, setIsLoading] = useState(true);
  const [isDetailLoading, setIsDetailLoading] = useState(false);

  const [openDetail, setOpenDetail] = useState(false);
  const [selectedSemester, setSelectedSemester] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const navigate = useNavigate();

  const itemsPerPage = 5;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentSemesters = semesters.slice(startIndex, endIndex);
  const totalPages = Math.ceil(semesters.length / itemsPerPage);

  const fetchSemesters = useCallback(async () => {
    setIsLoading(true);
    try {
      const [data, usersData] = await Promise.all([
        semesterService.getAllSemesters(),
        userService.getAllUsers(),
      ]);

      setUsers(usersData.filter((user) => user.role === "teacher"));
      setSemesters(data);
    } catch (error) {
      console.error("Error fetching semesters:", error);
      toast.error("Lỗi khi tải dữ liệu");
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleLoadSemesterDetails = async (semesterId) => {
    setOpenDetail(true);
    setIsDetailLoading(true);
    try {
      const semester = semesters.find((sem) => sem._id === semesterId);
      console.log("Loaded semester detail:", semester);

      const allClasses = await classService.getAllClass();
      const filteredClasses = allClasses.filter(
        (cls) => cls.semester === semesterId
      );
      setClasses(filteredClasses);
    } catch (error) {
      console.error("Error loading details:", error);
      toast.error("Không thể tải danh sách lớp học");
    } finally {
      setIsDetailLoading(false);
    }
  };

  const handleAddSemester = useCallback(
    async (semesterData) => {
      try {
        if (new Date(semesterData.endDate) < new Date(semesterData.startDate)) {
          toast.error("Ngày kết thúc phải sau ngày bắt đầu!");
          return;
        }
        await semesterService.createSemester(semesterData);
        await fetchSemesters();
        setCurrentPage(1);
        setOpen(false);
        toast.success("Thêm học kỳ thành công");
      } catch (error) {
        toast.error(error?.response?.data?.message || "Lỗi khi thêm học kỳ");
        console.error("Error adding semester:", error);
      }
    },
    [fetchSemesters]
  );

  const handleUpdateSemester = useCallback(
    async (semesterData) => {
      try {
        if (new Date(semesterData.endDate) < new Date(semesterData.startDate)) {
          toast.error("Ngày kết thúc phải sau ngày bắt đầu!");
          return;
        }
        const { _id, ...payload } = semesterData;

        await semesterService.updateSemester(selectedSemester._id, payload);
        setSelectedSemester(null);
        await fetchSemesters();
        setCurrentPage(1);
        setOpen(false);
        toast.success("Cập nhật học kỳ thành công");
      } catch (error) {
        toast.error(
          error?.response?.data?.message || "Lỗi khi cập nhật học kỳ"
        );
        console.error("Error update semester:", error);
      }
    },
    [fetchSemesters, selectedSemester?._id]
  );

  const getActiveSemesters = () => {
    const now = new Date();
    return semesters.filter((sem) => {
      const start = new Date(sem.start_date);
      const end = new Date(sem.end_date);
      return now >= start && now <= end;
    }).length;
  };

  const getUpcomingSemesters = () => {
    const now = new Date();
    return semesters.filter((sem) => new Date(sem.start_date) > now).length;
  };

  const getSemesterStatus = (startDate, endDate) => {
    const now = new Date();
    const start = new Date(startDate);
    const end = new Date(endDate);

    if (now < start) {
      return {
        label: "Upcoming",
        color: "bg-blue-100 text-blue-700 border-blue-200",
      };
    } else if (now > end) {
      return {
        label: "Completed",
        color: "bg-gray-100 text-gray-700 border-gray-200",
      };
    } else {
      return {
        label: "Active",
        color: "bg-green-100 text-green-700 border-green-200",
      };
    }
  };

  useEffect(() => {
    fetchSemesters();
  }, [fetchSemesters]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-3">
            <div className="w-14 h-14 bg-blue-600 dark:bg-blue-700 rounded-2xl flex items-center justify-center shadow-lg dark:shadow-blue-900/50">
              <FaGraduationCap className="text-white text-2xl" />
            </div>
            <div
              className={`${
                openDetail ? "flex flex-row w-full justify-between" : ""
              }`}
            >
              <h2 className="text-4xl font-bold text-blue-600 dark:text-blue-400 pb-4">
                Quản lý Học kỳ
              </h2>
              {openDetail && (
                <button
                  onClick={() => setOpenDetail(false)}
                  className="mb-4 flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 font-semibold"
                >
                  <FaArrowLeft /> Quay lại
                </button>
              )}
            </div>
          </div>

          {isLoading ? (
            <StatsSkeleton />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
              <div className="bg-white dark:bg-slate-600 rounded-2xl p-5 shadow-lg dark:shadow-slate-700/50 border border-gray-100 dark:border-slate-500">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-purple-100 dark:bg-purple-400/20 rounded-xl flex items-center justify-center">
                    <FaCalendarAlt className="text-purple-600 dark:text-purple-300 text-xl" />
                  </div>
                  <div>
                    <div className="text-sm text-gray-600 dark:text-gray-200">
                      Tổng số học kỳ
                    </div>
                    <div className="text-3xl font-bold text-gray-800 dark:text-white">
                      {semesters.length}
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-green-600 dark:bg-green-500 rounded-2xl p-5 shadow-lg dark:shadow-green-500/20 text-white">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-white/20 dark:bg-white/30 rounded-xl flex items-center justify-center">
                    <FaClock className="text-white text-xl" />
                  </div>
                  <div>
                    <div className="text-sm opacity-90 font-medium">
                      Học kỳ Đang Hoạt động
                    </div>
                    <div className="text-3xl font-bold">
                      {getActiveSemesters()}
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-blue-600 dark:bg-blue-500 rounded-2xl p-5 shadow-lg dark:shadow-blue-500/20 text-white">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-white/20 dark:bg-white/30 rounded-xl flex items-center justify-center">
                    <FaCalendarAlt className="text-white text-xl" />
                  </div>
                  <div>
                    <div className="text-sm opacity-90 font-medium">
                      Học kỳ Sắp Diễn Ra
                    </div>
                    <div className="text-3xl font-bold">
                      {getUpcomingSemesters()}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {openDetail === false && !isLoading && (
          <div className="bg-white dark:bg-slate-700 rounded-2xl shadow-lg dark:shadow-slate-900/70 border border-gray-100 dark:border-slate-600 p-6 mb-6">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100">
                  Danh sách học kỳ
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  Hiển thị {currentSemesters.length} trong tổng số{" "}
                  {semesters.length} học kỳ
                </p>
              </div>
              <button
                onClick={() => {
                  setSelectedSemester(null);
                  setOpen(true);
                }}
                className="flex items-center gap-2 bg-blue-600 dark:bg-blue-700 text-white px-6 py-3 rounded-xl hover:bg-blue-700 dark:hover:bg-blue-600 shadow-lg dark:shadow-blue-900/50 transition-all font-semibold hover:shadow-xl hover:-translate-y-0.5"
              >
                <FaPlus />
                <span>Thêm học kỳ</span>
              </button>
            </div>
          </div>
        )}

        {isLoading ? (
          <div className="grid grid-cols-1 gap-4 mb-6">
            {[...Array(5)].map((_, i) => (
              <ListItemSkeleton key={i} />
            ))}
          </div>
        ) : openDetail === false ? (
          <>
            {currentSemesters.length > 0 ? (
              <div className="grid grid-cols-1 gap-4 mb-6">
                {currentSemesters.map((sem) => {
                  const status = getSemesterStatus(
                    sem.start_date,
                    sem.end_date
                  );
                  return (
                    <div
                      key={sem._id}
                      className="bg-white dark:bg-slate-700 rounded-2xl shadow-lg dark:shadow-slate-900/70 border border-gray-100 dark:border-slate-600 p-6 hover:shadow-xl transition-all"
                    >
                      <div
                        onClick={() => handleLoadSemesterDetails(sem._id)}
                        className="flex flex-col md:flex-row md:items-center justify-between gap-4 cursor-pointer"
                      >
                        <div className="flex items-center gap-4 flex-1">
                          <div className="w-16 h-16 bg-blue-600 dark:bg-blue-700 rounded-2xl flex items-center justify-center shadow-lg dark:shadow-blue-900/50 flex-shrink-0">
                            <FaGraduationCap className="text-white text-2xl" />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100">
                                {sem.name}
                              </h3>
                              <span
                                className={`px-3 py-1 rounded-full text-xs font-bold border-2 ${status.color}`}
                              >
                                {status.label}
                              </span>
                            </div>
                            <div className="flex flex-wrap gap-4 text-sm text-gray-600 dark:text-gray-300">
                              <div className="flex items-center gap-2">
                                <FaCalendarAlt className="text-purple-500 dark:text-purple-400" />
                                <span>
                                  Bắt đầu:{" "}
                                  <span className="font-semibold">
                                    {formatDate(sem.start_date)}
                                  </span>
                                </span>
                              </div>
                              <div className="flex items-center gap-2">
                                <FaCalendarAlt className="text-pink-500 dark:text-pink-400" />
                                <span>
                                  End:{" "}
                                  <span className="font-semibold">
                                    {formatDate(sem.end_date)}
                                  </span>
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div
                          className="flex gap-2"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <button
                            onClick={() => {
                              setOpen(true);
                              setSelectedSemester(sem);
                            }}
                            className="p-3 bg-yellow-500 dark:bg-yellow-600 text-white rounded-xl hover:bg-yellow-600 dark:hover:bg-yellow-500 transition-all hover:shadow-lg dark:shadow-yellow-900/50 hover:-translate-y-0.5"
                          >
                            <FaEdit />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="bg-white dark:bg-slate-700 rounded-2xl shadow-lg dark:shadow-slate-900/70 border border-gray-100 dark:border-slate-600 p-12 text-center">
                <p className="text-gray-500 dark:text-gray-400 font-medium text-lg">
                  Chưa có học kỳ nào.
                </p>
              </div>
            )}

            {semesters.length > itemsPerPage && (
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
              />
            )}
          </>
        ) : (
          <>
            {isDetailLoading ? (
              <div className="grid grid-cols-1 gap-4">
                {[...Array(3)].map((_, i) => (
                  <ListItemSkeleton key={i} />
                ))}
              </div>
            ) : classes.length === 0 ? (
              <div className="bg-white dark:bg-slate-700 rounded-2xl shadow-lg dark:shadow-slate-900/70 border border-gray-100 dark:border-slate-600 p-12">
                <div className="flex flex-col items-center gap-4">
                  <div className="w-20 h-20 bg-gray-100 dark:bg-slate-600 rounded-full flex items-center justify-center">
                    <FaGraduationCap className="text-gray-400 dark:text-gray-500 text-3xl" />
                  </div>
                  <p className="text-gray-500 dark:text-gray-400 font-medium text-lg">
                    Không tìm thấy lớp học nào trong học kì này
                  </p>
                </div>
              </div>
            ) : (
              <>
                <div className="border-b border-gray-200 dark:border-slate-600 pb-3 mb-6">
                  <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
                    Các lớp học có trong học kì này
                  </h2>
                </div>

                {classes.map((cls) => {
                  return (
                    <div
                      key={cls._id}
                      className="bg-white dark:bg-slate-700 rounded-2xl shadow-lg dark:shadow-slate-900/70 border border-gray-100 dark:border-slate-600 p-6 hover:shadow-xl transition-all my-2"
                    >
                      <div
                        onClick={() => {
                          navigate(`/admin/classes/class-details/${cls._id}`);
                        }}
                        className="flex flex-col md:flex-row md:items-center justify-between gap-4 cursor-pointer"
                      >
                        <div className="flex items-center gap-4 flex-1 ">
                          <div className="w-16 h-16 bg-blue-600 dark:bg-blue-700 rounded-2xl flex items-center justify-center shadow-lg dark:shadow-blue-900/50 flex-shrink-0">
                            <FaGraduationCap className="text-white text-2xl" />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100">
                                {cls.name}
                              </h3>
                            </div>
                            <div className="flex flex-wrap gap-4 text-sm text-gray-600 dark:text-gray-300">
                              <div className="flex items-center gap-2">
                                <FaUser className="text-purple-500 dark:text-purple-400" />
                                <span>
                                  {
                                    users.find((u) => u._id === cls.teacher)
                                      ?.full_name
                                  }
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </>
            )}
          </>
        )}
      </div>

      <SemesterModal
        isOpen={open}
        onClose={() => {
          setOpen(false);
          setSelectedSemester(null);
        }}
        onSave={selectedSemester ? handleUpdateSemester : handleAddSemester}
        initialData={selectedSemester}
      />
    </div>
  );
}
