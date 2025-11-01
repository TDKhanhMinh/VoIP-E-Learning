import Room from "../model/room.js";
import { getARI } from "../service/ariService.js";
import { v4 as uuidv4 } from "uuid";

/**
 * Tạo phòng học mới (bridge Asterisk + MongoDB Room)
 */
export const createRoom = async (courseId, teacher) => {
    const ari = getARI();
    const roomId = uuidv4().replace(/-/g, "").slice(0, 16);
    const bridgeId = `room_${roomId}`;

    // Tạo bridge thực tế trong Asterisk
    const bridge = await ari.bridges.create({ type: "mixing", name: bridgeId });
    console.log(`Bridge created: ${bridgeId}`);
    console.log(`Teacher created: ${teacher.email}`);


    // Lưu thông tin Room vào MongoDB
    const newRoom = await Room.create({
        _id: roomId,
        courseId,
        teacherId: teacher._id || null,
        teacherEmail: teacher.email,
        teacherName: teacher.name,
        bridgeId,
        status: "active",
        createdAt: new Date(),
    });

    return newRoom;
};

/**
 * Học viên tham gia phòng học
 */
export const joinRoom = async (roomId, user) => {
    const room = await Room.findById(roomId);
    if (!room) throw new Error("Phòng học không tồn tại.");

    // Nếu chưa có trong danh sách thì thêm mới
    const alreadyJoined = room.participants.some(p => p.email === user.email);
    if (!alreadyJoined) {
        room.participants.push({
            userId: user._id || null,
            email: user.email,
            name: user.name,
            joinedAt: new Date(),
        });
        await room.save();
    }

    console.log(`${user.email} joined room ${roomId}`);
    return room;
};

/**
 * Kết thúc buổi học (hủy bridge + cập nhật DB)
 */
export const endRoom = async (roomId) => {
    const room = await Room.findById(roomId);
    if (!room) throw new Error("Không tìm thấy phòng học.");

    const ari = getARI();
    const bridge = ari.Bridge({ bridgeId: room.bridgeId });

    try {
        await bridge.destroy();
        console.log(`Bridge ${room.bridgeId} destroyed.`);
    } catch (err) {
        console.warn(`Không thể xóa bridge (có thể đã bị hủy): ${err.message}`);
    }

    room.status = "ended";
    room.endedAt = new Date();
    await room.save();

    return room;
};
