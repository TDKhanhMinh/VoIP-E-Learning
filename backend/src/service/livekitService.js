import { AccessToken } from "livekit-server-sdk";
import Room from "../model/room.js";

const LIVEKIT_API_KEY = process.env.LIVEKIT_API_KEY || "devkey";
const LIVEKIT_API_SECRET = process.env.LIVEKIT_API_SECRET || "secret123";
const LIVEKIT_URL = process.env.LIVEKIT_URL || "ws://localhost:7880";

export const generateLivekitToken = async (roomId, identity, name, role = "student") => {
    if (!roomId || !identity) {
        throw new Error("Thiếu thông tin roomId hoặc identity");
    }

    const room = await Room.findById(roomId);
    if (!room) throw new Error("Không tìm thấy phòng học");

    const roomName = room.roomName || room._id.toString();

    const at = new AccessToken(LIVEKIT_API_KEY, LIVEKIT_API_SECRET, {
        identity,
        name,
        ttl: "1h", 
    });

    const grant = {
        room: roomName,
        roomJoin: true,
        canSubscribe: true,
        canPublish: true, 

        // canPublish: role === "teacher", // chỉ teacher được bật mic/cam
    };

    at.addGrant(grant);

    const token =  await at.toJwt();

    return { token, livekitUrl: LIVEKIT_URL, roomName };
};
