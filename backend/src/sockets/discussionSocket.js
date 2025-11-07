// import jwt from "jsonwebtoken";

// export default function discussionSocket(io) {
//     io.on("connection", (socket) => {
//         const { token, room } = socket.handshake.query;
//         try {
//             jwt.verify(token, process.env.JWT_SECRET);
//             socket.join(room);
//         } catch (err) {
//             socket.disconnect();
//         }
//     });
// }
import jwt from "jsonwebtoken";

export default function discussionSocket(io) {
    io.on("connection", (socket) => {
        try {
            const token = socket.handshake.auth?.token;
            const room = socket.handshake.auth?.room;

            if (!token || !room) {
                console.log("Missing token or room in auth");
                return socket.disconnect(true);
            }

            jwt.verify(token, process.env.JWT_SECRET);

            socket.join(room);
            console.log("Socket joined post:", room);

        } catch (err) {
            console.log("Invalid Token → Disconnect");
            socket.disconnect(true);
        }
    });
}
