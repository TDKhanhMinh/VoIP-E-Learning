
export const initSignaling = (io) => {
    io.on("connection", (socket) => {
        console.log("user connected:", socket.id);

        socket.on("joinClass", ({ roomId, user }) => {
            socket.join(roomId);
            socket.to(roomId).emit("userJoined", user);
        });

        socket.on("offer", (data) => {
            socket.to(data.roomId).emit("offer", data);
        });

        socket.on("answer", (data) => {
            socket.to(data.roomId).emit("answer", data);
        });

        socket.on("candidate", (data) => {
            socket.to(data.roomId).emit("candidate", data);
        });

        socket.on("disconnect", () => {
            console.log("user disconnected:", socket.id);
        });
    });
};
