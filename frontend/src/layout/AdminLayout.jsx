import { useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import {
    FaBars,
    FaChartPie,
    FaUsers,
} from "react-icons/fa";
import { MdOutlineLibraryBooks } from "react-icons/md";
import { FaRegClock } from "react-icons/fa6";
import { CiLogout } from "react-icons/ci";
import { ToastContainer } from "react-toastify";
import { SiGoogleclassroom } from "react-icons/si";
import Button from "../components/Button";
import { IoCalendarOutline } from "react-icons/io5";

function AdminLayout() {
    const [open, setOpen] = useState(true);
    const navigate = useNavigate();

    const handlerLogout = () => {
        navigate("/", { state: { isLogin: false } });
    };

    return (
        <div className="flex h-screen bg-gray-100">
            <div
                className={`bg-gradient-to-b from-indigo-700 to-purple-800 text-white transition-all duration-300 ${open ? "w-60" : "w-16"
                    }`}
            >
                <div className="flex items-center justify-between px-4 py-3 border-b border-gray-700">
                    {open && (
                        <h1 className="font-bold text-sm transition-all duration-300">
                            Admin Dashboard
                        </h1>
                    )}

                    <Button
                        className="flex items-center mr-auto"
                        onClick={() => setOpen(!open)}
                    >
                        <FaBars />
                    </Button>
                </div>


                <ul className="mt-4 space-y-2">
                    <li>
                        <Button
                            to="/admin"
                            className="px-4 py-2 flex items-center gap-2 hover:bg-white/10 rounded"
                        >
                            <FaChartPie /> {open && "Dashboard"}
                        </Button>
                    </li>
                    
                    <li>
                        <Button
                            to="/admin/semesters"
                            className="px-4 py-2 flex items-center gap-2 hover:bg-white/10 rounded"
                        >
                            <FaRegClock /> {open && "Semesters"}
                        </Button>
                    </li>
                    <li>
                        <Button
                            to="/admin/courses"
                            className="px-4 py-2 flex items-center gap-2 hover:bg-white/10 rounded"
                        >
                            <MdOutlineLibraryBooks /> {open && "Courses"}
                        </Button>
                    </li>
                    <li>
                        <Button
                            to="/admin/classes"
                            className="px-4 py-2 flex items-center gap-2 hover:bg-white/10 rounded"
                        >
                            <SiGoogleclassroom /> {open && "Classes"}
                        </Button>
                    </li>
                    <li>
                        <Button
                            to="/admin/users"
                            className="px-4 py-2 flex items-center gap-2 hover:bg-white/10 rounded"
                        >
                            <FaUsers /> {open && "Users"}
                        </Button>
                    </li>
                    <li>
                        <Button
                            onClick={handlerLogout}
                            to="/"
                            className="px-4 py-2 flex items-center gap-2 hover:bg-white/10 rounded text-white"
                        >
                            <CiLogout /> {open && "Logout"}
                        </Button>
                    </li>
                </ul>
            </div>

            <div className="flex-1 flex flex-col">
                <div className="w-full h-14 bg-blue-700 px-6 shadow flex items-center text-white font-semibold">
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
                </div>

                <div className="flex-1 p-6 overflow-y-auto">
                    <Outlet />
                </div>
            </div>
        </div>
    );
}

export default AdminLayout;
