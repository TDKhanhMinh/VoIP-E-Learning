import express from "express";
import * as controller from "../controller/submissionController.js";

import { protect } from "../middlewares/authMiddleware.js";
import { validate } from "../middlewares/validate.js";
import {
  createSubmissionSchema,
  updateSubmissionSchema,
} from "../validation/submission.validation.js";

const router = express.Router();
router.get("/", protect, controller.getAll);

router.get("/assignment/:assignmentId", protect, controller.getByAssignment);

router.get("/student/:studentId", protect, controller.getByStudent);

router.get("/:id", protect, controller.findById);

router.post(
  "/",
  protect,
  validate(createSubmissionSchema),
  controller.createSubmission
);

router.put(
  "/:id",
  protect,
  validate(updateSubmissionSchema),
  controller.updateSubmission
);

router.delete("/:id", protect, controller.deleteSubmission);

export default router;
