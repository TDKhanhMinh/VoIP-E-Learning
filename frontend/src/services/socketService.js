// src/services/socketService.js
import { io } from "socket.io-client";

let socket;

export function initSocket(SERVER_URL, roomId, user, onEvents = {}) {
    socket = io(SERVER_URL, { transports: ["websocket"] });

    socket.on("connect", () => {
        console.log("🟢 Socket connected:", socket.id);
        socket.emit("joinRoom", { roomId, user });
    });

    socket.on("userJoined", (data) => onEvents?.onUserJoined?.(data));
    socket.on("offer", (data) => onEvents?.onOffer?.(data));
    socket.on("answer", (data) => onEvents?.onAnswer?.(data));
    socket.on("candidate", (data) => onEvents?.onCandidate?.(data));

    socket.on("disconnect", () => console.log("🔴 Socket disconnected"));
}

export function sendSignal(type, payload) {
    if (socket) socket.emit(type, payload);
}
