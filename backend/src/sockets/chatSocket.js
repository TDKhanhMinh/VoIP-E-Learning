import jwt from "jsonwebtoken";
import message from "../model/message.js";
import conversation from "../model/conversation.js";

const chatSocket = (io) => {
    const userSocketMap = new Map();

    io.use((socket, next) => {
        try {
            const token = socket.handshake.auth?.token;
            if (!token) {
                console.log(" Missing token in handshake.auth");
                return next(new Error("Unauthorized"));
            }

            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            socket.userId = decoded.id;
            socket.userType = decoded.role || "user";
            next();
        } catch (err) {
            console.log(" Invalid token → disconnect");
            next(new Error("Unauthorized"));
        }
    });

    io.on("connection", (socket) => {
        console.log(` User connected: ${socket.id}`);

        try {
            const userId = socket.userId;
            const userType = socket.userType;

            if (!userId || !userType) {
                console.log("User info missing in token payload");
                socket.disconnect();
                return;
            }

            userSocketMap.set(userId, {
                socketId: socket.id,
                userType,
                userId,
            });

            socket.join(`user_${userId}`);
            if (userType === "admin") {
                socket.join("admin_room");
            }

            console.log(`${userType} ${userId} connected & joined with socket ${socket.id}`);

            if (userType === "admin") {
                const onlineUsers = Array.from(userSocketMap.values()).filter(
                    (u) => u.userType === "user"
                );
                socket.emit("online_users", onlineUsers);
            }

            if (userType !== "admin") {
                socket.to("admin_room").emit("user_online", {
                    userId,
                    userType,
                    status: "online",
                });
            }
        } catch (error) {
            console.error("Error in automatic join:", error);
            socket.emit("error", { message: "Failed to join" });
            socket.disconnect();
            return;
        }

        socket.on("send_message", async (data) => {
            try {
                const { conversationId, receiverId, content, messageType = "text" } = data;
                const senderId = socket.userId;
                console.log("Received send_message event");
                console.log("Sender ID from socket:", socket.userId);
                console.info("Content:", content);

                if (!senderId) {
                    socket.emit("error", { message: "Please join first" });
                    return;
                }

                let conversation_chat;
                if (conversationId) {
                    conversation_chat = await conversation.findById(conversationId);
                } else {
                    conversation_chat = await conversation.findOne({
                        participants: { $all: [senderId, receiverId] },
                        type: "private",
                    });

                    if (!conversation_chat) {
                        conversation_chat = new conversation({
                            participants: [senderId, receiverId],
                            type: "private",
                        });
                        await conversation_chat.save();
                    }
                }

                const newMessage = new message({
                    conversation: conversation_chat._id,
                    sender: senderId,
                    receiver: receiverId,
                    content,
                    messageType,
                    isRead: false,
                });

                await newMessage.save();
                console.log("New message", newMessage.content);

                conversation_chat.lastMessage = newMessage._id;
                await conversation_chat.save();

                const messageData = {
                    _id: newMessage._id,
                    conversation: conversation_chat._id,
                    sender: senderId,
                    receiver: receiverId,
                    content: newMessage.content,
                    messageType: newMessage.messageType,
                    isRead: newMessage.isRead,
                    createdAt: newMessage.createdAt,
                };

                socket.to(`user_${receiverId}`).emit("receive_message", messageData);
                socket.emit("message_sent", messageData);

                if (socket.userType === "user") {
                    socket.to("admin_room").emit("new_user_message", {
                        ...messageData,
                        fromUser: senderId,
                    });
                }

                console.log(`Message sent from ${senderId} to ${receiverId}`);
            } catch (error) {
                console.error("Error sending message:", error);
                socket.emit("error", { message: "Failed to send message" });
            }
        });

        socket.on("mark_as_read", async (data) => {
            try {
                const { messageId, conversationId } = data;
                const userId = socket.userId;

                if (messageId) {
                    await message.findByIdAndUpdate(messageId, { isRead: true });
                } else if (conversationId) {
                    await message.updateMany(
                        { conversation: conversationId, receiver: userId, isRead: false },
                        { isRead: true }
                    );
                }

                const messages = await message.find({
                    conversation: conversationId,
                    receiver: userId,
                });

                const senderIds = [
                    ...new Set(messages.map((msg) => msg.sender.toString())),
                ];

                senderIds.forEach((senderId) => {
                    socket.to(`user_${senderId}`).emit("message_read", {
                        conversationId,
                        readBy: userId,
                    });
                });
            } catch (error) {
                console.error("Error marking as read:", error);
                socket.emit("error", { message: "Failed to mark as read" });
            }
        });

        socket.on("get_online_users", () => {
            if (socket.userType === "admin") {
                const onlineUsers = Array.from(userSocketMap.values()).filter(
                    (u) => u.userType === "user"
                );
                socket.emit("online_users", onlineUsers);
            }
        });

        socket.on("typing_start", (data) => {
            const { conversationId, receiverId } = data;
            socket.to(`user_${receiverId}`).emit("user_typing", {
                userId: socket.userId,
                conversationId,
                isTyping: true,
            });
        });

        socket.on("typing_stop", (data) => {
            const { conversationId, receiverId } = data;
            socket.to(`user_${receiverId}`).emit("user_typing", {
                userId: socket.userId,
                conversationId,
                isTyping: false,
            });
        });

        socket.on("disconnect", () => {
            console.log(` User disconnected: ${socket.id}`);

            if (socket.userId) {
                userSocketMap.delete(socket.userId);
                socket.to("admin_room").emit("user_online", {
                    userId: socket.userId,
                    userType: socket.userType,
                    status: "offline",
                });

                console.log(`${socket.userType} ${socket.userId} disconnected`);
            }
        });

        socket.on("error", (error) => {
            console.error("Socket error:", error);
        });
    });
};

export default chatSocket;
