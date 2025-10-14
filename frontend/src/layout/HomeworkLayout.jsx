import { Outlet, useNavigate, useLocation } from "react-router-dom";
import Button from "../components/Button";
import { ToastContainer } from "react-toastify";
import Navbar from "../components/NavBar";
import Tippy from "@tippyjs/react";
import "tippy.js/dist/tippy.css";
import { IoHomeOutline } from "react-icons/io5";
import { MdLogout } from "react-icons/md";
import { BsGrid3X3GapFill } from "react-icons/bs";
import { useEffect, useState } from "react";
import { enrollmentService } from "../services/enrollmentService";
import { FaChevronLeft, FaBars, FaBook, FaChalkboardTeacher, FaCalendarAlt, FaBell, FaCog, FaUserGraduate } from "react-icons/fa";
import { authService } from "../services/authService";
import { userService } from "../services/userService";

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
            setUserInfo(await userService.getUserById(sessionStorage.getItem("userId").split('"').join('').toString()));
            console.log(await userService.getUserById(sessionStorage.getItem("userId")));
        };
        fetchUserDetails();
    }, []);
    useEffect(() => {
        fetchCourses();
    }, []);

    const fetchCourses = async () => {
        setIsLoading(true);
        try {
            const userId = sessionStorage.getItem("userId")?.split('"').join('').toString();
            const userEnrolledClasses = await enrollmentService.getAllEnrollmentsByStudentId(userId);
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
        return location.pathname === path || location.pathname.startsWith(path + '/');
    };

   
    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50">
            <div className="flex h-screen overflow-hidden">

                <aside
                    className={`${isCollapsed ? "w-20" : "w-72"
                        } bg-white shadow-2xl flex flex-col transition-all duration-300 border-r border-gray-200`}
                >

                    <div className="bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 h-16 flex items-center justify-between px-4 relative overflow-hidden">
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
                                    <h1 className="font-bold text-sm leading-tight">E-Learning</h1>
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
                            <div className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${isActive("/home")
                                ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg"
                                : "text-gray-600 hover:bg-blue-50 hover:text-blue-600"
                                }`}>
                                <IoHomeOutline className="text-xl" />
                                {!isCollapsed && <span className="font-medium">Trang chủ</span>}
                            </div>
                        </Button>
                    </div>


                    <div className="flex-1 overflow-y-auto">

                        {!isCollapsed && (
                            <div className="px-4 py-3 bg-gradient-to-r from-purple-50 to-indigo-50 border-b border-purple-100">
                                <div className="flex items-center gap-2 text-purple-700">
                                    <FaCalendarAlt className="text-sm" />
                                    <span className="font-semibold text-sm">HK2-2024/2025</span>
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
                                        const classActive = isActive(`/course/homework/${item.class._id}`);
                                        return (
                                            <li className="py-0 my-0 h-16" key={index}>
                                                <Tippy
                                                    content={
                                                        <div className="text-sm">
                                                            <div className="font-bold text-white">{item.class.name}</div>
                                                            <div className="flex items-center gap-2 text-blue-200 mb-1">
                                                                <FaBook className="text-xs" />
                                                                <span>{item.class.course?.code || "N/A"}</span>
                                                            </div>
                                                            <div className="flex items-center gap-2 text-blue-200">
                                                                <FaChalkboardTeacher className="text-xs" />
                                                                <span>GV: {item.class.teacher?.full_name || "N/A"}</span>
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
                                                        <div className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${classActive
                                                            ? "bg-gradient-to-r from-green-600 to-emerald-600 text-white shadow-lg shadow-green-200"
                                                            : "text-gray-600 hover:bg-green-50 hover:text-green-600"
                                                            }`}>
                                                            <BsGrid3X3GapFill className={`text-lg ${classActive ? "text-white" : "text-gray-500 group-hover:text-green-600"
                                                                }`} />
                                                            {!isCollapsed && (
                                                                <div className="flex-1 text-left">
                                                                    <p className="font-medium text-sm truncate">
                                                                        {item.class.name}
                                                                    </p>
                                                                    <p className={`text-xs truncate ${classActive ? "text-green-100" : "text-gray-500"
                                                                        }`}>
                                                                        {item.class.course?.code || ""}
                                                                    </p>
                                                                </div>
                                                            )}
                                                            {classActive && !isCollapsed && (
                                                                <div className="w-2 h-2 bg-white rounded-full"></div>
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
                                        <FaBook className="text-4xl text-gray-300 mx-auto mb-3" />
                                        <p className="text-sm text-gray-500">Chưa có lớp học nào</p>
                                    </div>
                                )
                            )}
                        </div>
                    </div>


                    {!isCollapsed && (
                        <div className="p-4 mx-4 mb-4 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border border-blue-100">
                            <div className="flex items-center gap-3 mb-3">
                                <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-full flex items-center justify-center text-white font-bold shadow-lg">
                                    {userInfo?.full_name.charAt(0).toUpperCase()}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="font-semibold text-gray-800 text-sm truncate">{userInfo?.full_name}</p>
                                    <p className="text-xs text-gray-500 truncate">{userInfo?.email}</p>
                                </div>
                            </div>
                            <div className="pt-3 border-t border-blue-200">
                                <p className="text-xs text-gray-600 flex items-center gap-2">
                                    <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                                    Online
                                </p>
                            </div>
                        </div>
                    )}


                    <div className="p-4 border-t border-gray-200">
                        <Button onClick={handlerLogout}>
                            <div className="flex items-center gap-3 px-4 py-3 rounded-xl text-red-600 hover:bg-red-50 transition-all duration-200 font-medium">
                                <MdLogout className="text-xl" />
                                {!isCollapsed && <span>Đăng xuất</span>}
                            </div>
                        </Button>
                    </div>
                </aside>


                <section className="flex-1 flex flex-col overflow-hidden">

                    <div className="bg-white shadow-md border-b border-gray-200 sticky top-0 z-40">
                        <div className="flex items-center justify-between px-6 py-4">
                            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                                Quản lý bài tập
                            </h1>

                            <div className="flex items-center gap-4">

                                <button className="relative p-2.5 hover:bg-gray-100 rounded-xl transition-colors group">
                                    <FaBell className="text-gray-600 text-xl group-hover:text-blue-600 transition-colors" />
                                    <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white"></span>
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
                                            <p className="text-sm font-semibold text-gray-800">{userInfo?.full_name}</p>
                                            <p className="text-xs text-gray-500">Sinh viên</p>
                                        </div>
                                        <div className="relative">
                                            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-full flex items-center justify-center text-white font-bold shadow-lg">
                                                {userInfo?.full_name.charAt(0).toUpperCase()}
                                            </div>
                                            <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                                        </div>
                                    </button>

                                    {showProfileMenu && (
                                        <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-2xl border border-gray-200 py-2 z-50">
                                            <div className="px-4 py-3 border-b border-gray-100">
                                                <p className="text-sm font-semibold text-gray-800">{userInfo?.full_name}</p>
                                                <p className="text-xs text-gray-500">{userInfo?.email}</p>
                                            </div>
                                            <button className="w-full text-left px-4 py-2.5 hover:bg-gray-50 transition-colors text-sm text-gray-700">
                                                Thông tin cá nhân
                                            </button>
                                            <button className="w-full text-left px-4 py-2.5 hover:bg-gray-50 transition-colors text-sm text-gray-700">
                                                Cài đặt
                                            </button>
                                            <div className="border-t border-gray-100 mt-2 pt-2">
                                                <button
                                                    onClick={handlerLogout}
                                                    className="w-full text-left px-4 py-2.5 hover:bg-red-50 transition-colors text-sm text-red-600 font-medium"
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


                    <main className="flex-1 overflow-y-auto bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50">
                        <Outlet />
                    </main>


                    <footer className="bg-white border-t border-gray-200 px-6 py-3">
                        <div className="flex flex-col md:flex-row justify-between items-center gap-2 text-xs text-gray-500">
                            <p>© 2025 E-Learning System. All rights reserved.</p>
                            <div className="flex gap-4">
                                <a href="#" className="hover:text-blue-600 transition-colors">Trợ giúp</a>
                                <a href="#" className="hover:text-blue-600 transition-colors">Hướng dẫn</a>
                                <a href="#" className="hover:text-blue-600 transition-colors">Liên hệ</a>
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
    );
}

export default HomeworkLayout;