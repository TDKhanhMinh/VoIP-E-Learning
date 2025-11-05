import * as voipService from "../service/voipService.js";

export const getSipCredentialsController = async (req, res) => {
    try {
        const userId = req.params.id;
        const data = await voipService.getSipCredentials(userId);
        res.status(201).json(data);
    } catch (err) {
        console.error("Lỗi lấy SIP credentials:", err.message);
        return res.status(500).json({ error: err.message });
    }
};
