import { Link } from "react-router-dom";
import {
  FaVideo,
  FaClipboardList,
  FaFileSignature,
  FaFileUpload,
  FaBell,
  FaPlayCircle,
  FaBook,
} from "react-icons/fa";

export default function ClassNavigation({ id }) {
  const navItems = [
    {
      to: `/meet-room/${id}`,
      label: "Phòng học Online",
      icon: FaVideo,
      color: "text-red-600",
      bg: "bg-red-50",
      border: "hover:border-red-200",
    },
    {
      to: `/teacher/class-details/${id}/assignments`,
      label: "Bài tập",
      icon: FaBook,
      color: "text-blue-600",
      bg: "bg-blue-50",
      border: "hover:border-blue-200",
    },
    {
      to: `/teacher/class-details/${id}/attendance`,
      label: "Điểm danh",
      icon: FaClipboardList,
      color: "text-green-600",
      bg: "bg-green-50",
      border: "hover:border-green-200",
    },
    {
      to: `/teacher/class-details/${id}/tests`,
      label: "Bài thi",
      icon: FaFileSignature,
      color: "text-orange-600",
      bg: "bg-orange-50",
      border: "hover:border-orange-200",
    },
    {
      to: `/teacher/class-details/${id}/submissions`,
      label: "Bài nộp",
      icon: FaFileUpload,
      color: "text-indigo-600",
      bg: "bg-indigo-50",
      border: "hover:border-indigo-200",
    },
    {
      to: `/teacher/class-details/${id}/notifications`,
      label: "Thông báo",
      icon: FaBell,
      color: "text-yellow-600",
      bg: "bg-yellow-50",
      border: "hover:border-yellow-200",
    },
    {
      to: `/teacher/class-details/${id}/recordings`,
      label: "Bài giảng",
      icon: FaPlayCircle,
      color: "text-rose-600",
      bg: "bg-rose-50",
      border: "hover:border-rose-200",
    },
  ];

  return (
    <div className="p-4 pb-6">
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7 gap-4">
        {navItems.map((item, index) => {
          const Icon = item.icon;
          return (
            <Link
              key={index}
              to={item.to}
              className={`
                group flex flex-col items-center justify-center p-4 
                bg-white rounded-2xl border border-gray-100 shadow-sm
                transition-all duration-300 ease-in-out
                hover:-translate-y-1 hover:shadow-md ${item.border}
              `}
            >
              <div
                className={`
                  mb-3 p-3 rounded-full transition-colors duration-300
                  ${item.bg} ${item.color} group-hover:scale-110
                `}
              >
                <Icon size={20} />
              </div>

              <span className="text-sm font-semibold text-gray-600 group-hover:text-gray-900 text-center">
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
