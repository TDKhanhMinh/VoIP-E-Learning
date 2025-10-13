import { Outlet } from "react-router-dom";
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
function HomeworkLayout() {
    const [userClass, setUserClass] = useState([]);
    useEffect(() => {
        fetchCourses();
    }, []);
    const fetchCourses = async () => {
        try {
            const userEnrolledClasses = await enrollmentService.getAllEnrollmentsByStudentId(sessionStorage.getItem("userId").split('"').join('').toString());
            setUserClass(userEnrolledClasses);
            console.log(userEnrolledClasses);
        } catch (error) {
            console.log(error);

        }
    };

    return (
        <div className="min-h-screen flex flex-col">
            <div className="grid grid-cols-12 flex-1">
                <aside className="col-span-2 bg-white rounded-xl shadow-[4px_0_10px_rgba(0,0,0,0.8)] ">
                    <div className="bg-blue-500 h-14 flex items-center justify-center">
                        <div className="uppercase text-white flex justify-center items-center space-x-2">
                            <img className="w-7 h-7 rounded-full" src="https://www.senviet.art/wp-content/uploads/edd/2021/12/dai-hoc-tdt.jpg" />
                            <span>E-Learning VoIP Tools</span>
                        </div>
                    </div>
                    <div className="border-b">
                        <Button to={"/home"} className="">
                            <div className="flex items-center space-x-2 hover:bg-gray-200 rounded p-2"> <IoHomeOutline /> <span> Trang chủ</span></div>
                        </Button>
                    </div>
                    <div className="my-2">
                        <span className="mx-2">HK2-2425</span>
                    </div>
                    <ul className="container border-b">
                        {userClass?.length > 0 &&
                            userClass.map((item, index) => (
                                <li key={index} className="flex w-full items-center  my-2 ">
                                    <Tippy
                                        content={
                                            <div className="text-sm text-center">
                                                <strong>{item.class.name}</strong>
                                                <div>{item.class.course.code}</div>
                                                <div>GV: {item.class.teacher.full_name}</div>
                                                {/* <div>Thứ: {item.day}, Ca: {item.slot}, Phòng: {item.room}</div> */}
                                            </div>
                                        }
                                        placement="top"
                                        theme="dark"
                                        arrow={true}
                                    >
                                        <div className="w-full">
                                            <Button
                                                className="w-full rounded font-normal flex items-center mx-1 hover:bg-gray-200"
                                                to={`/course/homework/${item.class._id}`}
                                            >
                                                <div className="flex items-center space-x-2"> <BsGrid3X3GapFill /><span>{item.class.name}</span></div>
                                            </Button>
                                        </div>
                                    </Tippy>
                                </li>
                            ))
                        }
                    </ul>
                    <Button className="flex justify-start hover:bg-gray-200 container mt-2">
                        <div className="flex items-center justify-center space-x-4">
                            <MdLogout />
                            <span>Thoát</span>
                        </div>
                    </Button>
                </aside>
                <section className="col-span-10 bg-gray-100 border rounded-xl">
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
                    <Navbar />
                    <Outlet />
                </section>
            </div>

        </div>

    );
}

export default HomeworkLayout;