import {
  createRoom,
  getRoomById,
  findRoomByJoinCode,
  startRoom,
  endRoom,
  addParticipant,
  removeParticipant,
  getParticipants,
} from "../service/roomService.js";

export const createRoomController = async (req, res) => {
  try {
    const { classId, teacherId, teacherEmail, teacherName, roomName } =
      req.body;

    if (!classId || !teacherId || !roomName) {
      return res
        .status(400)
        .json({ error: "Thiếu classId, teacherId hoặc roomName" });
    }

    const room = await createRoom({
      classId,
      teacherId,
      teacherEmail,
      teacherName,
      roomName,
    });

    res.status(201).json({
      message: "Phòng học đã được tạo thành công",
      roomId: room._id,
      room,
    });
  } catch (err) {
    console.error(" Lỗi tạo phòng:", err.message);
    res.status(500).json({ error: err.message });
  }
};

export const getRoomByIdController = async (req, res) => {
  try {
    const { roomId } = req.params;
    const room = await getRoomById(roomId);
    res.json(room);
  } catch (err) {
    res.status(404).json({ error: err.message });
  }
};

export const joinRoomByCodeController = async (req, res) => {
  try {
    const { joinCode } = req.body;
    if (!joinCode) return res.status(400).json({ error: "Thiếu joinCode" });

    const room = await findRoomByJoinCode(joinCode);
    res.json(room);
  } catch (err) {
    res.status(404).json({ error: err.message });
  }
};

export const startRoomController = async (req, res) => {
  try {
    const { roomId } = req.params;
    const room = await startRoom(roomId);
    res.json({
      message: "Buổi học đã bắt đầu",
      room,
    });
  } catch (err) {
    console.error("startRoom:", err.message);
    res.status(500).json({ error: err.message });
  }
};

export const endRoomController = async (req, res) => {
  try {
    const { roomId } = req.params;
    const { role } = req.body;
    const room = await endRoom(role, roomId);
    res.json({
      message: "Buổi học đã kết thúc",
      room,
    });
  } catch (err) {
    console.error("endRoom:", err.message);
    res.status(500).json({ error: err.message });
  }
};

export const addParticipantController = async (req, res) => {
  try {
    const { roomId } = req.params;
    const { userId, name, email, role } = req.body;

    if (!userId && !email) {
      return res.status(400).json({ error: "Thiếu thông tin người tham gia" });
    }

    const participantData = { userId, name, email, role };
    const room = await addParticipant(roomId, participantData);

    res.json({
      message: `${name || email} đã tham gia phòng học`,
      room,
    });
  } catch (err) {
    console.error("Lỗi thêm participant:", err.message);
    res.status(500).json({ error: err.message });
  }
};

export const removeParticipantController = async (req, res) => {
  try {
    const { roomId } = req.params;
    const { userIdOrEmail } = req.body;

    if (!userIdOrEmail) {
      return res.status(400).json({ error: "Thiếu userId/email" });
    }

    const room = await removeParticipant(roomId, userIdOrEmail);
    res.json({
      message: "Đã cập nhật trạng thái rời phòng",
      room,
    });
  } catch (err) {
    console.error("removeParticipant:", err.message);
    res.status(500).json({ error: err.message });
  }
};

export const getParticipantsController = async (req, res) => {
  try {
    const { roomId } = req.params;
    const participants = await getParticipants(roomId);
    res.json(participants);
  } catch (err) {
    res.status(404).json({ error: err.message });
  }
};
