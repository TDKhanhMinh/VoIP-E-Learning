import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import ConferenceRoom from "../../components/Voip/ConferenceRoom";
import { roomService } from "../../services/roomService";

const OnlineClassroom = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [room, setRoom] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const user = {
    name: (sessionStorage.getItem("name") || "").replace(/['"]/g, ""),
    _id: (sessionStorage.getItem("userId") || "").replace(/['"]/g, ""),
    role: (sessionStorage.getItem("role") || "").replace(/['"]/g, ""),
    email: (sessionStorage.getItem("email") || "").replace(/['"]/g, ""),
  };

  useEffect(() => {
    const fetchRoom = async () => {
      setLoading(true);
      try {
        const data = await roomService.getRoomById(id);
        console.log("Room data", data);

        if (!data) throw new Error("Không tìm thấy phòng học");

        setRoom(data);
        console.log("Room id", data._id);

        await roomService.startRoom(data?._id);
      } catch (err) {
        console.error("Lỗi khi mở phòng học:", err.message);
        setError(err.message || "Không thể kết nối đến phòng học");
      } finally {
        setLoading(false);
      }
    };
    fetchRoom();
  }, [id]);

  const handleEndMeeting = async () => {
    try {
      if (room?._id) {
        await roomService.endRoom(user.role, room._id);
      }
      navigateBack();
    } catch (err) {
      console.error("Lỗi khi kết thúc buổi học:", err);
      navigateBack();
    }
  };

  const navigateBack = () => {
    if (user.role === "teacher") {
      navigate(`/teacher/class-details/${id}`);
    } else {
      navigate(`/home/class-details/${id}`);
    }
  };

  const MeetingSkeleton = () => (
    <div className="flex flex-col h-screen bg-gray-900 animate-pulse text-white overflow-hidden">
      <div className="h-16 bg-gray-800 border-b border-gray-700 flex items-center justify-between px-6">
        <div className="h-6 bg-gray-700 rounded w-1/4"></div>
        <div className="h-8 bg-gray-700 rounded w-24"></div>
      </div>

      <div className="flex-1 flex p-4 gap-4 overflow-hidden">
        <div className="flex-1 bg-gray-800 rounded-xl relative flex items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <div className="w-20 h-20 bg-gray-700 rounded-full animate-bounce"></div>
            <div className="h-4 bg-gray-700 rounded w-48"></div>
            <div className="text-gray-500 text-sm">
              Đang kết nối máy chủ LiveKit...
            </div>
          </div>
        </div>

        <div className="hidden lg:block w-80 bg-gray-800 rounded-xl"></div>
      </div>

      <div className="h-20 bg-gray-800 border-t border-gray-700 flex items-center justify-center gap-6">
        <div className="w-12 h-12 bg-gray-700 rounded-full"></div>
        <div className="w-12 h-12 bg-gray-700 rounded-full"></div>
        <div className="w-16 h-12 bg-gray-600 rounded-2xl"></div>
        <div className="w-12 h-12 bg-gray-700 rounded-full"></div>
        <div className="w-12 h-12 bg-gray-700 rounded-full"></div>
      </div>
    </div>
  );

  if (error) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
        <div className="bg-white rounded-xl shadow-2xl p-8 max-w-md w-full text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">⚠️</span>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Lỗi kết nối</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={navigateBack}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
          >
            Quay lại lớp học
          </button>
        </div>
      </div>
    );
  }

  if (loading) return <MeetingSkeleton />;

  return (
    <div className="bg-gray-900 min-h-screen">
      {room && (
        <ConferenceRoom
          classId={id}
          roomId={room._id}
          userId={user._id}
          userName={user.name}
          userEmail={user.email}
          userRole={user.role}
          roomName={room.roomName}
          onEnd={handleEndMeeting}
        />
      )}
    </div>
  );
};

export default OnlineClassroom;
