import { useEffect, useState } from "react";
import { FaBell, FaSearch, FaChalkboardTeacher } from "react-icons/fa";
import { announcementService } from "../../services/announcementService";
import { enrollmentService } from "./../../services/enrollmentService";
import { classService } from "../../services/classService";
import NotificationItem from "../../components/Common/NotificationItem";
import NotificationSkeleton from "./../../components/SkeletonLoading/NotificationSkeleton";

export default function Notification() {
  const studentId = sessionStorage.getItem("userId")?.replace(/"/g, "");
  const [announcements, setAnnouncements] = useState([]);
  const [classes, setClasses] = useState([]);
  const [selectedClass, setSelectedClass] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const [enrolled, allClasses, allAnnouncements] = await Promise.all([
          enrollmentService.getAllEnrollmentsByStudentId(studentId),
          classService.getAllClass(),
          announcementService.getAllAnnouncement(),
        ]);

        console.log("Enrolled:", enrolled);

        const enrolledClassIds = enrolled.map((en) => en.class._id.toString());

        const filteredClasses = allClasses.filter((cls) =>
          enrolledClassIds.includes(cls._id.toString())
        );
        setClasses(filteredClasses);

        const filteredAnnouncements = allAnnouncements.filter((an) =>
          enrolledClassIds.includes(an.class._id.toString())
        );
        setAnnouncements(filteredAnnouncements);
      } catch (error) {
        console.error("Lỗi khi tải thông báo:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (studentId) fetchData();
  }, [studentId]);

  const filteredAnnouncements = announcements.filter((a) => {
    const matchClass = selectedClass ? a.class?._id === selectedClass : true;
    const matchSearch = a.title
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    return matchClass && matchSearch;
  });

  return (
    <div className="p-8 min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-6xl mx-auto bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-blue-700 dark:text-blue-400 flex items-center gap-2">
            <FaBell /> Thông báo của tôi
          </h1>
        </div>

        <div className="flex flex-wrap items-center gap-3 mb-6">
          <div className="flex items-center border dark:border-gray-600 rounded-lg px-3 py-2 bg-gray-50 dark:bg-gray-700 flex-1">
            <FaSearch className="text-gray-400 dark:text-gray-500 mr-2" />
            <input
              type="text"
              placeholder="Tìm kiếm theo tiêu đề..."
              className="w-full bg-transparent outline-none text-gray-700 dark:text-gray-200 placeholder:text-gray-400 dark:placeholder:text-gray-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <select
            value={selectedClass}
            onChange={(e) => setSelectedClass(e.target.value)}
            className="border dark:border-gray-600 rounded-lg px-3 py-2 text-gray-700 dark:text-gray-200 bg-gray-50 dark:bg-gray-700 focus:ring-2 focus:ring-blue-400"
          >
            <option value="">Tất cả lớp</option>
            {classes.map((cls) => (
              <option key={cls._id} value={cls._id}>
                {cls.name}
              </option>
            ))}
          </select>
        </div>

        {isLoading ? (
          <div className="w-full">
            <NotificationSkeleton />
            <NotificationSkeleton />
            <NotificationSkeleton />
          </div>
        ) : filteredAnnouncements.length === 0 ? (
          <p className="text-center text-gray-500 dark:text-gray-400 py-10">
            Không có thông báo nào phù hợp.
          </p>
        ) : (
          <div className="w-full space-y-4">
            {filteredAnnouncements.map((ann) => (
              <NotificationItem key={ann._id} data={ann} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
