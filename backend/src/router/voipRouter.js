import express from "express";
const router = express.Router();

/**
 * Route cung cấp cấu hình SIP cho frontend
 */
router.get("/getCredentials", (req, res) => {
    const sipConfig = {
        wsServer: "wss://47.128.235.25:8089/ws",
        domain: "47.128.235.25",
        username: "webrtc-user",
        password: "StrongPass123",
    };
    res.json(sipConfig);
});

export default router;
