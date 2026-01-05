import express from "express";
import * as chatController from "../controller/chatController.js";
import { validate } from "../middlewares/validate.js";

import { protect } from "./../middlewares/authMiddleware";
import {
  createConversationSchema,
  markAsReadSchema,
  paginationSchema,
  conversationIdParamSchema,
} from "../validation/chat.validation.js";

const router = express.Router();

router.get("/", protect, chatController.getConversations);

router.post(
  "/",
  protect,
  validate(createConversationSchema, "body"),
  chatController.createConversation
);

router.get("/:id/unread-count", protect, chatController.getUnreadCount);

router.get(
  "/admin/:id/users",
  protect,
  chatController.getUsersWithConversations
);

router.get(
  "/:conversationId",
  protect,
  validate(conversationIdParamSchema, "params"),
  chatController.getConversation
);

router.get(
  "/:conversationId/messages",
  protect,
  validate(conversationIdParamSchema, "params"),
  validate(paginationSchema, "query"),
  chatController.getMessages
);

router.post(
  "/:conversationId/read",
  protect,
  validate(conversationIdParamSchema, "params"),
  validate(markAsReadSchema, "body"),
  chatController.markAsRead
);

export default router;
