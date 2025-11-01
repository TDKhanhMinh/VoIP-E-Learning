import * as roomService from "../service/roomService.js";

/**
 * 👩‍🏫 Giáo viên tạo buổi học mới
 */
export const startSession = async (req, res) => {
    try {
        const courseId = req.params.id || "68f4f28d73661f3c8b3c359e";
        const data = req.body;
        const teacher = {
            email: data.email,
            name: data.username
        };

        const room = await roomService.createRoom(courseId, teacher);
        res.status(201).json({
            message: "Phòng học đã được tạo thành công!",
            roomId: room._id,
            bridgeId: room.bridgeId,
            room,
        });
    } catch (err) {
        console.error("❌ startSession:", err);
        res.status(500).json({ error: err.message });
    }
};

/**
 * 👨‍🎓 Học viên tham gia phòng học
 */
export const joinRoom = async (req, res) => {
    try {
        console.log(req.data);

        const { id } = req.params;
        const data = req.body;
        const user =
        {
            email: data.email,
            name: data.username,
        };

        const room = await roomService.joinRoom(id, user);
        res.json({ message: "Đã tham gia phòng học", room });
    } catch (err) {
        console.error("joinRoom:", err);
        res.status(500).json({ error: err.message });
    }
};


export const endRoom = async (req, res) => {
    try {
        const { id } = req.params;
        const room = await roomService.endRoom(id);
        res.json({ message: "Buổi học đã kết thúc", room });
    } catch (err) {
        console.error("endRoom:", err);
        res.status(500).json({ error: err.message });
    }
};
