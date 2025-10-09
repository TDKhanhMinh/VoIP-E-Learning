import express from "express";
import * as controller from "../controller/authController.js";

const router = express.Router();

router.get("/google", controller.googleLogin);
router.get("/google/callback", controller.googleCallback);
router.post("/login", controller.login);

export default router;

