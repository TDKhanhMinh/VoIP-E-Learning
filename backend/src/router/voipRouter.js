import express from "express";
import { getSipCredentialsController } from "../controller/voipController.js";

const router = express.Router();

router.get("/credentials/:id", getSipCredentialsController);

export default router;
