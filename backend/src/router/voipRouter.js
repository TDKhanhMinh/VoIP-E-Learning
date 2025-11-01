// // src/routes/voipRouter.js
// import express from "express";
// import { getARI, getRooms } from "../service/ariService.js";

// const router = express.Router();
// const rooms = getRooms(); // dùng rooms trong ariService (bridge thật)

// // 📡 1️⃣ FE lấy cấu hình WebRTC để đăng ký SIP.js
// router.get("/getCredentials", (req, res) => {
//     const sipConfig = {
//         wsServer: "wss://webrtc.voipelearning.shop:8089/ws",
//         domain: "webrtc.voipelearning.shop",
//         // FE sẽ tự gán username/password từ sessionStorage
//     };
//     res.json(sipConfig);
// });

// // 🧩 2️⃣ Tạo phòng (bridge thật trong Asterisk)
// router.post("/room/create", async (req, res) => {
//     try {
//         const { roomId } = req.body;
//         if (!roomId) return res.status(400).json({ message: "roomId is required" });

//         const ari = getARI();

//         if (rooms[`room_${roomId}`]) {
//             return res.json({ message: "Room already exists", roomId });
//         }

//         // tạo bridge kiểu mixing
//         const bridge = await ari.bridges.create({
//             type: "mixing",
//             name: `room_${roomId}`,
//             bridgeId: `room_${roomId}`,
//         });

//         rooms[`room_${roomId}`] = bridge;
//         console.log(`🎯 Created new bridge room_${roomId}`);

//         return res.json({ message: "Room created successfully", roomId });
//     } catch (err) {
//         console.error("create room error:", err);
//         res.status(500).json({ message: err.message });
//     }
// });

// // 👥 3️⃣ Thêm user (channel) vào phòng học
// router.post("/room/:id/join", async (req, res) => {
//     try {
//         const { id } = req.params;
//         const { channelId } = req.body; // FE gửi channelId khi có event StasisStart

//         if (!channelId) return res.status(400).json({ message: "channelId required" });

//         const bridge = rooms[`room_${id}`];
//         if (!bridge) return res.status(404).json({ message: "Room not found" });

//         await bridge.addChannel({ channel: channelId });
//         console.log(`✅ Channel ${channelId} joined room_${id}`);

//         res.json({ message: "Joined room successfully", roomId: id });
//     } catch (err) {
//         console.error("join room error:", err);
//         res.status(500).json({ message: err.message });
//     }
// });

// // 🚪 4️⃣ Rời phòng (remove channel)
// router.post("/room/:id/leave", async (req, res) => {
//     try {
//         const { id } = req.params;
//         const { channelId } = req.body;

//         const bridge = rooms[`room_${id}`];
//         if (!bridge) return res.status(404).json({ message: "Room not found" });

//         await bridge.removeChannel({ channel: channelId });
//         console.log(`👋 Channel ${channelId} left room_${id}`);

//         res.json({ message: "Left room" });
//     } catch (err) {
//         console.error("leave room error:", err);
//         res.status(500).json({ message: err.message });
//     }
// });

// // 🗑️ 5️⃣ Xoá phòng học (bridge)
// router.delete("/room/:id", async (req, res) => {
//     try {
//         const { id } = req.params;
//         const bridge = rooms[`room_${id}`];
//         if (!bridge) return res.status(404).json({ message: "Room not found" });

//         await bridge.destroy();
//         delete rooms[`room_${id}`];
//         console.log(`🗑️ Destroyed bridge room_${id}`);

//         res.json({ message: "Room destroyed" });
//     } catch (err) {
//         console.error("destroy room error:", err);
//         res.status(500).json({ message: err.message });
//     }
// });

// // 📋 6️⃣ Danh sách phòng hiện tại
// router.get("/rooms", (req, res) => {
//     const list = Object.keys(rooms).map((k) => ({
//         room: k,
//         id: rooms[k].id,
//     }));
//     res.json({ rooms: list });
// });

// export default router;
// src/routes/voipRouter.js
import express from "express";
import { getARI } from "../service/ariService.js"; // Chỉ import getARI

const router = express.Router();

// ----------------------------------------------------------------
// 📡 1. LẤY CẤU HÌNH SIP (ĐÚNG)
// Endpoint này FE cần để khởi tạo SIP.js
// ----------------------------------------------------------------
router.get("/getCredentials", (req, res) => {
    const sipConfig = {
        wsServer: "wss://webrtc.voipElearning.shop:8089/ws",
        domain: "webrtc.voipElearning.shop",
    };
    res.json(sipConfig);
});

// ----------------------------------------------------------------
// 📋 2. (TÙY CHỌN) LẤY DANH SÁCH PHÒNG ĐANG HOẠT ĐỘNG
// Endpoint /rooms cũ của bạn bị hỏng vì dùng cache.
// Đây là cách làm đúng bằng cách gọi thẳng Asterisk.
// ----------------------------------------------------------------
router.get("/rooms", async (req, res) => {
    try {
        const ari = getARI();
        // Lấy TẤT CẢ các bridge đang chạy trên Asterisk
        const allBridges = await ari.bridges.list();

        // Lọc ra chỉ những bridge của ứng dụng này (có tên bắt đầu bằng "room_")
        const appBridges = allBridges
            .filter(bridge => bridge.name && bridge.name.startsWith("room_"))
            .map(bridge => ({
                id: bridge.id,                 // ID của bridge
                name: bridge.name,             // Tên (ví dụ: room_abc123)
                channels: bridge.channels.length // Số người đang ở trong
            }));

        res.json({ rooms: appBridges });
    } catch (err) {
        console.error("Lỗi khi lấy danh sách phòng từ ARI:", err.message);
        res.status(500).json({ message: err.message });
    }
});


/* TẤT CẢ CÁC ENDPOINT KHÁC ĐÃ BỊ XÓA
   (ví dụ: /room/create, /room/:id/join, /room/:id/destroy)
   Vì chúng đã được xử lý chính xác bởi:
   1. roomRouter.js / roomService.js (Logic của Giáo viên)
   2. ariService.js (Logic tự động của Học viên)
*/

export default router;