// /socket/socketRouter.js
import { Server } from "socket.io";
import { socketController } from "../controller/socketController.js";

export const initSocket = (server, allowedOrigins) => {
    const io = new Server(server, {
        cors: {
            origin: allowedOrigins,
            methods: ["GET", "POST"],
            credentials: true,
        },
    });

    io.on("connection", (socket) => socketController(io, socket));
    console.log("Socket.IO initialized");
    return io;
};
