import React, { useState, useEffect, useRef, useCallback } from 'react';
import io from 'socket.io-client';
import { FaPaperPlane, FaTimes } from 'react-icons/fa';
import clsx from 'clsx';
import { toast } from 'react-toastify';
import { chatService } from '../services/chatService';
import { motion, AnimatePresence } from 'framer-motion';
import { formatTime } from '../utils/formatTime';
import { IoChatbubblesOutline } from "react-icons/io5";
import { useNavigate } from 'react-router-dom';
const USER_ID = sessionStorage.getItem("userId")?.replace(/"/g, "");
const getToken = () => localStorage.getItem("token");

export default function ChatWithTeacher({ TEACHER_ID }) {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [socket, setSocket] = useState(null);
    const [conversationId, setConversationId] = useState(null);
    const messagesEndRef = useRef(null);
    const navigate = useNavigate();
    const tempMessageRefs = useRef(new Map());

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    const fetchChatHistory = useCallback(async () => {
        try {
            const data = await chatService.createChat({ userId: USER_ID, participantId: TEACHER_ID });
            console.log("cón data", data);
            console.log("Teacher id", TEACHER_ID);

            if (data.success) {
                setConversationId(data.data._id);
                const msgData = await chatService.getChatMessages(data.data._id);
                console.log("chat msg", msgData);

                if (msgData) {
                    let msgs = msgData.messages || [];
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
            receiverId: TEACHER_ID,
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
        <div className=" z-50 font-sans">
            {!isOpen && (
                <button
                    className="px-4 mt-4 hover:bg-blue-500 hover:text-white w-full rounded-md  h-10 flex justify-center items-center shadow-lg bg-gray-100 "
                    onClick={() => {
                        setIsOpen(true)
                        navigate("/home/chat")
                    }}
                >
                    Liên hệ Giảng viên
                    <IoChatbubblesOutline size={22} className='mx-2' />
                </button>
            )}

            {isOpen && (
                <div className="w-[350px] h-[500px] bg-white rounded-lg shadow-xl flex flex-col hidden">
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
