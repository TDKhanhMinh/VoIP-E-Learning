import express from "express";
import * as controller from "../controller/teachingScheduleController.js";

const router = express.Router();
router.get("/class/:id", controller.findByClassId);
router.get("/:id", controller.findById);
router.get("/teacher/:id", controller.findByTeacherId);
router.post('/teacher/:id/report-absence', controller.handleReportAbsence);

export default router;
