import { useState } from "react";
import { Outlet, useNavigate, useLocation, Link } from "react-router-dom";
import {
    FaBars,
    FaChartPie,
    FaUsers,
    FaBell,
    FaCog,
    FaChevronLeft,
    FaSearch,
} from "react-icons/fa";
import { MdOutlineChatBubbleOutline } from "react-icons/md";
import { MdOutlineLibraryBooks } from "react-icons/md";
import { FaRegClock } from "react-icons/fa6";
import { CiLogout } from "react-icons/ci";
import { ToastContainer } from "react-toastify";
import { SiGoogleclassroom } from "react-icons/si";
import { authService } from "../services/authService";
import { LoadingProvider } from "../context/LoadingContext";
import LoaderOverlay from "../components/LoaderOverlay";
import MessageCall from "../components/MessageCall";

function AdminLayout() {
    const [open, setOpen] = useState(true);
    const [showProfileMenu, setShowProfileMenu] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();
    const targetUser = {
        email: "50000000@tdtu.edu.vn",
        name: "Quản trị viên ",
    }
    const handlerLogout = async () => {
        await authService.logout();
        navigate("/", { state: { isLogin: false } });
    };

    const menuItems = [
        { path: "/admin", icon: FaChartPie, label: "Dashboard", exact: true },
        { path: "/admin/semesters", icon: FaRegClock, label: "Học kỳ" },
        { path: "/admin/courses", icon: MdOutlineLibraryBooks, label: "Môn học" },
        { path: "/admin/classes", icon: SiGoogleclassroom, label: "Lớp học" },
        { path: "/admin/users", icon: FaUsers, label: "Người dùng" },
        { path: "/admin/chats", icon: MdOutlineChatBubbleOutline, label: "Hỗ trợ" },
    ];

    const isActive = (path, exact = false) => {
        if (exact) {
            return location.pathname === path;
        }
        return location.pathname.startsWith(path);
    };

    return (
        <LoadingProvider>

            <div className="flex h-screen bg-gradient-to-br from-gray-50 via-purple-50 to-indigo-50">

                <div
                    className={`bg-white shadow-2xl text-gray-800 transition-all duration-300 flex flex-col border-r border-gray-200 ${open ? "w-72" : "w-20"
                        }`}
                >

                    <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 px-4 py-5 border-b border-white/20">
                        <div className="flex items-center justify-between">
                            {open && (
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center shadow-lg">
                                        <FaChartPie className="text-indigo-600 text-xl" />
                                    </div>
                                    <div>
                                        <h1 className="font-bold text-lg text-white">E-Learning</h1>
                                        <p className="text-xs text-indigo-100">Admin Dashboard</p>
                                    </div>
                                </div>
                            )}
                            <button
                                onClick={() => setOpen(!open)}
                                className="p-2 hover:bg-white/20 rounded-lg transition-colors text-white ml-auto"
                                title={open ? "Thu gọn" : "Mở rộng"}
                            >
                                {open ? <FaChevronLeft /> : <FaBars />}
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
                                            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group relative ${active
                                                ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-200"
                                                : "text-gray-600 hover:bg-indigo-50 hover:text-indigo-600"
                                                }`}
                                        >
                                            <Icon
                                                className={`text-xl ${active
                                                    ? "text-white"
                                                    : "text-gray-500 group-hover:text-indigo-600"
                                                    }`}
                                            />
                                            {open && <span className="font-medium">{item.label}</span>}
                                            {active && open && (
                                                <div className="absolute right-4 w-2 h-2 bg-white rounded-full"></div>
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
                            className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-red-600 hover:bg-red-50 transition-all duration-200 group"
                        >
                            <CiLogout className="text-xl" />
                            {open && <span className="font-medium">Đăng xuất</span>}
                        </button>
                    </div>
                </div>


                <div className="flex-1 flex flex-col min-w-0 overflow-hidden">

                    <header className="bg-white shadow-md border-b border-gray-200 sticky top-0 z-40">
                        <div className="flex justify-between items-center px-6 py-4">

                            <div className="flex items-center gap-4 flex-1 max-w-2xl">
                                <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent whitespace-nowrap">
                                    Quản trị hệ thống
                                </h1>
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
                            <LoaderOverlay />
                            <MessageCall target={targetUser} />
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
        </LoadingProvider>
    );
}

export default AdminLayout;