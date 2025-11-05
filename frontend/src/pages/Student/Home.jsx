import { useEffect, useState } from "react";
import { enrollmentService } from "../../services/enrollmentService";
import { useNavigate } from "react-router-dom";

function Home() {
    const [userClass, setUserClass] = useState([]);
    const navigate = useNavigate();
    useEffect(() => {
        fetchCourses();
    }, []);

    const fetchCourses = async () => {
        try {
            const userId = sessionStorage.getItem("userId")?.split('"').join('').toString();
            const userEnrolledClasses = await enrollmentService.getAllEnrollmentsByStudentId(userId);
            setUserClass(userEnrolledClasses);
            console.log("Class enrolled", userEnrolledClasses);
        } catch (error) {
            console.log(error);
        }
    };
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 p-4">
            {userClass.map((item, index) => (
                <div onClick={() =>navigate(`/home/class-details/${item?.class?._id.split('"').join('').toString()}`)}
                    key={index}
                    className="w-full cursor-pointer bg-black rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow border hover:border-gray-800 duration-300"
                >
                    <div className="bg-green-600 p-4 flex justify-between items-start text-white relative">
                        <div>
                            <h2 className="text-lg font-semibold truncate hover:underline decoration-white">
                                {item.class?.name}
                            </h2>

                            <p className="text-base my-1 text-white">
                                GV: {item.class.teacher?.full_name} -

                                {Array.isArray(item.class.schedule) && item.class.schedule.length > 0 ? (
                                    item.class.schedule
                                        .map((s) => {
                                            const days = {
                                                2: "Thứ 2",
                                                3: "Thứ 3",
                                                4: "Thứ 4",
                                                5: "Thứ 5",
                                                6: "Thứ 6",
                                                7: "Thứ 7",
                                            };
                                            return `${days[s.dayOfWeek] || "?"} - Ca ${s.shift}`;
                                        })
                                        .join("; ")
                                ) : (
                                    "Chưa có lịch"
                                )}
                            </p>
                            <p className="text-xs mt-1 text-white">Khoa công nghệ thông tin</p>
                        </div>
                    </div>

                    <div className="p-3 h-20 bg-gray-50 relative">
                        <img className="rounded-full absolute -top-[40%] right-5" src="https://lh3.googleusercontent.com/a-/ALV-UjVg0Tk9yDH0Hx-Pexecvv4xa_Tjr4ytzR0Mf6yZbuRv_kW7p45oNw=s75-c" alt="logo" />
                    </div>
                </div>
            ))}
        </div>
    );

}

export default Home;