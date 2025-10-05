import express from "express";
import * as controller from "../controller/announcementController.js";

import { protect } from "../middlewares/authMiddleware.js";
import { validate } from "../middlewares/validate.js";
import { authorizeRoles } from "../middlewares/authorizeRole.js";
import {
  createAnnouncementSchema,
  updateAnnouncementSchema,
} from "../validation/announcement.validation.js";

const router = express.Router();

router.get("/", controller.getAll);
router.post(
  "/",
  protect,
  authorizeRoles("admin", "teacher"),
  validate(createAnnouncementSchema),
  controller.createAnnouncement
);
router.put(
  "/:id",
  protect,
  authorizeRoles("admin", "teacher"),
  validate(updateAnnouncementSchema),
  controller.updateAnnouncement
);
router.delete("/:id", controller.deleteAnnouncement);

export default router;
