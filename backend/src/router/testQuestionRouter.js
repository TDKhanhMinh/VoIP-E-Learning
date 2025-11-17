import * as controller from "../controller/testQuestionController.js";
import express from "express";
import { validate } from "../middlewares/validate.js";
import { testQuestionSchema } from "../validation/testQuestion.validation.js";

const router = express.Router();
router.get("/", controller.getAllTestQuestions);
router.get("/test/:testId", controller.getQuestionsByTestId);
router.post("", validate(testQuestionSchema), controller.createTestQuestion);
router.put("/:id", controller.updateTestQuestion);
router.delete("/:id", controller.deleteTestQuestion);

export default router;
