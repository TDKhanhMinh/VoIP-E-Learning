import { Outlet, useNavigate, useLocation } from "react-router-dom";
import Button from "../components/UI/Button";
import { ToastContainer } from "react-toastify";
import Tippy from "@tippyjs/react/headless";
import "tippy.js/dist/tippy.css";
import { IoHomeOutline } from "react-icons/io5";
import { MdLogout } from "react-icons/md";
import { BsGrid3X3GapFill } from "react-icons/bs";
import { useEffect, useState } from "react";
import { enrollmentService } from "../services/enrollmentService";
import {
  FaChevronLeft,
  FaBars,
  FaBook,
  FaChalkboardTeacher,
  FaCalendarAlt,
  FaBell,
  FaCog,
  FaUserGraduate,
} from "react-icons/fa";
import { authService } from "../services/authService";
import { userService } from "../services/userService";
import LoaderOverlay from "../components/UI/LoaderOverlay";
import { LoadingProvider } from "../context/LoadingContext";
import DarkModeButton from "./../components/Common/DarkModeButton";

function HomeworkLayout() {
  const [userClass, setUserClass] = useState([]);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const [userInfo, setUserInfo] = useState();

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
  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    setIsLoading(true);
    try {
      const userId = sessionStorage
        .getItem("userId")
        ?.split('"')
        .join("")
        .toString();
      const userEnrolledClasses =
        await enrollmentService.getAllEnrollmentsByStudentId(userId);
      setUserClass(userEnrolledClasses);
      console.log(userEnrolledClasses);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handlerLogout = async () => {
    await authService.logout();
    navigate("/", { state: { isLogin: false } });
  };

  const isActive = (path) => {
    return (
      location.pathname === path || location.pathname.startsWith(path + "/")
    );
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

            <div className="px-4 border-b border-gray-200">
              <Button to="/home">
                <div
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                    isActive("/home")
                      ? "bg-blue-600 text-white shadow-lg"
                      : "text-gray-600 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-gray-700 hover:text-blue-600 dark:hover:text-blue-400"
                  }`}
                >
                  <IoHomeOutline className="text-xl" />
                  {!isCollapsed && (
                    <span className="font-medium">Trang chủ</span>
                  )}
                </div>
              </Button>
            </div>

            <div className="flex-1 overflow-y-auto">
              {!isCollapsed && (
                <div className="px-4 py-3 bg-blue-50 dark:bg-gray-700 border-b border-blue-100 dark:border-gray-600">
                  <div className="flex items-center gap-2 text-purple-700 dark:text-purple-400">
                    <FaCalendarAlt className="text-sm" />
                    <span className="font-semibold text-sm">
                      Tất cả môn học
                    </span>
                  </div>
                </div>
              )}

              <div className="p-4">
                {isLoading ? (
                  <div className="flex justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                  </div>
                ) : userClass?.length > 0 ? (
                  <ul className="">
                    {userClass.map((item, index) => {
                      const classActive = isActive(
                        `/course/homework/${item.class._id}`
                      );
                      return (
                        <li className="py-0 my-0 h-16" key={index}>
                          <Tippy
                            content={
                              <div className="text-sm">
                                <div className="font-bold text-white max-w-[200px] truncate">
                                  {item.class.name}
                                </div>
                                <div className="flex items-center gap-2 text-blue-200 mb-1">
                                  <FaBook className="text-xs" />
                                  <span>{item.class.course.code || "N/A"}</span>
                                </div>
                                <div className="flex items-center gap-2 text-blue-200">
                                  <FaChalkboardTeacher className="text-xs" />
                                  <span>
                                    GV: {item.class.teacher.full_name || "N/A"}
                                  </span>
                                </div>
                              </div>
                            }
                            placement="right"
                            theme="light"
                            arrow={true}
                            disabled={!isCollapsed}
                          >
                            <Button
                              to={`/course/homework/${item.class._id}`}
                              className="w-full py-0"
                            >
                              <div
                                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${
                                  classActive
                                    ? "bg-green-600 text-white shadow-lg"
                                    : "text-gray-600 dark:text-gray-300 hover:bg-green-50 dark:hover:bg-gray-700 hover:text-green-600 dark:hover:text-green-400"
                                }`}
                              >
                                <BsGrid3X3GapFill
                                  className={`text-lg shrink-0 ${
                                    classActive
                                      ? "text-white"
                                      : "text-gray-500 dark:text-gray-400 group-hover:text-green-600 dark:group-hover:text-green-400"
                                  }`}
                                />

                                {!isCollapsed && (
                                  <div className="flex-1 text-left min-w-0">
                                    <p className="font-medium text-sm truncate">
                                      {item.class.name}
                                    </p>
                                    <p
                                      className={`text-xs truncate ${
                                        classActive
                                          ? "text-green-100"
                                          : "text-gray-500 dark:text-gray-400"
                                      }`}
                                    >
                                      {item.class.course?.code || ""}
                                    </p>
                                  </div>
                                )}

                                {classActive && !isCollapsed && (
                                  <div className="w-2 h-2 bg-white rounded-full shrink-0"></div>
                                )}
                              </div>
                            </Button>
                          </Tippy>
                        </li>
                      );
                    })}
                  </ul>
                ) : (
                  !isCollapsed && (
                    <div className="text-center py-8 px-4">
                      <FaBook className="text-4xl text-gray-300 dark:text-gray-600 mx-auto mb-3" />
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Chưa có lớp học nào
                      </p>
                    </div>
                  )
                )}
              </div>
            </div>

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
              <button onClick={handlerLogout}>
                <div className="flex items-center gap-3 px-4 py-3 rounded-xl text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-gray-700 transition-all duration-200 font-medium">
                  <MdLogout className="text-xl" />
                  {!isCollapsed && <span>Đăng xuất</span>}
                </div>
              </button>
            </div>
          </aside>

          <section className="flex-1 flex flex-col overflow-hidden">
            <div className="bg-white dark:bg-gray-800 shadow-md border-b border-gray-200 dark:border-gray-700 sticky top-0 z-40">
              <div className="flex items-center justify-between px-6 py-4">
                <h1 className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                  Quản lý bài tập
                </h1>

                <div className="flex items-center gap-4">
                  <button className="relative p-2.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl transition-colors group">
                    <FaBell className="text-gray-600 dark:text-gray-300 text-xl group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors" />
                    <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white"></span>
                  </button>

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
                          <p className="text-sm font-semibold text-gray-800 dark:text-white">
                            {userInfo?.full_name}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            {userInfo?.email}
                          </p>
                        </div>
                        <button className="w-full text-left px-4 py-2.5 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-sm text-gray-700 dark:text-gray-300">
                          Thông tin cá nhân
                        </button>
                        <button className="w-full text-left px-4 py-2.5 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-sm text-gray-700 dark:text-gray-300">
                          Cài đặt
                        </button>
                        <div className="border-t border-gray-100 dark:border-gray-700 mt-2 pt-2">
                          <button
                            onClick={handlerLogout}
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
            </main>

            <footer className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 px-6 py-3">
              <div className="flex flex-col md:flex-row justify-between items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                <p>© 2025 E-Learning System. All rights reserved.</p>
                <div className="flex gap-4">
                  <a
                    href="#"
                    className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                  >
                    Trợ giúp
                  </a>
                  <a
                    href="#"
                    className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                  >
                    Hướng dẫn
                  </a>
                  <a
                    href="#"
                    className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                  >
                    Liên hệ
                  </a>
                </div>
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

export default HomeworkLayout;
