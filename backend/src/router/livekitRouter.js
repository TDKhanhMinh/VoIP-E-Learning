import express from "express";
import { getLivekitToken } from "../controller/livekitController.js";

const router = express.Router();

router.post("/token", getLivekitToken);

export default router;
