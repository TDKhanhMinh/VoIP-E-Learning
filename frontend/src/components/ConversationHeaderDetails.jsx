import React, { useEffect, useState } from 'react';
import { Clock } from 'lucide-react';
import { userService } from '../services/userService';

const ConversationHeaderDetails = ({ userId, conv, unreadCount, formatLastMessageTime }) => {

    const [user, setUser] = useState(null);
    useEffect(() => {
        const fetchUserDetails = async () => {
            setUser(await userService.getUserById(userId));
            console.log("User details", await userService.getUserById(userId));

        };
        fetchUserDetails();
    }, [userId])

    return (
        <div className="flex items-center justify-between">
            <div className="flex flex-col space-y-1">
                <p className="font-semibold text-gray-800 truncate">
                    {user?.full_name}
                </p>
                <p className="font-base text-xs text-gray-800 truncate">
                    {user?.email}
                </p>
            </div>

            <div className="flex items-center space-x-2">
                {unreadCount > 0 && (
                    <span className="flex items-center justify-center w-6 h-6 text-xs font-bold text-white bg-red-500 rounded-full">
                        {unreadCount > 99 ? "99+" : unreadCount}
                    </span>
                )}

                {conv.lastMessage && (
                    <div className="flex items-center text-xs text-gray-500">
                        <Clock size={12} className="mr-1" />
                        {formatLastMessageTime(conv.updatedAt)}
                    </div>
                )}
            </div>
        </div>
    );
};

export default ConversationHeaderDetails;