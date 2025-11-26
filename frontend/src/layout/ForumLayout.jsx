import { useNavigate } from "react-router-dom";
import { FaBell, FaCog } from "react-icons/fa";
import { useEffect, useState } from "react";
import { authService } from "../services/authService";
import { userService } from "../services/userService";

import Forum from "../components/Forum/Forum";
import { LoadingProvider } from "../context/LoadingContext";

export default function TeacherLayout() {
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const navigate = useNavigate();

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

  useEffect(() => {
    const fetchTeacherInfo = async () => {
      setTeacherInfo(await userService.getUserById(teacherId));
    };
    fetchTeacherInfo();
  }, []);

  return (
    <LoadingProvider>
      <div className="flex min-h-screen bg-gray-50">
        <div className="flex-1 flex flex-col min-w-0">
          <header className="bg-white shadow-md border-b border-gray-200 sticky top-0 z-40">
            <div className="flex justify-between items-center px-6 py-4">
              <div
                onClick={() => navigate("/teacher")}
                className="flex items-center gap-4 flex-1 max-w-xl hover:cursor-pointer"
              >
                <h1 className="text-2xl font-bold text-blue-600">
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
                      <p className="text-sm font-semibold text-gray-800">
                        {teacherInfo?.full_name}
                      </p>
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
                        <p className="text-sm font-semibold text-gray-800">
                          {teacherInfo?.full_name}
                        </p>
                        <p className="text-xs text-gray-500">
                          {teacherInfo?.email}
                        </p>
                      </div>
                      <button
                        onClick={() => {
                          setShowProfileMenu(false);
                        }}
                        className="w-full text-left px-4 py-2 hover:bg-gray-50 transition-colors text-sm text-gray-700"
                      >
                        Thông tin cá nhân
                      </button>
                      <button
                        onClick={() => {
                          setShowProfileMenu(false);
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
            <div className="">
              <Forum />
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
