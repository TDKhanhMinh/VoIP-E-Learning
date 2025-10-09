import express from "express";
import * as controller from "../controller/submissionController.js";

import { protect } from "../middlewares/authMiddleware.js";
import { validate } from "../middlewares/validate.js";
import {
  createSubmissionSchema,
  updateSubmissionSchema,
} from "../validation/submission.validation.js";

const router = express.Router();

router.get("/", controller.getAll);
router.get("/:id", controller.findById);
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
router.delete("/:id", controller.deleteSubmission);

export default router;
