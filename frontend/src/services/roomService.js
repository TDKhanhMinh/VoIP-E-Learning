import http from "./http";


export const roomService = {

    createRoom: async (roomData) => {
        const res = await http.post("/room/create", roomData);
        return res.data;
    },

    getRoomById: async (roomId) => {
        const res = await http.get(`/room/${roomId}`);
        return res.data;
    },

    getRoomByClassId: async (classId) => {
        const res = await http.get(`/room/by-class/${classId}`);
        return res.data;
    },

    findRoomByJoinCode: async (joinCode) => {
        const res = await http.post("/room/join", { joinCode });
        return res.data;
    },

    startRoom: async (roomId) => {
        const res = await http.post(`/room/start/${roomId}`);
        return res.data;
    },

    endRoom: async (roomId) => {
        const res = await http.post(`/room/end/${roomId}`);
        return res.data;
    },

    addParticipant: async (roomId, participantData) => {
        const res = await http.post(`/room/add-participant/${roomId}`, participantData);
        return res.data;

    },


    removeParticipant: async (roomId, userIdOrEmail) => {
        const res = await http.post(`/room/remove-participant/${roomId}`, {
            userIdOrEmail,
        });
        return res.data;
    },

    getParticipants: async (roomId) => {
        const res = await http.get(`/room/participants/${roomId}`);
        return res.data;
    },

    getLivekitToken: async (roomId, identity, name, role = "student") => {
        const res = await http.post("/livekit/token", {
            roomId,
            identity,
            name,
            role
        });

        return res.data;
    },
};
