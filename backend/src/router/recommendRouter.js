import express from "express";
import {
  createDocument,
  recommendDocuments,
  listDocuments,
  updateDocument,
  deleteDocument,
  getDocument,
} from "../controller/recommendController.js";
import { protect } from "../middlewares/authMiddleware.js";
import { authorizeRoles } from "../middlewares/authorizeRole.js";
const router = express.Router();

router.get("/list", listDocuments);
router.post("/recommend", recommendDocuments);
router.get("/:id", getDocument);

router.post("/create", protect, authorizeRoles("admin"), createDocument);
router.put("/:id", protect, authorizeRoles("admin"), updateDocument);
router.delete("/:id", protect, authorizeRoles("admin"), deleteDocument);

export default router;
