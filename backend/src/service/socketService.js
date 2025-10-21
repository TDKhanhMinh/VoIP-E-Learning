// /socket/socketService.js
export const socketService = {
    addUserToRoom(io, roomId, user) {
        console.log(`${user} joined room ${roomId}`);
        io.to(roomId).emit("userJoined", { user, roomId });
    },

    sendOffer(io, data) {
        io.to(data.roomId).emit("offer", data);
    },

    sendAnswer(io, data) {
        io.to(data.roomId).emit("answer", data);
    },

    sendCandidate(io, data) {
        io.to(data.roomId).emit("candidate", data);
    },

    removeUser(io, socketId) {
        console.log(`Socket ${socketId} disconnected`);
    },
};
