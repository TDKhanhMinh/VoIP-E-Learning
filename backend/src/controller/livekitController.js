import { generateLivekitToken } from "../service/livekitService.js";


export const getLivekitToken = async (req, res) => {
    try {
        const { roomId, identity, name, role } = req.body;

        if (!roomId || !identity || !name) {
            return res.status(400).json({ error: "Thiếu thông tin yêu cầu" });
        }

        const result = await generateLivekitToken(roomId, identity, name, role);
        return res.status(200).json(result);
    } catch (err) {
        console.error("Lỗi khi tạo LiveKit token:", err.message);
        return res.status(500).json({ error: "Không thể tạo token LiveKit" });
    }
};
