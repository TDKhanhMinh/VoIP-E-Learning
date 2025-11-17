
import http from './http';
export const chatService = {
    getChatConversation: async (conversationId) => {
        const res = await http.get(`chat/${conversationId}`);
        return res.data;
    },
    getChatMessages: async (id) => {
        const res = await http.get(`chat/${id}/messages`);
        return res.data.data;
    },
    createChat: async (data) => {
        console.log("Chat data sending ", data);
        const res = await http.post("chat/", data);
        return res.data;
    },
    getUnreadCount: async (id) => {
        const res = await http.get(`chat/${id}/unread-count`);
        return res.data.data;
    },
    getUsersWithConversations: async (id) => {
        const res = await http.get(`chat/admin/${id}/users`);
        return res.data.data;
    },
    markAsRead: async (id) => {
        const res = await http.post(`chat/${id}/read`);
        return res.data;
    }
};


