import { Outlet, Link } from "react-router-dom";
import {
    FaChalkboardTeacher,
    FaBookOpen,
    FaClipboardCheck,
    FaFileAlt,
    FaTachometerAlt,
    FaSignOutAlt,
    FaBars,
} from "react-icons/fa";
import { useState } from "react";
import { IoCalendarOutline } from "react-icons/io5";
export default function TeacherLayout() {
    const [isCollapsed, setIsCollapsed] = useState(false);

    return (
        <div className="flex min-h-screen bg-gray-100">
            <aside
                className={`${isCollapsed ? "w-20" : "w-64"
                    } bg-white shadow-lg p-4 flex flex-col transition-all duration-300`}
            >
                <button
                    onClick={() => setIsCollapsed(!isCollapsed)}
                    className="flex items-center space-x-2 hover:bg-gray-100 p-2 rounded mb-4"
                >
                    <FaBars />
                    {!isCollapsed && <span>Thu gọn</span>}
                </button>

                <ul className="space-y-3 flex-1">
                    <li>
                        <Link
                            to="/teacher"
                            className="flex items-center space-x-2 hover:bg-gray-100 p-2 rounded"
                        >
                            <FaTachometerAlt />
                            {!isCollapsed && <span>Dashboard</span>}
                        </Link>
                    </li>
                    <li>
                        <Link
                            to="/teacher/schedule"
                            className="flex items-center space-x-2 hover:bg-gray-100 p-2 rounded"
                        > 
                        <IoCalendarOutline />
                            {!isCollapsed && <span>Lịch dạy</span>}
                        </Link>
                    </li>
                    <li>
                        <Link
                            to="/teacher/classes"
                            className="flex items-center space-x-2 hover:bg-gray-100 p-2 rounded"
                        >
                            <FaChalkboardTeacher />
                            {!isCollapsed && <span>Lớp học</span>}
                        </Link>
                    </li>
                    <li>
                        <Link
                            to="/teacher/assignments"
                            className="flex items-center space-x-2 hover:bg-gray-100 p-2 rounded"
                        >
                            <FaBookOpen />
                            {!isCollapsed && <span>Bài tập</span>}
                        </Link>
                    </li>
                    <li>
                        <Link
                            to="/teacher/attendances"
                            className="flex items-center space-x-2 hover:bg-gray-100 p-2 rounded"
                        >
                            <FaClipboardCheck />
                            {!isCollapsed && <span>Điểm danh</span>}
                        </Link>
                    </li>
                    <li>
                        <Link
                            to="/teacher/submissions"
                            className="flex items-center space-x-2 hover:bg-gray-100 p-2 rounded"
                        >
                            <FaFileAlt />
                            {!isCollapsed && <span>Bài nộp</span>}
                        </Link>
                    </li>
                </ul>

                <div>
                    <button className="flex items-center space-x-2 w-full hover:bg-gray-100 p-2 rounded text-red-600">
                        <FaSignOutAlt />
                        {!isCollapsed && <span>Đăng xuất</span>}
                    </button>
                </div>
            </aside>

            <div className="flex-1 flex flex-col">
                <header className="bg-white shadow p-4 flex justify-between items-center">
                    <h1 className="text-lg font-bold">Hệ thống E-learning</h1>
                    <div className="flex items-center space-x-3">
                        <span className="font-medium">GV: Nguyễn Văn A</span>
                        <img
                            src="https://static.vecteezy.com/system/resources/previews/019/879/186/large_2x/user-icon-on-transparent-background-free-png.png"
                            alt="avatar"
                            className="rounded-full w-16 h-10"
                        />
                    </div>
                </header>

                <main className="p-6 flex-1">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}
