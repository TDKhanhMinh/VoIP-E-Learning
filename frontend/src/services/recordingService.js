import http from "./http";

export const recordingService = {
  startRecording: async (roomName, classId, teacherId) => {
    try {
      const response = await http.post("/recording/start", {
        roomName,
        classId,
        teacherId,
      });
      console.log("response egress", response.data);
      return response.data;
    } catch (error) {
      console.error("Lỗi khi gọi API ghi âm:", error);
      throw error;
    }
  },

  stopRecording: async (egressId) => {
    try {
      const response = await http.post("/recording/stop", { egressId });
      return response.data;
    } catch (error) {
      console.error("Lỗi khi gọi API dừng ghi âm:", error);
      throw error;
    }
  },
  getRecordingInfo: async (id) => {
    try {
      const response = await http.get(`/recording/info/${id}`);
      return response.data;
    } catch (error) {
      console.error("Lỗi khi gọi API lấy thông tin ghi âm:", error);
      throw error;
    }
  },
  getListRecordings: async (classId) => {
    try {
      const response = await http.get(`/recording/list/${classId}`);
      return response.data;
    } catch (error) {
      console.error("Lỗi khi gọi API liệt kê ghi âm:", error);
      throw error;
    }
  },
  updateAISummaryByRecordId: async (recordingId, aiSummary) => {
    try {
      const response = await http.put(
        `/recording/update-ai-summary/${recordingId}`,
        { aiSummary }
      );
      return response.data;
    } catch (error) {
      console.error("Lỗi khi gọi API cập nhật tóm tắt AI:", error);
      throw error;
    }
  },
  publishRecordingById: async (recordingId) => {
    try {
      const response = await http.put(`/recording/publish/${recordingId}`);
      return response.data;
    } catch (error) {
      console.error("Lỗi khi gọi API công bố bản ghi:", error);
      throw error;
    }
  },
};
