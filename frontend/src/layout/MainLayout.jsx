import { useEffect, useState } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { authService } from "../services/authService";
import { SIDEBAR_DATA } from "./../assets/sidebar-data";
import Button from "../components/UI/Button";
import { FaBars, FaBell, FaChevronLeft, FaCog } from "react-icons/fa";
import { MdLogout } from "react-icons/md";
import { ToastContainer } from "react-toastify";
import { userService } from "../services/userService";
import { LoadingProvider } from "../context/LoadingContext";
import LoaderOverlay from "../components/UI/LoaderOverlay";
import SupportWidget from "../components/Common/SupportedWidget";
import DarkModeButton from "./../components/Common/DarkModeButton";

function MainLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [userInfo, setUserInfo] = useState();
  const targetUser = {
    email: "50000000@tdtu.edu.vn",
    name: "Quản trị viên ",
  };
  useEffect(() => {
    const fetchUserDetails = async () => {
      setUserInfo(
        await userService.getUserById(
          sessionStorage.getItem("userId").split('"').join("").toString()
        )
      );
      console.log(
        await userService.getUserById(sessionStorage.getItem("userId"))
      );
    };
    fetchUserDetails();
  }, []);
  const isActive = (path) => {
    return (
      location.pathname === path || location.pathname.startsWith(path + "/")
    );
  };
  const handlerLogout = async () => {
    await authService.logout();
    navigate("/", { state: { isLogin: false } });
  };
  return (
    <LoadingProvider>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="flex h-screen overflow-hidden">
          <aside
            className={`${
              isCollapsed ? "w-20" : "w-72"
            } bg-white dark:bg-gray-800 shadow-2xl flex flex-col transition-all duration-300 border-r border-gray-200 dark:border-gray-700`}
          >
            <div className="bg-blue-600 h-16 flex items-center justify-between px-4 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full -ml-12 -mb-12"></div>

              {!isCollapsed && (
                <div className="flex items-center gap-3 relative z-10">
                  <img
                    className="w-9 h-9 rounded-lg shadow-lg border-2 border-white/30"
                    src="https://www.senviet.art/wp-content/uploads/edd/2021/12/dai-hoc-tdt.jpg"
                    alt="Logo"
                  />
                  <div className="text-white">
                    <h1 className="font-bold text-sm leading-tight">
                      E-Learning
                    </h1>
                    <p className="text-xs text-blue-100">VoIP Tools</p>
                  </div>
                </div>
              )}
              <button
                onClick={() => setIsCollapsed(!isCollapsed)}
                className="p-2 hover:bg-white/20 rounded-lg transition-colors text-white relative z-10"
                title={isCollapsed ? "Mở rộng" : "Thu gọn"}
              >
                {isCollapsed ? <FaBars /> : <FaChevronLeft />}
              </button>
            </div>

            <nav className="flex-1 p-4 overflow-y-auto">
              <ul className="space-y-2">
                {SIDEBAR_DATA.map((item, index) => {
                  const Icon = item.icon;
                  const active = isActive(item.to);

                  return (
                    <li key={index}>
                      <Button
                        icon={Icon}
                        to={item.to}
                        className={`w-full rounded-xl font-medium flex items-center gap-3 px-4 py-3 transition-all duration-200 group ${
                          active
                            ? "bg-blue-600 text-white shadow-lg"
                            : "text-gray-600 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-gray-700 hover:text-blue-600 dark:hover:text-blue-400"
                        }`}
                      >
                        {!isCollapsed && (
                          <span className="flex-1 text-left">{item.title}</span>
                        )}
                      </Button>
                    </li>
                  );
                })}
              </ul>
            </nav>

            {!isCollapsed && (
              <div className="p-4 mx-4 mb-4 bg-blue-50 dark:bg-gray-700 rounded-xl border border-blue-100 dark:border-gray-600">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold shadow-lg">
                    {userInfo?.full_name.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-gray-800 dark:text-white text-sm truncate">
                      {userInfo?.full_name}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                      {userInfo?.email}
                    </p>
                  </div>
                </div>
                <div className="pt-3 border-t border-blue-200 dark:border-gray-600">
                  <p className="text-xs text-gray-600 dark:text-gray-300 flex items-center gap-2">
                    <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                    Online
                  </p>
                </div>
              </div>
            )}

            <div className="p-4 border-t border-gray-200 dark:border-gray-700">
              <button
                onClick={handlerLogout}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-gray-700 transition-all duration-200 font-medium group"
              >
                <MdLogout className="text-xl" />
                {!isCollapsed && <span>Đăng xuất</span>}
              </button>
            </div>
          </aside>

          <section className="flex-1 flex flex-col overflow-hidden">
            <div className="bg-white dark:bg-gray-800 shadow-md border-b border-gray-200 dark:border-gray-700 sticky top-0 z-40">
              <div className="flex items-center justify-between px-6 py-4">
                <div className="flex items-center gap-4 flex-1">
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
                          {userInfo?.full_name}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          Sinh viên
                        </p>
                      </div>
                      <div className="relative">
                        <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold shadow-lg">
                          {userInfo?.full_name.charAt(0).toUpperCase()}
                        </div>
                        <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                      </div>
                    </button>

                    {showProfileMenu && (
                      <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-gray-800 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 py-2 z-50">
                        <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-700">
                          <div className="flex items-center gap-3 mb-2">
                            <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold shadow-lg">
                              {userInfo?.full_name.charAt(0).toUpperCase()}
                            </div>
                            <div>
                              <p className="text-sm font-semibold text-gray-800 dark:text-white">
                                {userInfo?.full_name}
                              </p>
                              <p className="text-xs text-gray-500 dark:text-gray-400">
                                {userInfo?.email}
                              </p>
                            </div>
                          </div>
                        </div>
                        <button
                          onClick={() => {
                            setShowProfileMenu(false);
                            navigate("/student/profile");
                          }}
                          className="w-full text-left px-4 py-2.5 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-sm text-gray-700 dark:text-gray-300"
                        >
                          Thông tin cá nhân
                        </button>
                        <button
                          onClick={() => {
                            setShowProfileMenu(false);
                            navigate("/student/settings");
                          }}
                          className="w-full text-left px-4 py-2.5 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-sm text-gray-700 dark:text-gray-300"
                        >
                          Cài đặt
                        </button>
                        <div className="border-t border-gray-100 dark:border-gray-700 mt-2 pt-2">
                          <button
                            onClick={() => {
                              setShowProfileMenu(false);
                              handlerLogout();
                            }}
                            className="w-full text-left px-4 py-2.5 hover:bg-red-50 dark:hover:bg-gray-700 transition-colors text-sm text-red-600 dark:text-red-400 font-medium"
                          >
                            Đăng xuất
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
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
            <main className="flex-1 overflow-y-auto bg-gray-50 dark:bg-gray-900">
              <LoaderOverlay />
              <Outlet />
              <SupportWidget targetUser={targetUser} />
            </main>
            <footer className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 px-6 py-3">
              <div className="flex flex-col md:flex-row justify-between items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                <p>© 2025 E-Learning System. All rights reserved.</p>
              </div>
            </footer>
          </section>
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

export default MainLayout;
