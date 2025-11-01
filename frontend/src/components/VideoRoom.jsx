import { initSip, joinConference, hangUp } from "../services/sipService";
import http from "../services/http";
import { useEffect, useRef, useState } from "react";

export default function VideoRoom() {
    const [roomId, setRoomId] = useState("");
    const [joined, setJoined] = useState(false);
    const [sipConfig, setSipConfig] = useState(null);
    const [role, setRole] = useState(sessionStorage.getItem("role") || "student");

    const email = sessionStorage.getItem("email") || "guest@lms.com";
    const password = sessionStorage.getItem("password");
    const username = email.split("@")[0];
    const user = {
        email: email,
        name: username
    }
    const localRef = useRef(null);
    const remoteRef = useRef(null);

    // 🔹 Khi joined + có cấu hình SIP thì khởi tạo WebRTC
    useEffect(() => {
        if (joined && sipConfig) {
            initSip(sipConfig, localRef, remoteRef);
            joinConference(roomId, localRef, remoteRef, sipConfig);
        }
    }, [joined, sipConfig]);

    //Giáo viên tạo phòng học
    const createRoom = async () => {
        try {

            const courseId = "68f4f28d73661f3c8b3c359e"; // tạm thời, sau này lấy từ params
            const res = await http.post(`/room/class/${courseId}/startSession`, user);
            const newRoomId = res.data.roomId;
            alert(`🎓 Phòng học đã tạo: ${newRoomId}`);
            setRoomId(newRoomId);
        } catch (err) {
            console.error("Lỗi tạo phòng:", err);
            alert("Không thể tạo phòng. Kiểm tra server backend.");
        }
    };

    // 👨‍🎓 Sinh viên nhập mã phòng và tham gia lớp
    const joinRoom = async () => {
        if (!roomId.trim()) {
            alert("Hãy nhập mã phòng!");
            return;
        }

        try {
            // Gọi backend để join room
            console.log("User ", user);

            await http.post(`/room/${roomId}/join`, user);

            // Lấy cấu hình kết nối SIP
            const { data } = await http.get("/voip/getCredentials");
            console.log("Data init from BE ", data);

            setSipConfig({
                ...data,
                username: email,
                password: password, //  trùng với mật khẩu SIP trong Asterisk realtime
            });
            setJoined(true);
        } catch (err) {
            console.error("Lỗi join phòng:", err);
            alert("Không thể tham gia phòng học. Vui lòng kiểm tra mã phòng.");
        }
    };

    const leaveRoom = () => {
        hangUp();
        setJoined(false);
    };

    return (
        <div className="p-6 text-center">
            {!joined ? (
                <div className="flex flex-col items-center space-y-4">
                    <h2 className="text-xl font-semibold text-gray-700">
                        Vào lớp học trực tuyến
                    </h2>

                    <input
                        className="border p-2 rounded w-72 text-center"
                        placeholder="Nhập mã phòng học (Room ID)"
                        value={roomId}
                        onChange={(e) => setRoomId(e.target.value)}
                    />

                    {role === "teacher" && (
                        <button
                            onClick={createRoom}
                            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                        >
                            Tạo phòng học
                        </button>
                    )}

                    <button
                        onClick={joinRoom}
                        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                    >
                        Tham gia phòng
                    </button>
                </div>
            ) : (
                <div>
                    <h2 className="text-xl font-semibold mb-3">
                        Đang trong phòng:{" "}
                        <span className="text-blue-600 font-mono">{roomId}</span>
                    </h2>

                    <div className="flex justify-center gap-6 mb-4">
                        <video ref={localRef} autoPlay muted playsInline width="320" />
                        <video ref={remoteRef} autoPlay playsInline width="320" />
                    </div>

                    <button
                        onClick={leaveRoom}
                        className="bg-red-600 text-white px-5 py-2 rounded hover:bg-red-700"
                    >
                        Rời phòng
                    </button>
                </div>
            )}
        </div>
    );
}
