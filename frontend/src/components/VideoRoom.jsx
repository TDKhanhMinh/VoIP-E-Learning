import React, { useRef, useState, useEffect } from "react";

const VideoPlayer = ({ stream }) => {
    const ref = useRef();
    useEffect(() => {
        if (ref.current) {
            ref.current.srcObject = stream;
        }
    }, [stream]);
    return <video ref={ref} autoPlay playsInline width="300" />;
};

const VideoRoom = () => {
    const [roomId, setRoomId] = useState("");
    const [user, setUser] = useState("");
    const [joined, setJoined] = useState(false);

    const localVideoRef = useRef(null);
    const [remoteStreams, setRemoteStreams] = useState([]);

    const wsRef = useRef(null);
    const pcRef = useRef(null);

    const startCall = async () => {
        // 1. Lấy stream local
        const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        if (localVideoRef.current) {
            localVideoRef.current.srcObject = stream;
        }

        // 2. Kết nối signaling
        wsRef.current = new WebSocket("ws://localhost:3001");

        wsRef.current.onopen = () => {
            console.log("✅ Connected to signaling server");

            // 3. Tạo RTCPeerConnection
            pcRef.current = new RTCPeerConnection();

            // Add track local vào peer connection
            stream.getTracks().forEach(track => pcRef.current.addTrack(track, stream));

            // Khi nhận remote stream
            pcRef.current.ontrack = (event) => {
                const remoteStream = event.streams[0];
                setRemoteStreams(prev => {
                    // tránh thêm trùng stream
                    if (prev.find(s => s.id === remoteStream.id)) return prev;
                    return [...prev, remoteStream];
                });
            };

            // Gửi ICE candidate lên server
            pcRef.current.onicecandidate = (event) => {
                if (event.candidate) {
                    wsRef.current.send(JSON.stringify({
                        type: "candidate",
                        candidate: event.candidate,
                        roomId
                    }));
                }
            };

            // Join room
            wsRef.current.send(JSON.stringify({ type: "joinRoom", roomId, user }));
            setJoined(true);
        };

        // 4. Xử lý message từ signaling server
        wsRef.current.onmessage = async (message) => {
            const data = JSON.parse(message.data);
            console.log("📩 Signal:", data);

            if (data.type === "offer" && pcRef.current) {
                await pcRef.current.setRemoteDescription(new RTCSessionDescription(data.offer));
                const answer = await pcRef.current.createAnswer();
                await pcRef.current.setLocalDescription(answer);
                wsRef.current.send(JSON.stringify({ type: "answer", answer, roomId }));
            }

            if (data.type === "answer" && pcRef.current) {
                await pcRef.current.setRemoteDescription(new RTCSessionDescription(data.answer));
            }

            if (data.type === "candidate" && pcRef.current) {
                try {
                    await pcRef.current.addIceCandidate(new RTCIceCandidate(data.candidate));
                    console.error("User login", data.user);
                } catch (err) {
                    console.error("🚨 Error adding ICE candidate", err);
                }
            }
        };
    };

    const createOffer = async () => {
        const offer = await pcRef.current.createOffer();
        await pcRef.current.setLocalDescription(offer);
        wsRef.current.send(JSON.stringify({ type: "offer", offer, roomId }));
    };

    return (
        <div>
            {!joined ? (
                <div>
                    <h2>Tham gia phòng học</h2>
                    <input
                        placeholder="Room ID"
                        value={roomId}
                        onChange={e => setRoomId(e.target.value)}
                    />
                    <input
                        placeholder="Tên người dùng"
                        value={user}
                        onChange={e => setUser(e.target.value)}
                    />
                    <button onClick={startCall}>Tham gia</button>
                </div>
            ) : (
                <div>
                    <h2>Phòng: {roomId}</h2>
                    <button onClick={createOffer}>Bắt đầu gọi</button>
                    <div style={{ display: "flex", gap: "10px", marginTop: "10px", flexWrap: "wrap" }}>
                        {/* Local video */}
                        <video ref={localVideoRef} autoPlay playsInline muted width="300" />

                        {/* Remote videos */}
                        {remoteStreams.map((stream, idx) => (
                            <VideoPlayer key={idx} stream={stream} />
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default VideoRoom;
