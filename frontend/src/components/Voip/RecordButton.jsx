import React, { useState } from "react";
import { toast } from "react-toastify";
import { recordingService } from "../../services/recordingService";

const RecordButton = ({ roomName, classId }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [recordId, setRecordId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const teacherId = sessionStorage.getItem("userId");

  const handleToggleRecording = async () => {
    if (isLoading) return;

    setIsLoading(true);

    try {
      if (!isRecording) {
        const record = await recordingService.startRecording(
          roomName,
          classId,
          teacherId
        );
        console.log("recordId", record?.egressId);
        console.log("TeacherID", teacherId);

        setRecordId(record?.egressId);
        setIsRecording(true);
      } else {
        await recordingService.stopRecording(recordId);
        setIsRecording(false);
        setRecordId(null);
      }
    } catch (error) {
      toast.error("Có lỗi xảy ra! Không thể ghi âm.");
      console.error("Lỗi ghi âm:", error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center gap-2">
      {isRecording && (
        <div className="flex items-center animate-pulse text-red-600 font-bold mr-2">
          <span className="w-3 h-3 bg-red-600 rounded-full mr-1"></span>
          REC
        </div>
      )}

      <button
        onClick={handleToggleRecording}
        disabled={isLoading}
        className={`px-4 py-2 ml-4 rounded font-semibold text-white transition-colors
          ${
            isRecording
              ? "bg-red-500 hover:bg-red-600"
              : "bg-blue-600 hover:bg-blue-700"
          }
          ${isLoading ? "opacity-50 cursor-not-allowed" : ""}
        `}
      >
        {isLoading
          ? "Đang xử lý..."
          : isRecording
          ? "Dừng Ghi Âm"
          : "Bắt Đầu Ghi Âm"}
      </button>
    </div>
  );
};

export default RecordButton;
