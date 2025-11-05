import express from "express";
import { getLivekitToken } from "../controller/livekitController.js";

const router = express.Router();

// POST /api/livekit/token
router.post("/token", getLivekitToken);

export default router;
