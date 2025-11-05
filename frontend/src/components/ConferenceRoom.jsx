import React, { useState, useEffect } from "react";
import { LiveKitRoom, VideoConference } from "@livekit/components-react";
import "@livekit/components-styles";
import { roomService } from "../services/roomService";
import { useNavigate } from "react-router-dom";

// const LIVEKIT_SERVER_URL = "ws://localhost:7880";


const ConferenceRoom = ({ roomId, userId, userName, userEmail, userRole, classId }) => {
    const [token, setToken] = useState(null);
    const [url, setUrl] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    useEffect(() => {
        if (!roomId || !userId || !userName) {
            setError("Thiếu thông tin người dùng hoặc phòng học");
            setLoading(false);
            return;
        }

        const getToken = async () => {
            try {
                setLoading(true);
                const data = await roomService.getLivekitToken(roomId, userId, userName, userRole)

                if (!data.token || typeof data.token !== "string") {
                    throw new Error("Token từ server không hợp lệ");
                }
                setToken(data.token);
                setUrl(data.livekitUrl)
            } catch (e) {
                console.error("Lỗi khi lấy token:", e);
                setError(e.message);
            } finally {
                setLoading(false);
            }
        };

        getToken();
    }, [roomId, userId, userName]);

    const handleParticipantEvent = async (action) => {
        try {
            const payload =
                action === "join"
                    ? {
                        userId,
                        email: userEmail,
                        name: userName,
                        role: userRole,
                    }
                    : {
                        userIdOrEmail: userEmail,
                    };

            if (action === "join") {
                await roomService.addParticipant(roomId, payload)
            } else {
                await roomService.removeParticipant(roomId, userId)

                if (userRole === "teacher") {
                    navigate(`/teacher/class-details/${classId}`);
                } else {
                    navigate(`/home/class-details/${classId}`);
                }
            }

        } catch (err) {
            console.warn("Lỗi khi gửi log tham gia/rời phòng:", err.message);
        }
    };

    useEffect(() => {
        if (token) handleParticipantEvent("join");

        return () => {
            if (token) handleParticipantEvent("leave");
        };
    }, [token]);

    if (loading) return <div className="text-center p-4">Đang kết nối đến lớp học...</div>;
    if (error) return <div className="text-red-500 p-4">Lỗi: {error}</div>;
    if (!token) return <div className="text-red-500 p-4">Không thể lấy được token hợp lệ</div>;

    return (
        <div className="h-screen bg-gray-50">
            <LiveKitRoom
                serverUrl={url}
                token={token}
                connect={true}
                style={{
                    height: "100vh",
                    display: "flex",
                    flexDirection: "column",
                }}
                data-lk-theme="default"
                onDisconnected={() => handleParticipantEvent("leave")}
            >
                <VideoConference />
            </LiveKitRoom>
        </div>
    );
};

export default ConferenceRoom;
