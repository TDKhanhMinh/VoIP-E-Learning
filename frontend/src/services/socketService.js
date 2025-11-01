import io from "socket.io-client";

let socket;

export const initSocket = (serverUrl, roomId, username, onUserJoin) => {
  socket = io(serverUrl);
  socket.emit("joinRoom", { roomId, username });
  socket.on("userJoined", (data) => {
    console.log("👋 User joined:", data);
    if (onUserJoin) onUserJoin(data);
  });
  socket.on("disconnect", () => console.log("⚠️ Socket disconnected"));
};
