import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import ConferenceRoom from "../../components/ConferenceRoom";
import { roomService } from "../../services/roomService";
const OnlineClassroom = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [roomId, setRoomId] = useState(null);
    const [loading, setLoading] = useState(true);
    const user = {
        name: sessionStorage.getItem("name").replace(/['"]/g, ""),
        _id: sessionStorage.getItem("userId").replace(/['"]/g, ""),
        role: sessionStorage.getItem("role").replace(/['"]/g, ""),
        email: sessionStorage.getItem("email").replace(/['"]/g, "")
    }
    useEffect(() => {
        const fetchRoom = async () => {
            try {
                const data = await roomService.getRoomById(id);
                console.log("Room data", data);

                if (!data) throw new Error("Không tìm thấy phòng học");
                setRoomId(data?._id);
                console.log("Room id", data._id);
                await roomService.startRoom(data?._id);
            } catch (err) {
                console.error("Lỗi khi mở phòng học:", err.message);
                alert("Lỗi khi mở phòng học:", err.message);
                navigate(`/teacher/class-details/${id}`);
            } finally {
                setLoading(false);
            }
        };
        fetchRoom();
    }, [id]);

    if (loading) return <div className="p-6">Đang khởi tạo phòng học...</div>;
    if (!roomId) return <div className="p-6 text-red-500">Không thể mở phòng học</div>;

    const handleEndMeeting = async () => {
        try {
            await roomService.endRoom(roomId);
            if (user.role === "teacher") {
                navigate(`/teacher/class-details/${id}`);
            } else {
                navigate(`/home/class-details/${id}`);
            }
        } catch (err) {
            console.error("Lỗi khi kết thúc buổi học:", err);
            navigate(`/teacher/class-details/${id}`);
        }
    };

    return (
        <div className="bg-gray-50 min-h-screen">
            <ConferenceRoom
                classId={id}
                roomId={roomId}
                userId={user._id}
                userName={user.name}
                userEmail={user.email}
                userRole={user.role}
                onEnd={handleEndMeeting}
            />
        </div>
    );
};

export default OnlineClassroom;
