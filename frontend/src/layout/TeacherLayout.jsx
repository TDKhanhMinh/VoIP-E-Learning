import { Outlet, Link, useNavigate, useLocation } from "react-router-dom";
import {
    FaChalkboardTeacher,
    FaBookOpen,
    FaClipboardCheck,
    FaFileAlt,
    FaTachometerAlt,
    FaSignOutAlt,
    FaBars,
    FaBell,
    FaCog,
    FaChevronLeft,
} from "react-icons/fa";
import { useState } from "react";
import { IoCalendarOutline } from "react-icons/io5";
import { ToastContainer } from "react-toastify";
import { authService } from "../services/authService";

export default function TeacherLayout() {
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [showProfileMenu, setShowProfileMenu] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();

    const handlerLogout = async () => {
        await authService.logout();
        navigate("/", { state: { isLogin: false } });
    };

    const menuItems = [
        { path: "/teacher", icon: FaTachometerAlt, label: "Dashboard", exact: true },
        { path: "/teacher/schedule", icon: IoCalendarOutline, label: "Lịch dạy" },
        { path: "/teacher/classes", icon: FaChalkboardTeacher, label: "Lớp học" },
        { path: "/teacher/assignments", icon: FaBookOpen, label: "Bài tập" },
        { path: "/teacher/attendances", icon: FaClipboardCheck, label: "Điểm danh" },
        { path: "/teacher/submissions", icon: FaFileAlt, label: "Bài nộp" },
    ];

    const isActive = (path, exact = false) => {
        if (exact) {
            return location.pathname === path;
        }
        return location.pathname.startsWith(path);
    };

    return (
        <div className="flex min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50">
            
            <aside
                className={`${isCollapsed ? "w-20" : "w-72"
                    } bg-white shadow-2xl flex flex-col transition-all duration-300 relative border-r border-gray-200`}
            >
                
                <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-blue-600 to-indigo-600">
                    <div className="flex items-center justify-between">
                        {!isCollapsed && (
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
                                    <FaChalkboardTeacher className="text-blue-600 text-xl" />
                                </div>
                                <div>
                                    <h2 className="text-white font-bold text-lg">E-Learning</h2>
                                    <p className="text-blue-100 text-xs">Teacher Portal</p>
                                </div>
                            </div>
                        )}
                        <button
                            onClick={() => setIsCollapsed(!isCollapsed)}
                            className="p-2 hover:bg-white/20 rounded-lg transition-colors text-white"
                            title={isCollapsed ? "Mở rộng" : "Thu gọn"}
                        >
                            {isCollapsed ? <FaBars /> : <FaChevronLeft />}
                        </button>
                    </div>
                </div>

                
                <nav className="flex-1 p-4 overflow-y-auto">
                    <ul className="space-y-2">
                        {menuItems.map((item) => {
                            const Icon = item.icon;
                            const active = isActive(item.path, item.exact);

                            return (
                                <li key={item.path}>
                                    <Link
                                        to={item.path}
                                        className={`flex items-center gap-3 p-3 rounded-xl transition-all duration-200 group relative ${active
                                                ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg"
                                                : "text-gray-600 hover:bg-blue-50 hover:text-blue-600"
                                            }`}
                                    >
                                        <Icon className={`text-xl ${active ? "text-white" : "text-gray-500 group-hover:text-blue-600"}`} />
                                        {!isCollapsed && (
                                            <span className="font-medium">{item.label}</span>
                                        )}
                                        {active && !isCollapsed && (
                                            <div className="absolute right-3 w-2 h-2 bg-white rounded-full"></div>
                                        )}
                                    </Link>
                                </li>
                            );
                        })}
                    </ul>
                </nav>

                
                <div className="p-4 border-t border-gray-200">
                    <button
                        onClick={handlerLogout}
                        className="flex items-center gap-3 w-full p-3 rounded-xl text-red-600 hover:bg-red-50 transition-all duration-200 group"
                    >
                        <FaSignOutAlt className="text-xl" />
                        {!isCollapsed && <span className="font-medium">Đăng xuất</span>}
                    </button>
                </div>
            </aside>

            
            <div className="flex-1 flex flex-col min-w-0">
                
                <header className="bg-white shadow-md border-b border-gray-200 sticky top-0 z-40">
                    <div className="flex justify-between items-center px-6 py-4">
                        
                        <div className="flex items-center gap-4 flex-1 max-w-xl">
                            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                                Hệ thống E-learning
                            </h1>
                        </div>

                        
                        <div className="flex items-center gap-4">
                            
                            <button className="relative p-2.5 hover:bg-gray-100 rounded-xl transition-colors group">
                                <FaBell className="text-gray-600 text-xl group-hover:text-blue-600 transition-colors" />
                                <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white"></span>
                            </button>

                            
                            <button className="p-2.5 hover:bg-gray-100 rounded-xl transition-colors group">
                                <FaCog className="text-gray-600 text-xl group-hover:text-blue-600 transition-colors" />
                            </button>

                            
                            <div className="relative">
                                <button
                                    onClick={() => setShowProfileMenu(!showProfileMenu)}
                                    className="flex items-center gap-3 p-2 hover:bg-gray-100 rounded-xl transition-colors"
                                >
                                    <div className="text-right hidden md:block">
                                        <p className="text-sm font-semibold text-gray-800">Nguyễn Văn A</p>
                                        <p className="text-xs text-gray-500">Giảng viên</p>
                                    </div>
                                    <div className="relative">
                                        <img
                                            src="https://static.vecteezy.com/system/resources/previews/019/879/186/large_2x/user-icon-on-transparent-background-free-png.png"
                                            alt="avatar"
                                            className="w-11 h-11 rounded-full border-2 border-blue-200 object-cover"
                                        />
                                        <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                                    </div>
                                </button>

                                
                                {showProfileMenu && (
                                    <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-2xl border border-gray-200 py-2 z-50">
                                        <div className="px-4 py-3 border-b border-gray-100">
                                            <p className="text-sm font-semibold text-gray-800">Nguyễn Văn A</p>
                                            <p className="text-xs text-gray-500">nguyenvana@email.com</p>
                                        </div>
                                        <button
                                            onClick={() => {
                                                setShowProfileMenu(false);
                                                // Navigate to profile
                                            }}
                                            className="w-full text-left px-4 py-2 hover:bg-gray-50 transition-colors text-sm text-gray-700"
                                        >
                                            Thông tin cá nhân
                                        </button>
                                        <button
                                            onClick={() => {
                                                setShowProfileMenu(false);
                                                // Navigate to settings
                                            }}
                                            className="w-full text-left px-4 py-2 hover:bg-gray-50 transition-colors text-sm text-gray-700"
                                        >
                                            Cài đặt
                                        </button>
                                        <div className="border-t border-gray-100 mt-2 pt-2">
                                            <button
                                                onClick={() => {
                                                    setShowProfileMenu(false);
                                                    handlerLogout();
                                                }}
                                                className="w-full text-left px-4 py-2 hover:bg-red-50 transition-colors text-sm text-red-600 font-medium"
                                            >
                                                Đăng xuất
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </header>

                
                <main className="flex-1 overflow-y-auto">
                    <div className="p-6">
                        <ToastContainer
                            position="top-right"
                            autoClose={3000}
                            hideProgressBar={false}
                            newestOnTop={true}
                            closeOnClick
                            pauseOnHover
                            draggable
                            theme="colored"
                        />
                        <Outlet />
                    </div>
                </main>
            </div>
            {showProfileMenu && (
                <div
                    className="fixed inset-0 z-30"
                    onClick={() => setShowProfileMenu(false)}
                ></div>
            )}
        </div>
    );
}