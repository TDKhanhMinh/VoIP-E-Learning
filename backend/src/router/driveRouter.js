import express from "express";
import multer from "multer";
import { deleteFile, uploadFile } from "../controller/driveController.js";

const router = express.Router();
const upload = multer({ dest: "uploads/" });

router.post("/upload", upload.single("file"), uploadFile);

router.delete("/delete/:fileId", deleteFile);

export default router;
