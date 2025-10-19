import { useEffect, useState } from "react";
import {
    FaBell,
    FaSearch,
    FaChalkboardTeacher,
    FaClock,
    FaFilter,
    FaCheckCircle,
    FaExclamationCircle,
    FaUser,
    FaBook
} from "react-icons/fa";
import { announcementService } from "../../services/announcementService";
import { enrollmentService } from './../../services/enrollmentService';
import { classService } from "../../services/classService";
import { toast } from "react-toastify";

export default function ManageNotification() {
    const studentId = sessionStorage.getItem("userId")?.replace(/"/g, "");
    const [announcements, setAnnouncements] = useState([]);
    const [classes, setClasses] = useState([]);
    const [selectedClass, setSelectedClass] = useState("");
    const [searchTerm, setSearchTerm] = useState("");
    const [isLoading, setIsLoading] = useState(true);
    const [filterTime, setFilterTime] = useState("all"); // all, today, week, month

    useEffect(() => {
        fetchData();
    }, [studentId]);

    const fetchData = async () => {
        setIsLoading(true);
        try {
            const [enrolled, allClasses, allAnnouncements] = await Promise.all([
                enrollmentService.getAllEnrollmentsByStudentId(studentId),
                classService.getAllClass(),
                announcementService.getAllAnnouncement()
            ]);

            console.log("Enrolled:", enrolled);

            const enrolledClassIds = enrolled.map((en) => en.class._id.toString());
            const filteredClasses = allClasses.filter((cls) =>
                enrolledClassIds.includes(cls._id.toString())
            );
            console.log("Classes:", filteredClasses);
            setClasses(filteredClasses);

            const filteredAnnouncements = allAnnouncements.filter((an) =>
                enrolledClassIds.includes(an.class._id.toString())
            );
            console.log("Announcements:", filteredAnnouncements);
            setAnnouncements(filteredAnnouncements);
        } catch (error) {
            console.error("Lỗi khi tải thông báo:", error);
            toast.error("Không thể tải thông báo");
        } finally {
            setIsLoading(false);
        }
    };

    const isToday = (date) => {
        const today = new Date();
        const d = new Date(date);
        return d.toDateString() === today.toDateString();
    };

    const isThisWeek = (date) => {
        const now = new Date();
        const weekAgo = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 7);
        return new Date(date) >= weekAgo;
    };

    const isThisMonth = (date) => {
        const now = new Date();
        const monthAgo = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 30);
        return new Date(date) >= monthAgo;
    };

    const filteredAnnouncements = announcements.filter((a) => {
        const matchClass = selectedClass ? a.class?._id === selectedClass : true;
        const matchSearch = a.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            a.content.toLowerCase().includes(searchTerm.toLowerCase());

        let matchTime = true;
        if (filterTime === "today") matchTime = isToday(a.createdAt);
        else if (filterTime === "week") matchTime = isThisWeek(a.createdAt);
        else if (filterTime === "month") matchTime = isThisMonth(a.createdAt);

        return matchClass && matchSearch && matchTime;
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
                minute: "2-digit"
            });
        }
    };

    const stats = {
        total: announcements.length,
        today: announcements.filter(a => isToday(a.createdAt)).length,
        week: announcements.filter(a => isThisWeek(a.createdAt)).length,
        classes: classes.length
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-gray-600 font-medium">Đang tải thông báo...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50 p-4 md:p-8">
            <div className="max-w-7xl mx-auto space-y-6">
                {/* Header */}
                <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
                    <div className="flex items-center gap-4">
                        <div className="p-4 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl shadow-lg">
                            <FaBell className="text-white text-3xl" />
                        </div>
                        <div>
                            <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
                                Thông báo của tôi
                            </h1>
                            <p className="text-gray-600 mt-1">
                                Theo dõi các thông báo từ giảng viên và lớp học
                            </p>
                        </div>
                    </div>
                </div>

                {/* Statistics Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-500 text-sm font-medium">Tổng thông báo</p>
                                <p className="text-3xl font-bold text-gray-800 mt-2">{stats.total}</p>
                            </div>
                            <div className="p-4 bg-blue-100 rounded-xl">
                                <FaBell className="text-blue-600 text-3xl" />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-500 text-sm font-medium">Hôm nay</p>
                                <p className="text-3xl font-bold text-green-600 mt-2">{stats.today}</p>
                            </div>
                            <div className="p-4 bg-green-100 rounded-xl">
                                <FaCheckCircle className="text-green-600 text-3xl" />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-500 text-sm font-medium">Tuần này</p>
                                <p className="text-3xl font-bold text-purple-600 mt-2">{stats.week}</p>
                            </div>
                            <div className="p-4 bg-purple-100 rounded-xl">
                                <FaClock className="text-purple-600 text-3xl" />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-500 text-sm font-medium">Lớp học</p>
                                <p className="text-3xl font-bold text-orange-600 mt-2">{stats.classes}</p>
                            </div>
                            <div className="p-4 bg-orange-100 rounded-xl">
                                <FaChalkboardTeacher className="text-orange-600 text-3xl" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Search and Filters */}
                <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        {/* Search Bar */}
                        <div className="relative">
                            <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Tìm kiếm theo tiêu đề hoặc nội dung..."
                                className="w-full pl-11 pr-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>

                        {/* Class Filter */}
                        <div className="relative">
                            <FaFilter className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                            <select
                                value={selectedClass}
                                onChange={(e) => setSelectedClass(e.target.value)}
                                className="w-full pl-11 pr-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all appearance-none cursor-pointer"
                            >
                                <option value="">Tất cả lớp học</option>
                                {classes.map((cls) => (
                                    <option key={cls._id} value={cls._id}>
                                        {cls.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* Time Filter Tabs */}
                    <div className="flex gap-2 overflow-x-auto">
                        <button
                            onClick={() => setFilterTime("all")}
                            className={`px-5 py-2.5 rounded-xl font-medium transition-all whitespace-nowrap ${filterTime === "all"
                                ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md"
                                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                                }`}
                        >
                            Tất cả
                        </button>
                        <button
                            onClick={() => setFilterTime("today")}
                            className={`px-5 py-2.5 rounded-xl font-medium transition-all whitespace-nowrap ${filterTime === "today"
                                ? "bg-gradient-to-r from-green-600 to-emerald-600 text-white shadow-md"
                                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                                }`}
                        >
                            Hôm nay
                        </button>
                        <button
                            onClick={() => setFilterTime("week")}
                            className={`px-5 py-2.5 rounded-xl font-medium transition-all whitespace-nowrap ${filterTime === "week"
                                ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-md"
                                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                                }`}
                        >
                            Tuần này
                        </button>
                        <button
                            onClick={() => setFilterTime("month")}
                            className={`px-5 py-2.5 rounded-xl font-medium transition-all whitespace-nowrap ${filterTime === "month"
                                ? "bg-gradient-to-r from-orange-600 to-red-600 text-white shadow-md"
                                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                                }`}
                        >
                            Tháng này
                        </button>
                    </div>

                    {/* Results Count */}
                    <div className="mt-4 text-sm text-gray-600">
                        Hiển thị <span className="font-semibold text-blue-600">{filteredAnnouncements.length}</span> thông báo
                        {(searchTerm || selectedClass || filterTime !== "all") && " (đã lọc)"}
                    </div>
                </div>

                {/* Notifications List */}
                <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
                    {filteredAnnouncements.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-16 px-4">
                            <div className="w-24 h-24 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-full flex items-center justify-center mb-4">
                                <FaBell className="text-blue-600 text-4xl" />
                            </div>
                            <p className="text-gray-600 font-medium text-lg">
                                Không có thông báo nào
                            </p>
                            <p className="text-gray-400 text-sm mt-2">
                                {searchTerm || selectedClass || filterTime !== "all"
                                    ? "Thử thay đổi bộ lọc để xem thông báo khác"
                                    : "Bạn chưa có thông báo nào"}
                            </p>
                        </div>
                    ) : (
                        <div className="divide-y divide-gray-100">
                            {filteredAnnouncements.map((ann) => {
                                const isNew = isToday(ann.createdAt);

                                return (
                                    <div
                                        key={ann._id}
                                        className="p-6 hover:bg-blue-50 transition-colors duration-150"
                                    >
                                        <div className="flex items-start gap-4">
                                            <div className={`p-3 rounded-xl flex-shrink-0 ${isNew ? "bg-green-100" : "bg-blue-100"
                                                }`}>
                                                <FaBell className={`${isNew ? "text-green-600" : "text-blue-600"
                                                    } text-xl`} />
                                            </div>

                                            <div className="flex-1 min-w-0">
                                                {/* Title with Badge */}
                                                <div className="flex items-start gap-2 mb-2">
                                                    <h3 className="text-lg font-bold text-gray-800 flex-1">
                                                        {ann.title}
                                                    </h3>
                                                    {isNew && (
                                                        <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded-full whitespace-nowrap">
                                                            Mới
                                                        </span>
                                                    )}
                                                </div>

                                                {/* Content */}
                                                <p className="text-gray-600 leading-relaxed mb-4">
                                                    {ann.content}
                                                </p>

                                                {/* Footer Info */}
                                                <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                                                    <div className="flex items-center gap-2">
                                                        <div className="p-1.5 bg-purple-100 rounded">
                                                            <FaBook className="text-purple-600 text-xs" />
                                                        </div>
                                                        <span className="font-medium text-gray-700">
                                                            {ann.class?.name || "Không xác định"}
                                                        </span>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <div className="p-1.5 bg-orange-100 rounded">
                                                            <FaUser className="text-orange-600 text-xs" />
                                                        </div>
                                                        <span>
                                                            GV: {ann.created_by?.full_name || "Ẩn danh"}
                                                        </span>
                                                    </div>
                                                    <div className="flex items-center gap-2 ml-auto">
                                                        <FaClock className="text-gray-400" />
                                                        <span>{formatDate(ann.createdAt)}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}