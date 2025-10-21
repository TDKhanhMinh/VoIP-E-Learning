// /socket/socketController.js
import { socketService } from "../service/socketService.js";

export const socketController = (io, socket) => {
    console.log("Socket connected:", socket.id);

    socket.on("joinRoom", ({ roomId, user }) => {
        socket.join(roomId);
        socketService.addUserToRoom(io, roomId, user);
    });

    socket.on("offer", (data) => socketService.sendOffer(io, data));
    socket.on("answer", (data) => socketService.sendAnswer(io, data));
    socket.on("candidate", (data) => socketService.sendCandidate(io, data));

    socket.on("disconnect", () => socketService.removeUser(io, socket.id));
};
