import { useEffect, useState } from "react";
import {
  FaChevronDown,
  FaChevronUp,
  FaChalkboardTeacher,
  FaClock,
  FaBell,
  FaDownload,
} from "react-icons/fa";
import { userService } from "../../services/userService";
import formatDateTime from "../../utils/formatDateTime";
import { useNavigate } from "react-router-dom";

export default function NotificationItem({ data }) {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [teacher, setTeacher] = useState(null);
  useEffect(() => {
    const fetchUser = async () => {
      setTeacher(await userService.getUserById(data.created_by?._id));
    };
    fetchUser();
  }, [data]);
  return (
    <div
      className={`w-full bg-white my-2 border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden ${
        isOpen ? "ring-1 ring-blue-200" : ""
      }`}
    >
      <div
        className="flex items-center justify-between px-5 pt-4 cursor-pointer"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex flex-col sm:flex-row sm:items-center sm:gap-6 text-gray-800">
          <FaBell className="text-blue-500 text-lg" />{" "}
          <h3 className="font-semibold text-lg truncate">{data.title}</h3>
        </div>

        <div className="flex items-center gap-3 text-gray-500 text-sm">
          <FaClock className="text-blue-400" />
          <span>{formatDateTime(data.createdAt)}</span>
          {isOpen ? (
            <FaChevronUp className="text-gray-600" />
          ) : (
            <FaChevronDown className="text-gray-600" />
          )}
        </div>
      </div>

      <div
        onClick={() => navigate(`/home/class-details/${data.class._id}`)}
        className={`px-5 pb-4 text-gray-700 text-sm transition-all duration-300 cursor-pointer ${
          isOpen ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"
        } overflow-hidden`}
      >
        <p className="my-4 mt-8">{data.content}</p>
        {data.file_url && (
          <a
            href={data.file_url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:underline flex items-center gap-2 mt-2 inline-block font-medium group mb-4"
          >
            <FaDownload className="group-hover:animate-bounce" />
            {data.file_name.split(".")[0] || "Tệp đính kèm"}
          </a>
        )}
        <div className="flex justify-between items-center text-gray-500 text-xs border-t pt-2">
          <span>
            <strong>Giảng viên:</strong> {teacher?.full_name || "Ẩn danh"}
          </span>
          <span>
            <strong>Lớp:</strong> {data.class?.name || "Ẩn danh"}
          </span>
          <span>
            <strong>Cập nhật:</strong> {formatDateTime(data.updatedAt)}
          </span>
        </div>
      </div>
    </div>
  );
}
