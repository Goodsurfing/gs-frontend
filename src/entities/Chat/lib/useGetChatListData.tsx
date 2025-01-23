import { useEffect, useState } from "react";

import {
    ChatsListWithOrganizations,
    ChatsListWithVolunteers,
} from "@/entities/Messenger";

import { BASE_URL } from "@/shared/constants/api";

export const useGetChatListData = (token: string | null, mercureToken: string | null) => {
    const [chatsListWithVolunteers,
        setChatsListWithVolunteers] = useState<ChatsListWithVolunteers[]>([]);
    const [chatsListWithOrganizations,
        setChatsListWithOrganizations] = useState<ChatsListWithOrganizations[]>([]);

    useEffect(() => {
        if (!token || !mercureToken) return;
        const fetchChats = async () => {
            try {
                const orgResponse = await fetch(
                    `${BASE_URL}api/v1/personal/chats/with-organizations`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    },
                );
                const orgData = await orgResponse.json();

                const volResponse = await fetch(
                    `${BASE_URL}api/v1/personal/chats/with-volunteers`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    },
                );
                const volData = await volResponse.json();

                setChatsListWithOrganizations([...orgData]);
                setChatsListWithVolunteers([...volData]);
            } catch { /* empty */ }
        };

        const intervalId = setInterval(fetchChats, 10000);

        fetchChats();

        return () => clearInterval(intervalId);
    }, [mercureToken, token]);

    return { chatsListWithVolunteers, chatsListWithOrganizations };
};
