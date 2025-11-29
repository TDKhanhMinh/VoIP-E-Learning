import express from "express";
import * as controller from "../controller/roomController.js";

const router = express.Router();

router.post("/create", controller.createRoomController);
router.get("/:roomId", controller.getRoomByIdController);
router.post("/join", controller.joinRoomByCodeController);
router.post("/start/:roomId", controller.startRoomController);
router.post("/end/:roomId", controller.endRoomController);
router.post("/add-participant/:roomId", controller.addParticipantController);
router.post(
  "/remove-participant/:roomId",
  controller.removeParticipantController
);
router.get("/participants/:roomId", controller.getParticipantsController);

export default router;
