import { RoomServiceClient } from "livekit-server-sdk";
import Class from "../model/class.js";
import Room from "../model/room.js";

const generateJoinCode = () => {
  const random = Math.random().toString(36).substring(2, 8).toUpperCase();
  return `ROOM-${random}`;
};

export const createRoom = async ({
  classId,
  teacherId,
  teacherEmail,
  teacherName,
}) => {
  if (!classId || !teacherId)
    throw new Error("Thiếu thông tin khóa học hoặc giáo viên");

  const roomName = (await Class.findById(classId)).name;
  const joinCode = generateJoinCode();

  const room = await Room.create({
    classId,
    teacherId,
    teacherEmail,
    teacherName,
    roomName,
    joinCode,
    status: "active",
    createdAt: new Date(),
  });

  return room;
};

export const getRoomById = async (roomId) => {
  const room = await Room.findOne({ classId: roomId });
  if (!room) throw new Error("Không tìm thấy phòng học");
  return room;
};

export const getRoomByName = async (roomName) => {
  const room = await Room.findOne({ roomName });
  if (!room) throw new Error("Không tìm thấy phòng học");
  return room;
};

export const findRoomByJoinCode = async (joinCode) => {
  const room = await Room.findOne({ joinCode });
  if (!room) throw new Error("Mã phòng học không hợp lệ");
  return room;
};

export const startRoom = async (roomId) => {
  const room = await Room.findById(roomId);
  if (!room) throw new Error("Không tìm thấy phòng học");

  room.startedAt = new Date();
  room.status = "active";
  await room.save();
  return room;
};

const roomService = new RoomServiceClient(
  process.env.LIVEKIT_URL,
  process.env.LIVEKIT_API_KEY,
  process.env.LIVEKIT_API_SECRET
);
export const endRoom = async (role, roomId) => {
  const room = await Room.findById(roomId);
  if (!room) throw new Error("Không tìm thấy phòng học");
  if (role !== "teacher") await roomService.deleteRoom(room.roomName);
  room.endedAt = new Date();
  room.status = "ended";
  await room.save();
  return room;
};

export const addParticipant = async (roomId, participantData) => {
  const room = await Room.findById(roomId);
  if (!room) throw new Error("Không tìm thấy phòng học");

  const existing = room.participants.find(
    (p) =>
      p.email === participantData.email ||
      p.userId?.toString() === participantData.userId
  );

  if (!existing) {
    room.participants.push({
      ...participantData,
      joinedAt: new Date(),
    });
    await room.save();
  }

  return room;
};

export const removeParticipant = async (roomId, userIdOrEmail) => {
  const room = await Room.findById(roomId);
  if (!room) throw new Error("Không tìm thấy phòng học");

  const participant = room.participants.find(
    (p) =>
      p.userId?.toString() === userIdOrEmail ||
      p.email?.toLowerCase() === userIdOrEmail.toLowerCase()
  );

  if (participant && !participant.leftAt) {
    participant.leftAt = new Date();
    participant.duration =
      (participant.leftAt.getTime() - participant.joinedAt.getTime()) / 1000;
    await room.save();
  }

  return room;
};

export const getParticipants = async (roomId) => {
  const room = await Room.findById(roomId);
  if (!room) throw new Error("Không tìm thấy phòng học");
  return room.participants;
};
