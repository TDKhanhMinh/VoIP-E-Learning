import React, { useRef, useState, useEffect } from "react";
import { initSip, startCall, hangUp } from "../services/sipService";
import { initSocket } from "../services/socketService";
import http from "../services/http";

export default function VideoRoom() {
    const [roomId, setRoomId] = useState("classA");
    const [user, setUser] = useState("teacher");
    const [joined, setJoined] = useState(false);

    const localRef = useRef(null);
    const remoteRef = useRef(null);
    const [sipConfig, setSipConfig] = useState(null);

    useEffect(() => {
        if (!joined) return;

        async function setup() {
            try {
                const { data } = await http.get("voip/getCredentials");
                setSipConfig(data);
                console.log("SOP data", data);

                await initSip(data, localRef, remoteRef);

                initSocket(import.meta.env.VITE_API_URL, roomId, user, {
                    onUserJoined: (d) => console.log("👋 User joined:", d),
                });
            } catch (err) {
                console.error("🚨 Lỗi khởi tạo VoIP:", err);
            }
        }

        setup();
    }, [joined]);

    return (
        <div className="p-4 text-center">
            {!joined ? (
                <div className="flex flex-col items-center space-y-3">
                    <input
                        className="border p-2 rounded"
                        placeholder="Room ID"
                        value={roomId}
                        onChange={(e) => setRoomId(e.target.value)}
                    />
                    <input
                        className="border p-2 rounded"
                        placeholder="Tên người dùng"
                        value={user}
                        onChange={(e) => setUser(e.target.value)}
                    />
                    <button
                        className="bg-blue-600 text-white px-4 py-2 rounded"
                        onClick={() => setJoined(true)}
                    >
                        Join Room
                    </button>
                </div>
            ) : (
                <div>
                    <h2 className="text-xl font-semibold mb-3">Phòng: {roomId}</h2>

                    <div className="flex justify-center gap-4 mb-4">
                        <video ref={localRef} autoPlay muted playsInline width="320" />
                        <video ref={remoteRef} autoPlay playsInline width="320" />
                    </div>

                    <div className="flex justify-center gap-2">
                        <button
                            className="bg-green-600 text-white px-4 py-2 rounded"
                            onClick={() =>
                                startCall("student@13.215.254.255", localRef, remoteRef)
                            }
                        >
                            Gọi
                        </button>
                        <button
                            className="bg-red-600 text-white px-4 py-2 rounded"
                            onClick={hangUp}
                        >
                            Kết thúc
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
