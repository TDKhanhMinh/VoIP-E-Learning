import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { classService } from "../../services/classService";
import { BsCameraVideo } from "react-icons/bs";
import { announcementService } from "../../services/announcementService";
import NotificationItem from "../../components/NotificationItem";
export default function ClassDetails() {
    const { id } = useParams();
    const [classInfo, setClassInfo] = useState(null);
    const [notifications, setNotifications] = useState([]);

    const navigate = useNavigate();
    useEffect(() => {
        loadClassDetail();
    }, []);

    const loadClassDetail = async () => {
        try {
            setNotifications(await announcementService.getAnnouncementByClassId(id));
            console.log("Notifications ", await announcementService.getAnnouncementByClassId(id));

            setClassInfo(await classService.getClassById(id));
        } catch (err) {
            console.log(err);
        }
    };

    if (!classInfo) return <div className="p-6">Loading...</div>;

    return (
        <div className="p-6 max-w-6xl mx-auto">
            <div className="rounded-xl bg-gradient-to-r from-blue-800 to-sky-400">
                <div className="p-8 text-white" >
                    <h1 className="text-3xl font-semibold truncate">{classInfo.name}</h1>
                    <p className="text-lg mt-1 opacity-95">
                        GV: {classInfo.teacher?.full_name} –{" "}
                        {classInfo.schedule?.map((s) => `Thứ ${s.dayOfWeek}, Ca ${s.shift}`).join("; ")} –{" "}
                        phòng {classInfo.room}
                    </p>
                </div>
            </div>
            <div className="grid grid-cols-[20%_80%] gap-6 p-4">
                <div className="">
                    <div className="bg-white border rounded-xl border-gray-500 px-4 shadow-sm  gap-4 w-full sm:w-auto">
                        <div className="font-medium w-full flex items-center gap-4 my-4"><BsCameraVideo /> Phòng học Online</div>
                        <button onClick={() => navigate(`/meet-room/${id}`)} className="w-full mt-1 px-5 py-1.5 mb-4 border border-gray-500 rounded-full hover:bg-gray-300 transition">
                            Vào phòng
                        </button>
                    </div>
                </div>

                <div className="mt-6">
                    <button className="bg-blue-600 hover:bg-blue-900 px-4 py-2 rounded-full text-white transition">
                        Tạo thảo luận
                    </button>
                    {notifications.length > 0 ?
                        (
                            <div className="mb-3">
                                {notifications.map((a) => (
                                    <NotificationItem data={a} />
                                ))}
                            </div>
                        ) : (
                            <div className="mt-6 border rounded-xl p-6 shadow-sm bg-white">
                                <p className="text-xl font-semibold">Bạn có thể trao đổi thông tin với mọi người tại đây.</p>
                                <p className="text-gray-600 mt-1">
                                    Hiện tại chưa có thông báo nào
                                </p>
                            </div>

                        )

                    }


                </div>
            </div>


        </div>
    );
}
