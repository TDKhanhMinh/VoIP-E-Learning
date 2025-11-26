import React, { useState, useEffect } from "react";
import {
    GridLayout,
    ParticipantTile,
    useTracks,
    RoomAudioRenderer,
    useRoomContext,
    useLocalParticipant,
    TrackToggle,      // Dùng cái này thay cho Mic/Cam Button cũ
    DisconnectButton, // Dùng cái này thay cho LeaveButton cũ
    ChatToggle,
} from "@livekit/components-react";
import { Track, RoomEvent } from "livekit-client";
import WhiteboardTldraw from "./WhiteboardTldraw";

const ConferenceContent = ({ userRole }) => {
    const room = useRoomContext();
    const [showWhiteboard, setShowWhiteboard] = useState(false);

    // Lấy trạng thái chia sẻ màn hình
    const { isScreenShareEnabled } = useLocalParticipant();
    const screenShareTracks = useTracks([Track.Source.ScreenShare]);

    // --- LOGIC BẬT/TẮT BẢNG ---
    const toggleWhiteboard = async () => {
        if (userRole !== "teacher") return;
        if (isScreenShareEnabled) {
            alert("Vui lòng tắt chia sẻ màn hình trước!");
            return;
        }

        const newState = !showWhiteboard;
        setShowWhiteboard(newState);

        const payload = JSON.stringify({ action: "TOGGLE_BOARD", isOpen: newState });
        await room.localParticipant.publishData(new TextEncoder().encode(payload), {
            reliable: true,
            topic: "control-channel"
        });
    };

    // --- LOGIC LẮNG NGHE SỰ KIỆN ---
    useEffect(() => {
        if (!room) return;

        const handleData = (payload, participant, kind, topic) => {
            if (topic === "control-channel") {
                const data = JSON.parse(new TextDecoder().decode(payload));
                if (data.action === "TOGGLE_BOARD") {
                    setShowWhiteboard(data.isOpen);
                }
            }
        };

        const handleParticipantConnected = (participant) => {
            if (showWhiteboard && userRole === 'teacher') {
                const payload = JSON.stringify({ action: "TOGGLE_BOARD", isOpen: true });
                room.localParticipant.publishData(new TextEncoder().encode(payload), {
                    reliable: true,
                    topic: "control-channel",
                    destinationIdentities: [participant.identity]
                });
            }
        };

        room.on(RoomEvent.DataReceived, handleData);
        room.on(RoomEvent.ParticipantConnected, handleParticipantConnected);

        return () => {
            room.off(RoomEvent.DataReceived, handleData);
            room.off(RoomEvent.ParticipantConnected, handleParticipantConnected);
        };
    }, [room, showWhiteboard, userRole]);

    // Tự động tắt bảng nếu có ai share màn hình
    useEffect(() => {
        if (screenShareTracks.length > 0 && showWhiteboard) {
            setShowWhiteboard(false);
        }
    }, [screenShareTracks.length]);

    // --- LAYOUT ---
    const tracks = useTracks(
        [{ source: Track.Source.Camera, withPlaceholder: true }, { source: Track.Source.ScreenShare, withPlaceholder: false }],
        { onlySubscribed: false }
    );

    return (
        <div className="flex flex-col h-full w-full bg-gray-950 relative">
            <RoomAudioRenderer />

            {/* PHẦN 1: KHUNG HÌNH CHÍNH (Chiếm hết không gian còn lại) */}
            <div className="flex-grow overflow-hidden relative w-full">
                {showWhiteboard ? (
                    <WhiteboardTldraw isReadOnly={userRole !== "teacher"} />
                ) : (
                    <GridLayout tracks={tracks}>
                        <ParticipantTile />
                    </GridLayout>
                )}
            </div>

            {/* PHẦN 2: THANH ĐIỀU KHIỂN THỦ CÔNG (Nằm cố định dưới đáy) */}
            {/* Sử dụng class 'lk-control-bar' để lấy style chuẩn của LiveKit nhưng render bằng div */}
            <div className="lk-control-bar flex justify-center items-center gap-4 p-4" style={{ height: '80px', backgroundColor: '#111' }}>

                {/* Nút Mic */}
                <TrackToggle source={Track.Source.Microphone} showIcon={true} />

                {/* Nút Camera */}
                <TrackToggle source={Track.Source.Camera} showIcon={true} />

                {/* Nút Share Màn hình */}
                <TrackToggle source={Track.Source.ScreenShare} showIcon={true} />

                {/* Nút Whiteboard (Chỉ Teacher) */}
                {userRole === "teacher" && (
                    <button
                        className={`lk-button ${showWhiteboard ? 'lk-button-active' : ''}`}
                        onClick={toggleWhiteboard}
                        title="Bảng trắng"
                        style={{ height: '40px', padding: '0 15px', display: 'flex', alignItems: 'center' }}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <rect x="4" y="4" width="16" height="16" rx="2" ry="2"></rect>
                            <line x1="9" y1="9" x2="15" y2="15"></line>
                            <line x1="15" y1="9" x2="9" y2="15"></line>
                        </svg>
                    </button>
                )}

                {/* Nút Chat */}
                <ChatToggle />

                {/* Nút Rời lớp */}
                <DisconnectButton>
                    <span className="px-2">Rời lớp</span>
                </DisconnectButton>
            </div>
        </div>
    );
};

export default ConferenceContent;