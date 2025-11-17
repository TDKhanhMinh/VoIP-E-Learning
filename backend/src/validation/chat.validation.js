import Joi from "joi";

export const createConversationSchema = Joi.object({
    userId: Joi.string().required().messages({
        "string.empty": "User ID is required",
        "any.required": "User ID is required",
    }),
    participantId: Joi.string().required().messages({
        "string.empty": "Participant ID is required",
        "any.required": "Participant ID is required",
    }),
});


export const markAsReadSchema = Joi.object({
    userId: Joi.string().required().messages({
        "string.empty": "User ID is required",
        "any.required": "User ID is required",
    }),
});

export const sendMessageSchema = Joi.object({
    conversationId: Joi.string().optional(),
    receiverId: Joi.string().required().messages({
        "string.empty": "Receiver ID is required",
        "any.required": "Receiver ID is required",
    }),
    content: Joi.string().required().min(1).max(1000).messages({
        "string.empty": "Message content is required",
        "string.min": "Message content cannot be empty",
        "string.max": "Message content cannot exceed 1000 characters",
        "any.required": "Message content is required",
    }),
    messageType: Joi.string().valid("text", "image", "file").default("text"),
});

export const paginationSchema = Joi.object({
    page: Joi.number().integer().min(1).default(1),
    limit: Joi.number().integer().min(1).max(100).default(50),
});

export const conversationIdParamSchema = Joi.object({
    conversationId: Joi.string().required().messages({ 
        "string.empty": "Conversation ID is required",
        "any.required": "Conversation ID is required",
    }),
});

// (Schema 'userIdParamSchema' bạn cung cấp có vẻ không được dùng ở route nào)