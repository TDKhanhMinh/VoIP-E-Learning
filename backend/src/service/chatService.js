import conversation from "../model/conversation.js";
import message from "../model/message.js";

const getConversations = async (userId) => {
  return await conversation
    .find({
      participants: userId,
    })
    .sort({ updatedAt: -1 });
};

const getMessages = async (conversationId, { page = 1, limit = 50 }) => {
  const skip = (page - 1) * limit;
  const limitNum = parseInt(limit);

  const messages = await message
    .find({ conversation: conversationId })
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limitNum);

  messages.reverse();

  const total = await message.countDocuments({
    conversation: conversationId,
  });

  const pagination = {
    current: parseInt(page),
    total: Math.ceil(total / limitNum),
    hasNext: skip + messages.length < total,
    hasPrev: page > 1,
  };

  return { messages, pagination };
};

const createConversation = async (userId, participantId) => {
  let conversation_chat = await conversation.findOne({
    participants: { $all: [userId, participantId] },
    type: "private",
  });

  if (conversation_chat) {
    return { conversation_chat, isNew: false };
  }

  conversation_chat = new conversation({
    participants: [userId, participantId],
    type: "private",
  });
  await conversation_chat.save();

  return { conversation_chat, isNew: true };
};

const getConversation = async (conversationId) => {
  return await conversation.findById(conversationId);
};

const markAsRead = async (conversationId, userId) => {
  await message.updateMany(
    {
      conversation: conversationId,
      receiver: userId,
      isRead: false,
    },
    { isRead: true }
  );
};

const getUnreadCount = async (userId) => {
  return await message.countDocuments({
    receiver: userId,
    isRead: false,
  });
};

const getUsersWithConversations = async (adminId) => {
  return await conversation
    .find({
      participants: adminId,
    })
    .sort({ updatedAt: -1 });
};

export const chatService = {
  getConversations,
  getMessages,
  createConversation,
  getConversation,
  markAsRead,
  getUnreadCount,
  getUsersWithConversations,
};
