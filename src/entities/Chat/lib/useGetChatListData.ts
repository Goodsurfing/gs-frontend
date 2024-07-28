import { useEffect, useState } from "react";
import { UserType } from "@/entities/Messenger";
import { BASE_URL } from "@/shared/constants/api";

export const useGetChatListData = (token: string | null) => {
    const [users, setUsers] = useState<UserType[]>([]);

    useEffect(() => {
        if (!token) return;

        const fetchChats = async () => {
            try {
                const orgResponse = await fetch(`${BASE_URL}api/personal/chats/with-organizations`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                const orgData = await orgResponse.json();

                const volResponse = await fetch(`${BASE_URL}api/personal/chats/with-volunteers`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                const volData = await volResponse.json();

                setUsers([...orgData, ...volData]);
            } catch (error) {
                console.error("Ошибка при получении чатов:", error);
            }
        };

        fetchChats();

        const orgEventSource = new EventSource(`${BASE_URL}.well-known/mercure?topic=${encodeURIComponent(`${BASE_URL}api/personal/chats/with-organizations`)}&access_token=${token}`);
        const volEventSource = new EventSource(`${BASE_URL}.well-known/mercure?topic=${encodeURIComponent(`${BASE_URL}api/personal/chats/with-volunteers`)}&access_token=${token}`);

        const handleEvent = (event: MessageEvent) => {
            const updatedChat = JSON.parse(event.data);
            setUsers((prevUsers) => {
                const userIndex = prevUsers.findIndex((user) => user.id === updatedChat.id);
                if (userIndex > -1) {
                    const updatedUsers = [...prevUsers];
                    updatedUsers[userIndex] = updatedChat;
                    return updatedUsers;
                }
                return [...prevUsers, updatedChat];
            });
        };

        orgEventSource.onmessage = handleEvent;
        volEventSource.onmessage = handleEvent;

        return () => {
            orgEventSource.close();
            volEventSource.close();
        };
    }, [token]);

    return { users };
};
