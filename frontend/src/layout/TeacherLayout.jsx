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
import { MdOutlineRecordVoiceOver } from "react-icons/md";
import { useEffect, useState } from "react";
import { IoCalendarOutline } from "react-icons/io5";
import { ToastContainer } from "react-toastify";
import { authService } from "../services/authService";
import { userService } from "../services/userService";
import { LoadingProvider } from "../context/LoadingContext";
import LoaderOverlay from "../components/UI/LoaderOverlay";
import {
  MdChecklistRtl,
  MdOutlineChatBubbleOutline,
  MdOutlineForum,
} from "react-icons/md";
import SupportWidget from "../components/Common/SupportedWidget";
import DarkModeButton from "../components/Common/DarkModeButton";

export default function TeacherLayout() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const targetUser = {
    email: "50000000@tdtu.edu.vn",
    name: "Quản trị viên",
  };
  const handlerLogout = async () => {
    await authService.logout();
    navigate("/", { state: { isLogin: false } });
  };
  const teacherId = sessionStorage
    .getItem("userId")
    .split('"')
    .join("")
    .toString();
  const [teacherInfo, setTeacherInfo] = useState(null);
  const menuItems = [
    {
      path: "/teacher",
      icon: FaTachometerAlt,
      label: "Dashboard",
      exact: true,
    },
    { path: "/teacher/schedule", icon: IoCalendarOutline, label: "Lịch dạy" },
    { path: "/teacher/classes", icon: FaChalkboardTeacher, label: "Lớp học" },
    { path: "/teacher/assignments", icon: FaBookOpen, label: "Bài tập" },
    { path: "/teacher/tests", icon: MdChecklistRtl, label: "Bài thi" },
    {
      path: "/teacher/attendances",
      icon: FaClipboardCheck,
      label: "Điểm danh",
    },
    { path: "/teacher/submissions", icon: FaFileAlt, label: "Bài nộp" },
    {
      path: "/teacher/recordings",
      icon: MdOutlineRecordVoiceOver,
      label: "Tóm tắt bài học trực tuyến",
    },
    { path: "/teacher/notifications", icon: FaBell, label: "Thông báo" },
    { path: "/teacher/forum", icon: MdOutlineForum, label: "Diễn đàn" },
    {
      path: "/teacher/chat",
      icon: MdOutlineChatBubbleOutline,
      label: "Quản lý chat",
    },
  ];
  useEffect(() => {
    const fetchTeacherInfo = async () => {
      setTeacherInfo(await userService.getUserById(teacherId));
    };
    fetchTeacherInfo();
  }, []);
  const isActive = (path, exact = false) => {
    if (exact) {
      return location.pathname === path;
    }
    return location.pathname.startsWith(path);
  };

  return (
    <LoadingProvider>
      <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900">
        <aside
          className={`${
            isCollapsed ? "w-20" : "w-72"
          } bg-white dark:bg-gray-800 shadow-2xl flex flex-col transition-all duration-300 relative border-r border-gray-200 dark:border-gray-700`}
        >
          <div className="p-6 border-b border-gray-200 dark:border-gray-700 bg-blue-600 dark:bg-blue-700">
            <div className="flex items-center justify-between">
              {!isCollapsed && (
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
                    <FaChalkboardTeacher className="text-blue-600 text-xl" />
                  </div>
                  <div>
                    <h2 className="text-white font-bold text-lg">E-Learning</h2>
                    <p className="text-blue-100 text-xs">
                      Giảng viên VoIP Tools
                    </p>
                  </div>
                </div>
              )}
              <button
                onClick={() => setIsCollapsed(!isCollapsed)}
                className="p-2 hover:bg-white/20 dark:hover:bg-white/10 rounded-lg transition-colors text-white"
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
                      className={`flex items-center gap-3 p-3 rounded-xl transition-all duration-200 group relative ${
                        active
                          ? "bg-blue-600 dark:bg-blue-700 text-white shadow-lg"
                          : "text-gray-600 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-gray-700 hover:text-blue-600 dark:hover:text-blue-400"
                      }`}
                    >
                      <Icon
                        className={`text-xl ${
                          active
                            ? "text-white"
                            : "text-gray-500 dark:text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-400"
                        }`}
                      />
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

          <div className="p-4 border-t border-gray-200 dark:border-gray-700">
            <button
              onClick={handlerLogout}
              className="flex items-center gap-3 w-full p-3 rounded-xl text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all duration-200 group"
            >
              <FaSignOutAlt className="text-xl" />
              {!isCollapsed && <span className="font-medium">Đăng xuất</span>}
            </button>
          </div>
        </aside>

        <div className="flex-1 flex flex-col min-w-0">
          <header className="bg-white dark:bg-gray-800 shadow-md border-b border-gray-200 dark:border-gray-700 sticky top-0 z-40">
            <div className="flex justify-between items-center px-6 py-4">
              <div className="flex items-center gap-4 flex-1 max-w-xl">
                <h1 className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                  Hệ thống E-learning
                </h1>
              </div>

              <div className="flex items-center gap-4">
                <DarkModeButton />
                <div className="relative">
                  <button
                    onClick={() => setShowProfileMenu(!showProfileMenu)}
                    className="flex items-center gap-3 p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl transition-colors"
                  >
                    <div className="text-right hidden md:block">
                      <p className="text-sm font-semibold text-gray-800 dark:text-white">
                        {teacherInfo?.full_name}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        Giảng viên
                      </p>
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
                    <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-800 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 py-2 z-50">
                      <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-700">
                        <p className="text-sm font-semibold text-gray-800 dark:text-white">
                          {teacherInfo?.full_name}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {teacherInfo?.email}
                        </p>
                      </div>
                      <button
                        onClick={() => {
                          setShowProfileMenu(false);
                        }}
                        className="w-full text-left px-4 py-2 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-sm text-gray-700 dark:text-gray-300"
                      >
                        Thông tin cá nhân
                      </button>
                      <button
                        onClick={() => {
                          setShowProfileMenu(false);
                        }}
                        className="w-full text-left px-4 py-2 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-sm text-gray-700 dark:text-gray-300"
                      >
                        Cài đặt
                      </button>
                      <div className="border-t border-gray-100 dark:border-gray-700 mt-2 pt-2">
                        <button
                          onClick={() => {
                            setShowProfileMenu(false);
                            handlerLogout();
                          }}
                          className="w-full text-left px-4 py-2 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors text-sm text-red-600 dark:text-red-400 font-medium"
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
            <div className="">
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
              <SupportWidget targetUser={targetUser} />
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
