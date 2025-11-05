// import express from "express";
// import { startSession, joinRoom, endRoom } from "../controller/roomController.js";

// const router = express.Router();

// // Tạo buổi học mới (chỉ giáo viên)
// router.post("/class/:id/startSession", startSession);

// // Học viên tham gia buổi học
// router.post("/:id/join", joinRoom);

// // Kết thúc buổi học
// router.delete("/:id/end", endRoom);

// export default router;
import express from "express";
import * as controller from "../controller/roomController.js";

const router = express.Router();

router.post("/create", controller.createRoomController);
router.get("/:roomId", controller.getRoomByIdController);
router.post("/join", controller.joinRoomByCodeController);
router.post("/start/:roomId", controller.startRoomController);
router.post("/end/:roomId", controller.endRoomController);
router.post("/add-participant/:roomId", controller.addParticipantController);
router.post("/remove-participant/:roomId", controller.removeParticipantController);
router.get("/participants/:roomId", controller.getParticipantsController);

export default router;
