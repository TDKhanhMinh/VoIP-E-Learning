import React, { useState, useEffect, useRef, useCallback } from 'react';
import io from 'socket.io-client';
import { FaCommentAlt, FaPaperPlane, FaTimes } from 'react-icons/fa';
import clsx from 'clsx';
import { toast } from 'react-toastify';
import { chatService } from '../services/chatService';
import { motion, AnimatePresence } from 'framer-motion';
import { formatTime } from '../utils/formatTime';

const USER_ID = sessionStorage.getItem("userId")?.replace(/"/g, "");
const ADMIN_ID = '690c256f073c3f2b9a72eaa3';
const getToken = () => localStorage.getItem("token");

export default function ChatWithAdmin() {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [socket, setSocket] = useState(null);
    const [conversationId, setConversationId] = useState(null);
    const messagesEndRef = useRef(null);
    const tempMessageRefs = useRef(new Map());

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    const fetchChatHistory = useCallback(async () => {
        try {
            const data = await chatService.createChat({ userId: USER_ID, participantId: ADMIN_ID });
            console.log("cón data", data);
            if (data.success) {
                setConversationId(data.data._id);
                const msgData = await chatService.getChatMessages(data.data._id);
                console.log("chat msg", msgData);

                if (msgData) {
                    let msgs = msgData.messages || [];

                    if (msgs.length === 0) {
                        msgs = [
                            {
                                _id: 'welcome-' + Date.now(),
                                sender: ADMIN_ID,
                                content: "Xin chào! Tôi có thể giúp gì cho bạn hôm nay?",
                                createdAt: new Date().toISOString(),
                            },
                        ];
                    }

                    setMessages(msgs);
                    setTimeout(scrollToBottom, 100);
                }
            }
        } catch (err) {
            console.error("Error loading chat:", err);
        }
    }, []);

    useEffect(() => {
        if (!conversationId) return;
        const token = getToken();
        if (!token) {
            toast.error("Token not found, please login again");
            return;
        }

        const newSocket = io(import.meta.env.VITE_API_URL.replace(/\/api\/?$/, "").replace(/\/$/, "") + "/chat", {
            transports: ["polling", "websocket"],
            auth: { token },
        });

        newSocket.on("connect", () => console.log("Connected with JWT verified socket"));

        newSocket.on("receive_message", (message) => {
            setMessages(prev => [...prev, message]);
        });

        newSocket.on("message_sent", (finalMessage) => {
            const tempId = tempMessageRefs.current.get(finalMessage.content);
            if (tempId) {
                setMessages(prev =>
                    prev.map(msg => (msg._id === tempId ? finalMessage : msg))
                );
                tempMessageRefs.current.delete(finalMessage.content);
            }
        });

        newSocket.on("error", (errorData) => {
            console.error("Socket error from server:", errorData.message);
            toast.error(`Lỗi gửi tin nhắn: ${errorData.message}`);
        });

        setSocket(newSocket);
        return () => newSocket.disconnect();
    }, [conversationId]);

    useEffect(() => {
        if (isOpen && !conversationId) fetchChatHistory();
    }, [isOpen, conversationId, fetchChatHistory]);

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSend = (e) => {
        e.preventDefault();
        const content = newMessage.trim();
        if (!content || !socket) return;

        const tempId = crypto.randomUUID();
        socket.emit("send_message", {
            content,
            conversationId,
            receiverId: ADMIN_ID,
        });

        tempMessageRefs.current.set(content, tempId);
        setMessages(prev => [
            ...prev,
            {
                _id: tempId,
                sender: USER_ID,
                content,
                createdAt: new Date().toISOString(),
            },
        ]);

        setNewMessage('');
    };

    return (
        <div className="fixed bottom-24 right-6 z-50 font-sans">
            {!isOpen && (
                <button
                    className="bg-blue-600 text-white rounded-full w-14 h-14 flex justify-center items-center shadow-lg hover:bg-blue-700"
                    onClick={() => setIsOpen(true)}
                >
                    <FaCommentAlt size={22} />
                </button>
            )}

            {isOpen && (
                <div className="w-[350px] h-[500px] bg-white rounded-lg shadow-xl flex flex-col">
                    <div className="bg-blue-600 text-white p-3 flex justify-between items-center rounded-t-lg">
                        <h3 className="font-semibold">Chat Hỗ Trợ</h3>
                        <FaTimes
                            className="cursor-pointer hover:text-gray-200"
                            onClick={() => setIsOpen(false)}
                        />
                    </div>

                    <div className="flex-1 overflow-y-auto p-3 bg-gray-100 flex flex-col">
                        <AnimatePresence>
                            {messages.map((msg, index) => {
                                const isMyMessage = msg.sender === USER_ID;
                                const prevSender = messages[index - 1]?.sender;
                                const nextSender = messages[index + 1]?.sender;
                                const isSameAsPrev = prevSender === msg.sender;
                                const isSameAsNext = nextSender === msg.sender;

                                return (
                                    <motion.div
                                        key={msg._id}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -10 }}
                                        transition={{ duration: 0.2 }}
                                        className={clsx(
                                            "max-w-[80%] p-2",
                                            isMyMessage
                                                ? "bg-blue-600 text-white self-end ml-auto"
                                                : "bg-gray-300 text-black",
                                            "rounded-xl",
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
                                                isMyMessage ? "text-blue-100" : "text-gray-500"
                                            )}
                                        >
                                            {formatTime(msg.createdAt)}
                                        </p>

                                    </motion.div>
                                );
                            })}
                        </AnimatePresence>

                        {(() => {
                            const lastMessage = messages[messages.length - 1];
                            if (lastMessage && lastMessage.sender === USER_ID && lastMessage.isRead) {
                                return (
                                    <div className="text-xs text-gray-500 text-right pr-2 mt-1">
                                        Đã xem
                                    </div>
                                );
                            }
                            return null;
                        })()}

                        <div ref={messagesEndRef} />
                    </div>

                    <form onSubmit={handleSend} className="p-3 bg-gray-100 flex border-t">
                        <input
                            type="text"
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                            placeholder="Nhập tin nhắn..."
                            className="flex-grow border rounded-full px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <button
                            type="submit"
                            className="ml-2 bg-blue-600 text-white rounded-full w-10 h-10 flex items-center justify-center hover:bg-blue-800"
                        >
                            <FaPaperPlane />
                        </button>
                    </form>
                </div>
            )}
        </div>
    );
}
