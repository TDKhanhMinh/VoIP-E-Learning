import express from "express";
import * as chatController from "../controller/chatController.js";
import { validate } from "../middlewares/validate.js";

import {
    createConversationSchema,
    markAsReadSchema,
    paginationSchema,
    conversationIdParamSchema,
} from "../validation/chat.validation.js";

const router = express.Router();


router.get(
    "/",
    chatController.getConversations
);

router.post(
    "/",
    validate(createConversationSchema, 'body'),
    chatController.createConversation
);

router.get(
    "/:id/unread-count",
    chatController.getUnreadCount
);

router.get(
    "/admin/:id/users",
    chatController.getUsersWithConversations
);


router.get(
    "/:conversationId",
    validate(conversationIdParamSchema, 'params'),
    chatController.getConversation
);

router.get(
    "/:conversationId/messages",
    validate(conversationIdParamSchema, 'params'),
    validate(paginationSchema, 'query'),
    chatController.getMessages
);

router.post(
    "/:conversationId/read",
    validate(conversationIdParamSchema, 'params'),
    validate(markAsReadSchema, 'body'),
    chatController.markAsRead
);

export default router;