// import Room from "../model/room.js";
// import { getARI } from "../service/ariService.js";
// import { v4 as uuidv4 } from "uuid";

// /**
//  * Tạo phòng học mới (bridge Asterisk + MongoDB Room)
//  */
// export const createRoom = async (classId, teacher) => {
//     const ari = getARI();
//     const roomId = uuidv4().replace(/-/g, "").slice(0, 16);
//     const bridgeId = `room_${roomId}`;

//     // Tạo bridge thực tế trong Asterisk
//     const bridge = await ari.bridges.create({ type: "mixing", name: bridgeId });
//     console.log(`Bridge created: ${bridgeId}`);
//     console.log(`Teacher created: ${teacher.email}`);


//     // Lưu thông tin Room vào MongoDB
//     const newRoom = await Room.create({
//         _id: roomId,
//         classId,
//         teacherId: teacher._id || null,
//         teacherEmail: teacher.email,
//         teacherName: teacher.name,
//         bridgeId,
//         status: "active",
//         createdAt: new Date(),
//     });

//     return newRoom;
// };

// /**
//  * Học viên tham gia phòng học
//  */
// export const joinRoom = async (roomId, user) => {
//     const room = await Room.findById(roomId);
//     if (!room) throw new Error("Phòng học không tồn tại.");

//     // Nếu chưa có trong danh sách thì thêm mới
//     const alreadyJoined = room.participants.some(p => p.email === user.email);
//     if (!alreadyJoined) {
//         room.participants.push({
//             userId: user._id || null,
//             email: user.email,
//             name: user.name,
//             joinedAt: new Date(),
//         });
//         await room.save();
//     }

//     console.log(`${user.email} joined room ${roomId}`);
//     return room;
// };

// /**
//  * Kết thúc buổi học (hủy bridge + cập nhật DB)
//  */
// export const endRoom = async (roomId) => {
//     const room = await Room.findById(roomId);
//     if (!room) throw new Error("Không tìm thấy phòng học.");

//     const ari = getARI();
//     const bridge = ari.Bridge({ bridgeId: room.bridgeId });

//     try {
//         await bridge.destroy();
//         console.log(`Bridge ${room.bridgeId} destroyed.`);
//     } catch (err) {
//         console.warn(`Không thể xóa bridge (có thể đã bị hủy): ${err.message}`);
//     }

//     room.status = "ended";
//     room.endedAt = new Date();
//     await room.save();

//     return room;
// };
import Class from "../model/class.js";
import Room from "../model/room.js";


const generateJoinCode = () => {
    const random = Math.random().toString(36).substring(2, 8).toUpperCase();
    return `ROOM-${random}`;
};

export const createRoom = async ({ classId, teacherId, teacherEmail, teacherName }) => {
    if (!classId || !teacherId) throw new Error("Thiếu thông tin khóa học hoặc giáo viên");

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

export const endRoom = async (roomId) => {
    const room = await Room.findById(roomId);
    if (!room) throw new Error("Không tìm thấy phòng học");

    room.endedAt = new Date();
    room.status = "ended";
    await room.save();
    return room;
};

export const addParticipant = async (roomId, participantData) => {
    const room = await Room.findById(roomId);
    if (!room) throw new Error("Không tìm thấy phòng học");

    const existing = room.participants.find(
        (p) => p.email === participantData.email || p.userId?.toString() === participantData.userId
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
