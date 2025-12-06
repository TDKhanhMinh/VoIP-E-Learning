import React, { useState, useEffect } from "react";
import {
  LiveKitRoom,
  VideoConference,
  useRoomContext,
} from "@livekit/components-react";
import "@livekit/components-styles";
import { roomService } from "../../services/roomService";
import { useNavigate } from "react-router-dom";
import WhiteboardTldraw from "./WhiteboardTldraw";
import TeacherControls from "./TeacherControls";

const RoomEventsHandler = ({ setShowWhiteboard }) => {
  const room = useRoomContext();

  useEffect(() => {
    if (!room) return;
    const onLocalTrackUnpublished = (pub) => {
      if (pub.source === "screen_share") {
        setShowWhiteboard(false);
      }
    };

    room.localParticipant.on("localTrackUnpublished", onLocalTrackUnpublished);
    return () => {
      room.localParticipant.off(
        "localTrackUnpublished",
        onLocalTrackUnpublished
      );
    };
  }, [room, setShowWhiteboard]);

  return null;
};

const ConferenceRoom = ({
  roomId,
  userId,
  userName,
  userEmail,
  userRole,
  classId,
}) => {
  const [token, setToken] = useState(null);
  const [roomName, setRoomName] = useState(null);
  const [url, setUrl] = useState(null);
  const [showWhiteboard, setShowWhiteboard] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!roomId || !userId) return;
    const init = async () => {
      try {
        const data = await roomService.getLivekitToken(
          roomId,
          userId,
          userName,
          userRole
        );
        setToken(data.token);
        setUrl(data.livekitUrl);
        setRoomName(data.roomName);
      } catch (e) {
        console.error(e);
      }
    };
    init();
  }, [roomId, userId, userName]);

  useEffect(() => {
    if (token) {
      roomService
        .addParticipant(roomId, {
          userId,
          email: userEmail,
          name: userName,
          role: userRole,
        })
        .catch((e) => console.warn(e));
    }
    return () => {
      if (token)
        roomService
          .removeParticipant(roomId, userId)
          .catch((e) => console.warn(e));
    };
  }, [token]);

  if (!token) return <div className="p-10 text-center">Đang kết nối...</div>;

  return (
    <div className="h-screen bg-gray-900 relative">
      <LiveKitRoom
        serverUrl={url}
        token={token}
        connect={true}
        data-lk-theme="default"
        style={{ height: "100%" }}
        onDisconnected={() => {
          const path =
            userRole === "teacher"
              ? `/teacher/class-details/${classId}`
              : `/home/class-details/${classId}`;
          navigate(path);
        }}
      >
        <RoomEventsHandler setShowWhiteboard={setShowWhiteboard} />

        <div className="absolute inset-0 z-0">
          {showWhiteboard ? <WhiteboardTldraw /> : <VideoConference />}
        </div>

        {userRole === "teacher" && (
          <TeacherControls
            showWhiteboard={showWhiteboard}
            setShowWhiteboard={setShowWhiteboard}
            roomName={roomName}
            classId={classId}
          />
        )}
      </LiveKitRoom>
    </div>
  );
};

export default ConferenceRoom;
