import { userService } from "../../services/userService";
import { chatService } from "../../services/chatService";
import React, { useState, useEffect, useRef, useCallback } from "react";
import { io } from "socket.io-client";
import { Send, MessageCircle, User, Circle } from "lucide-react";
import clsx from "clsx";
import { formatTime } from "../../utils/formatTime";
import ConversationHeaderDetails from "../../components/Chat/ConversationHeaderDetails";
import ConversationSkeleton from "./../../components/SkeletonLoading/ConversationSkeleton";
import MessageSkeleton from "./../../components/SkeletonLoading/MessageSkeleton";

const ManageTeacherChats = () => {
  const userID = sessionStorage
    .getItem("userId")
    ?.split('"')
    .join("")
    .toString();
  const [conversations, setConversations] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");

  const [isLoading, setIsLoading] = useState(true);
  const [isMessageLoading, setIsMessageLoading] = useState(false);

  const [isTyping, setIsTyping] = useState(false);
  const [userSelected, setUserSelected] = useState(null);
  const [unreadCounts, setUnreadCounts] = useState({});

  const messagesEndRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  const [socket, setSocket] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [onlineUsers, setOnlineUsers] = useState([]);

  useEffect(() => {
    if (!userID) return;
    const token = localStorage.getItem("token");
    if (!token) {
      console.error("No token found for socket");
      return;
    }

    const socketURL =
      import.meta.env.VITE_API_URL.replace(/\/api\/?$/, "").replace(/\/$/, "") +
      "/chat";

    const newSocket = io(socketURL, {
      transports: ["polling", "websocket"],
      auth: { token },
    });

    setSocket(newSocket);

    newSocket.on("connect", () => {
      console.log("Admin socket connected to /chat");
      setIsConnected(true);
      newSocket.emit("get_online_users");
    });

    newSocket.on("disconnect", () => {
      console.log("Admin socket disconnected");
      setIsConnected(false);
    });

    newSocket.on("online_users", (users) => {
      setOnlineUsers(users);
    });

    newSocket.on("user_online", (data) => {
      if (data.status === "online") {
        setOnlineUsers((prev) => {
          if (prev.find((u) => u.userId === data.userId)) return prev;
          return [...prev, data];
        });
      } else {
        setOnlineUsers((prev) => prev.filter((u) => u.userId !== data.userId));
      }
    });

    return () => {
      console.log("Cleaning up admin socket");
      newSocket.disconnect();
    };
  }, [userID]);

  const sendMessage = useCallback(
    (data) => {
      if (socket) socket.emit("send_message", data);
    },
    [socket]
  );

  const markAsRead = useCallback(
    (data) => {
      if (socket) socket.emit("mark_as_read", data);
    },
    [socket]
  );

  const startTyping = useCallback(
    (data) => {
      if (socket) socket.emit("typing_start", data);
    },
    [socket]
  );

  const stopTyping = useCallback(
    (data) => {
      if (socket) socket.emit("typing_stop", data);
    },
    [socket]
  );

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  useEffect(() => {
    loadConversations();
  }, [userID]);

  useEffect(() => {
    if (!socket) return;

    const handleReceiveMessage = (message) => {
      setConversations((prev) =>
        prev
          .map((conv) =>
            conv._id === message.conversation
              ? { ...conv, lastMessage: message, updatedAt: new Date() }
              : conv
          )
          .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
      );

      if (selectedChat && message.conversation === selectedChat._id) {
        setMessages((prev) => [...prev, message]);
        markAsRead({ conversationId: selectedChat._id });
      } else {
        setUnreadCounts((prev) => ({
          ...prev,
          [message.conversation]: (prev[message.conversation] || 0) + 1,
        }));
      }
    };

    const handleMessageSent = (message) => {
      if (selectedChat && message.conversation === selectedChat._id) {
        setMessages((prev) => [...prev, message]);
      }
      setConversations((prev) =>
        prev
          .map((conv) =>
            conv._id === message.conversation
              ? { ...conv, lastMessage: message, updatedAt: new Date() }
              : conv
          )
          .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
      );
    };

    const handleTyping = (data) => {
      if (
        selectedChat &&
        data.conversationId === selectedChat._id &&
        data.userId !== userID
      ) {
        setIsTyping(data.isTyping);
      }
    };

    const handleNewUserMessage = (data) => {
      setConversations((prev) =>
        prev
          .map((conv) =>
            conv._id === data.conversation
              ? { ...conv, lastMessage: data, updatedAt: new Date() }
              : conv
          )
          .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
      );

      if (!selectedChat || data.conversation !== selectedChat._id) {
        setUnreadCounts((prev) => ({
          ...prev,
          [data.conversation]: (prev[data.conversation] || 0) + 1,
        }));
      }
      loadConversations();
    };

    socket.on("receive_message", handleReceiveMessage);
    socket.on("message_sent", handleMessageSent);
    socket.on("user_typing", handleTyping);
    socket.on("new_user_message", handleNewUserMessage);

    return () => {
      socket.off("receive_message", handleReceiveMessage);
      socket.off("message_sent", handleMessageSent);
      socket.off("user_typing", handleTyping);
      socket.off("new_user_message", handleNewUserMessage);
    };
  }, [socket, selectedChat, userID, markAsRead]);

  const loadConversations = async () => {
    try {
      setIsLoading(true);
      const response = await chatService.getUsersWithConversations(userID);

      if (response) {
        const sortedConversations = response.sort((a, b) => {
          return new Date(b.updatedAt) - new Date(a.updatedAt);
        });
        setConversations(sortedConversations);

        const unreadCountsData = {};
        for (const conv of sortedConversations) {
          try {
            const unreadRes = await chatService.getUnreadCount(conv._id);
            if (unreadRes.success) {
              unreadCountsData[conv._id] = unreadRes.data.unreadCount || 0;
            }
          } catch (error) {
            console.error(
              "Error getting unread count for conversation",
              conv._id,
              error
            );
            unreadCountsData[conv._id] = 0;
          }
        }
        setUnreadCounts(unreadCountsData);

        if (!selectedChat && sortedConversations.length > 0) {
          handleSelectChat(sortedConversations[0]);
        }
      }
    } catch (error) {
      console.error("Error loading conversations:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadMessages = async (conversationId) => {
    try {
      setIsMessageLoading(true);
      const response = await chatService.getChatMessages(conversationId);

      if (response) {
        setMessages(response.messages);
        markAsRead({ conversationId: conversationId });
        setUnreadCounts((prev) => ({
          ...prev,
          [conversationId]: 0,
        }));
      }
    } catch (error) {
      console.error("Error loading messages:", error);
    } finally {
      setIsMessageLoading(false);
    }
  };

  const handleSelectChat = (conversation) => {
    if (selectedChat?._id === conversation._id) return;
    setSelectedChat(conversation);
    loadUserDetails(conversation);
    setMessages([]);
    loadMessages(conversation._id);
  };

  const loadUserDetails = async (conversation) => {
    const userDetailsID = getOtherParticipantId(conversation);
    const user = await userService.getUserById(userDetailsID);
    setUserSelected(user);
  };

  const handleSendMessage = () => {
    if (!newMessage.trim() || !selectedChat || !isConnected) return;
    const otherParticipant = selectedChat.participants.find(
      (p) => p !== userID
    );
    if (!otherParticipant) return;

    const messageData = {
      conversationId: selectedChat._id,
      receiverId: otherParticipant,
      content: newMessage.trim(),
      messageType: "text",
    };
    sendMessage(messageData);
    setNewMessage("");
    stopTyping({
      conversationId: selectedChat._id,
      receiverId: otherParticipant,
    });
  };

  const handleInputChange = (e) => {
    setNewMessage(e.target.value);
    if (selectedChat) {
      const otherParticipant = selectedChat.participants.find(
        (p) => p !== userID
      );
      if (otherParticipant) {
        startTyping({
          conversationId: selectedChat._id,
          receiverId: otherParticipant,
        });
        if (typingTimeoutRef.current) {
          clearTimeout(typingTimeoutRef.current);
        }
        typingTimeoutRef.current = setTimeout(() => {
          stopTyping({
            conversationId: selectedChat._id,
            receiverId: otherParticipant,
          });
        }, 1000);
      }
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const formatLastMessageTime = (timestamp) => {
    const now = new Date();
    const messageTime = new Date(timestamp);
    const diffInHours = Math.abs(now - messageTime) / 36e5;
    if (diffInHours < 1) {
      const diffInMinutes = Math.floor(diffInHours * 60);
      return `${diffInMinutes} phút trước`;
    } else if (diffInHours < 24) {
      return `${Math.floor(diffInHours)} giờ trước`;
    } else {
      return messageTime.toLocaleDateString("vi-VN");
    }
  };

  const getOtherParticipantId = (conversation) => {
    return conversation.participants.find((p) => p !== userID);
  };

  return (
    <div className="mt-4">
      <div className="container px-4 py-1 mx-auto">
        <div className="overflow-hidden bg-white dark:bg-gray-800 shadow-lg rounded-xl">
          <div className="flex h-[calc(100vh-180px)]">
            <div className="w-1/3 border-r border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 flex flex-col">
              <div className="p-4 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-gray-800 dark:text-white">
                    Cuộc trò chuyện
                  </h2>
                  <div className="flex items-center space-x-2">
                    <Circle
                      size={8}
                      className={`${
                        isConnected ? "text-green-500" : "text-red-500"
                      } fill-current`}
                    />
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {isConnected ? "Đã kết nối" : "Đang kết nối..."}
                    </span>
                  </div>
                </div>
              </div>

              <div className="overflow-y-auto flex-1">
                {isLoading ? (
                  [...Array(6)].map((_, i) => <ConversationSkeleton key={i} />)
                ) : conversations.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-64 p-8 text-gray-500 dark:text-gray-400">
                    <MessageCircle
                      size={48}
                      className="mb-4 text-gray-400 dark:text-gray-600"
                    />
                    <p className="text-center">Chưa có cuộc trò chuyện nào</p>
                    <p className="mt-2 text-sm text-center text-gray-400 dark:text-gray-500">
                      Cuộc trò chuyện sẽ xuất hiện khi sinh viên gửi tin nhắn
                    </p>
                  </div>
                ) : (
                  conversations.map((conv) => {
                    const otherParticipantId = getOtherParticipantId(conv);
                    const isOnline = onlineUsers.some(
                      (u) => u.userId === otherParticipantId
                    );
                    const unreadCount = unreadCounts[conv._id] || 0;

                    return (
                      <div
                        key={conv._id}
                        onClick={() => handleSelectChat(conv)}
                        className={`p-4 cursor-pointer transition-all duration-200 border-b border-gray-100 dark:border-gray-800 hover:bg-blue-50 dark:hover:bg-gray-800 ${
                          selectedChat?._id === conv._id
                            ? "bg-blue-100 dark:bg-gray-800 border-l-4 border-l-blue-500"
                            : ""
                        }`}
                      >
                        <div className="flex items-start space-x-3">
                          <div className="relative">
                            <div className="flex items-center justify-center w-12 h-12 bg-blue-500 dark:bg-blue-600 rounded-full shadow-md">
                              <User size={20} className="text-white" />
                            </div>
                            {isOnline && (
                              <div className="absolute w-4 h-4 bg-green-500 border-2 border-white rounded-full shadow-sm -bottom-1 -right-1"></div>
                            )}
                          </div>

                          <div className="flex-1 min-w-0">
                            <ConversationHeaderDetails
                              userId={otherParticipantId}
                              conv={conv}
                              unreadCount={unreadCount}
                              formatLastMessageTime={formatLastMessageTime}
                            />

                            {conv.lastMessage ? (
                              <p
                                className={`mt-2 text-sm truncate ${
                                  unreadCount > 0
                                    ? "text-gray-800 dark:text-white font-bold"
                                    : "text-gray-600 dark:text-gray-400"
                                }`}
                              >
                                {conv.lastMessage.sender !== userID
                                  ? ""
                                  : "Bạn: "}
                                {conv.lastMessage.content}
                              </p>
                            ) : (
                              <p className="mt-2 text-sm text-gray-400 dark:text-gray-500">
                                Chưa có tin nhắn nào
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>

            <div className="flex flex-col flex-1">
              {selectedChat ? (
                <>
                  <div className="p-4 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
                    <div className="flex items-center space-x-3">
                      <div className="flex items-center justify-center w-12 h-12 bg-blue-500 dark:bg-blue-600 rounded-full shadow-lg">
                        <User size={20} className="text-white" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
                          {userSelected?.full_name || (
                            <div className="h-5 w-32 bg-gray-200 rounded animate-pulse inline-block"></div>
                          )}
                        </h3>
                        <div className="flex items-center space-x-2">
                          <Circle
                            size={8}
                            className={`${
                              onlineUsers.some(
                                (u) =>
                                  u.userId ===
                                  getOtherParticipantId(selectedChat)
                              )
                                ? "text-green-500"
                                : "text-gray-400"
                            } fill-current`}
                          />
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {onlineUsers.some(
                              (u) =>
                                u.userId === getOtherParticipantId(selectedChat)
                            )
                              ? "Đang hoạt động"
                              : "Ngoại tuyến"}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex-1 p-4 space-y-2 overflow-y-auto bg-gray-50 dark:bg-gray-900">
                    {isMessageLoading ? (
                      <MessageSkeleton />
                    ) : messages?.length === 0 ? (
                      <div className="flex items-center justify-center h-full">
                        <div className="text-center text-gray-500 dark:text-gray-400">
                          <MessageCircle
                            size={48}
                            className="mx-auto mb-4 text-gray-400 dark:text-gray-600"
                          />
                          <p>Chưa có tin nhắn nào</p>
                          <p className="mt-2 text-sm text-gray-400 dark:text-gray-500">
                            Tin nhắn sẽ xuất hiện ở đây
                          </p>
                        </div>
                      </div>
                    ) : (
                      messages?.map((msg, index) => {
                        const isMyMessage = msg.sender === userID;
                        const prevSender = messages[index - 1]?.sender;
                        const nextSender = messages[index + 1]?.sender;
                        const isSameAsPrev = prevSender === msg.sender;
                        const isSameAsNext = nextSender === msg.sender;

                        return (
                          <div
                            key={msg._id || `temp-${index}`}
                            className={clsx(
                              "flex",
                              isMyMessage ? "justify-end" : "justify-start"
                            )}
                          >
                            <div
                              className={clsx(
                                "px-4 py-3 max-w-xs lg:max-w-md shadow-sm",
                                "rounded-2xl",
                                isMyMessage
                                  ? "bg-blue-500 dark:bg-blue-600 text-white"
                                  : "bg-white dark:bg-gray-700 text-gray-800 dark:text-white border border-gray-200 dark:border-gray-600",
                                isMyMessage && isSameAsNext && "rounded-br-md",
                                isMyMessage && isSameAsPrev && "rounded-tr-md",
                                !isMyMessage && isSameAsNext && "rounded-bl-md",
                                !isMyMessage && isSameAsPrev && "rounded-tl-md",
                                isSameAsNext ? "mb-0.5" : "mb-2"
                              )}
                            >
                              <p className="text-sm leading-relaxed">
                                {msg.content}
                              </p>
                              <p
                                className={clsx(
                                  "mt-2 text-xs",
                                  isMyMessage
                                    ? "text-blue-100 dark:text-blue-200"
                                    : "text-gray-500 dark:text-gray-400"
                                )}
                              >
                                {formatTime(msg.createdAt)}
                              </p>
                            </div>
                          </div>
                        );
                      })
                    )}

                    {isTyping && (
                      <div className="flex justify-start">
                        <div className="px-4 py-3 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 shadow-sm rounded-2xl rounded-bl-md">
                          <div className="flex space-x-1">
                            <div className="w-2 h-2 bg-gray-400 dark:bg-gray-500 rounded-full animate-bounce"></div>
                            <div
                              className="w-2 h-2 bg-gray-400 dark:bg-gray-500 rounded-full animate-bounce"
                              style={{ animationDelay: "0.1s" }}
                            ></div>
                            <div
                              className="w-2 h-2 bg-gray-400 dark:bg-gray-500 rounded-full animate-bounce"
                              style={{ animationDelay: "0.2s" }}
                            ></div>
                          </div>
                        </div>
                      </div>
                    )}

                    <div ref={messagesEndRef} />
                  </div>

                  <div className="p-4 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
                    <div className="flex gap-3">
                      <input
                        type="text"
                        value={newMessage}
                        onChange={handleInputChange}
                        onKeyPress={handleKeyPress}
                        placeholder="Nhập tin nhắn của bạn..."
                        className="flex-1 px-4 py-3 transition-all border border-gray-300 dark:border-gray-600 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 dark:text-white dark:placeholder-gray-400"
                        disabled={!isConnected}
                      />
                      <button
                        onClick={handleSendMessage}
                        disabled={!newMessage.trim() || !isConnected}
                        className="flex items-center gap-2 px-6 py-3 text-white transition-all bg-blue-500 rounded-lg shadow-sm hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed"
                      >
                        <Send size={18} />
                        <span className="hidden sm:inline">Gửi</span>
                      </button>
                    </div>
                  </div>
                </>
              ) : (
                <div className="flex items-center justify-center h-full bg-gray-50 dark:bg-gray-900">
                  <div className="text-center text-gray-500 dark:text-gray-400">
                    <MessageCircle
                      size={64}
                      className="mx-auto mb-6 text-gray-400 dark:text-gray-600"
                    />
                    <h3 className="mb-2 text-lg font-medium text-gray-700 dark:text-gray-300">
                      Chọn cuộc trò chuyện
                    </h3>
                    <p className="text-gray-500 dark:text-gray-400">
                      Chọn một cuộc trò chuyện từ danh sách bên trái để bắt đầu
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManageTeacherChats;
