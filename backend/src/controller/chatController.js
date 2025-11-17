import { chatService } from "../service/chatService.js"; 

export const getConversations = async (req, res) => {
    try {
        const userId = req.user?.id || req.query.userId;

        if (!userId) {
            return res.status(400).json({
                success: false,
                message: "User ID is required",
            });
        }

       const conversations = await chatService.getConversations(userId);

        res.json({
            success: true,
            data: conversations,
        });
    } catch (error) {
        console.error("Error getting conversations:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message,
        });
    }
};

// Lấy messages trong một conversation
export const getMessages = async (req, res) => {
    try {
        const { conversationId } = req.params;
        const { page = 1, limit = 50 } = req.query;

        const data = await chatService.getMessages(conversationId, { page, limit });

        res.json({
            success: true,
            data: data,
        });
    } catch (error) {
        console.error("Error getting messages:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message,
        });
    }
};

export const createConversation = async (req, res) => {
    try {
        const { participantId } = req.body;
        const userId = req.user?.id || req.body.userId;

        if (!userId || !participantId) {
            return res.status(400).json({
                success: false,
                message: "User ID and Participant ID are required",
            });
        }

        const { conversation_chat, isNew } = await chatService.createConversation(
            userId,
            participantId
        );

        if (isNew) {
            res.status(201).json({
                success: true,
                data: conversation_chat,
                message: "Conversation created successfully",
            });
        } else {
            res.json({
                success: true,
                data: conversation_chat,
                message: "Conversation already exists",
            });
        }
    } catch (error) {
        console.error("Error creating conversation:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message,
        });
    }
};

// Lấy thông tin conversation
export const getConversation = async (req, res) => {
    try {
        const { conversationId } = req.params;

        const conversation = await chatService.getConversation(conversationId);

        if (!conversation) {
            return res.status(404).json({
                success: false,
                message: "Conversation not found",
            });
        }

        res.json({
            success: true,
            data: conversation,
        });
    } catch (error) {
        console.error("Error getting conversation:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message,
        });
    }
};

// Đánh dấu tin nhắn đã đọc
export const markAsRead = async (req, res) => {
    try {
        const { conversationId } = req.params;
        const userId = req.user?.id || req.body.userId;

        if (!userId) {
            return res.status(400).json({
                success: false,
                message: "User ID is required",
            });
        }

        await chatService.markAsRead(conversationId, userId);

        res.json({
            success: true,
            message: "Messages marked as read",
        });
    } catch (error) {
        console.error("Error marking messages as read:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message,
        });
    }
};

// Lấy số tin nhắn chưa đọc
export const getUnreadCount = async (req, res) => {
    try {
        const userId = req.params.id;

        if (!userId) {
            return res.status(400).json({
                success: false,
                message: "User ID is required",
            });
        }

        const unreadCount = await chatService.getUnreadCount(userId);

        res.json({
            success: true,
            data: { unreadCount },
        });
    } catch (error) {
        console.error("Error getting unread count:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message,
        });
    }
};

// Admin: Lấy danh sách user có conversation
export const getUsersWithConversations = async (req, res) => {
    try {
        const adminId = req.params.id;

        if (!adminId) {
            return res.status(400).json({
                success: false,
                message: "Admin ID is required",
            });
        }

        const conversations = await chatService.getUsersWithConversations(adminId);

        res.json({
            success: true,
            data: conversations,
        });
    } catch (error) {
        console.error("Error getting users with conversations:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message,
        });
    }
};