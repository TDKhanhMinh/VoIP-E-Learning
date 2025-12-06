import { useLocalParticipant } from "@livekit/components-react";
import { TbChalkboard } from "react-icons/tb";
import { TbChalkboardOff } from "react-icons/tb";
import RecordButton from './RecordButton';
const TeacherControls = ({
  showWhiteboard,
  setShowWhiteboard,
  roomName,
  classId,
}) => {
  const { localParticipant } = useLocalParticipant();

  const handleToggle = async () => {
    if (!localParticipant) {
      console.error("LocalParticipant chưa sẵn sàng (đang kết nối...)");
      return;
    }
    if (!roomName) {
      alert("Lỗi: Bạn chưa kết nối vào phòng học, không thể ghi âm!");
      return;
    }

    try {
      if (!showWhiteboard) {
        console.log("Đang yêu cầu share screen...");
        await localParticipant.setScreenShareEnabled(true);
        setShowWhiteboard(true);
      } else {
        await localParticipant.setScreenShareEnabled(false);
        setShowWhiteboard(false);
      }
    } catch (err) {
      console.error("Lỗi thao tác:", err);
    }
  };

  return (
    <div className="fixed bottom-3 left-60 transform -translate-x-1/2 z-50 flex items-center gap-2 justify-center">
      <RecordButton roomName={roomName} classId={classId} />
      <button
        onClick={handleToggle}
        className={`px-8 py-3 rounded-lg font-bold text-white ${
          showWhiteboard
            ? "bg-red-600 hover:bg-red-700"
            : "bg-black hover:bg-gray-900"
        }`}
      >
        {showWhiteboard ? (
          <div className="flex items-center gap-2">
            <TbChalkboardOff size={20} />
            <span>Close Whiteboard</span>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <TbChalkboard size={20} />
            <span>Whiteboard</span>
          </div>
        )}
      </button>
    </div>
  );
};
export default TeacherControls;
