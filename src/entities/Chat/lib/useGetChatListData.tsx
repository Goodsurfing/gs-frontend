import { useCallback, useEffect, useState } from "react";

import { FormApplicationStatus } from "@/entities/Application";
import {
    ChatsListWithOrganizations,
    ChatsListWithVolunteers,
    MessageType,
} from "@/entities/Messenger";

import { BASE_URL } from "@/shared/constants/api";
import { useMessenger } from "@/app/providers/MessengerProvider";

export const useGetChatListData = (
    token: string | null,
    mercureToken: string | null,
) => {
    const [searchValue, setSearchValue] = useState<string>("");
    const [statusValue, setStatusValue] = useState<FormApplicationStatus | null>(null);
    const [chatsListWithVolunteers, setChatsListWithVolunteers] = useState<
    ChatsListWithVolunteers[]
    >([]);
    const [chatsListWithOrganizations,
        setChatsListWithOrganizations] = useState<ChatsListWithOrganizations[]>([]);

    const { registerOnMessageCallback } = useMessenger();

    const fetchChats = useCallback(async () => {
        try {
            if (!token || !mercureToken) return;
            const params = new URLSearchParams();
            if (searchValue) {
                params.append("search", searchValue);
            }
            if (statusValue) {
                params.append("status", statusValue);
            }
            const queryString = params.toString();
            const queryPart = queryString ? `?${queryString}` : "";

            const orgResponse = await fetch(
                `${BASE_URL}api/v1/personal/chats/with-organizations${queryPart}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                },
            );
            const orgData = await orgResponse.json();

            const volResponse = await fetch(
                `${BASE_URL}api/v1/personal/chats/with-volunteers${queryPart}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                },
            );
            const volData = await volResponse.json();

            setChatsListWithOrganizations([...orgData]);
            setChatsListWithVolunteers([...volData]);
        } catch {
            /* empty */
        }
    }, [mercureToken, searchValue,
        statusValue, token]);

    useEffect(() => {
        fetchChats();
    }, [fetchChats]);

    useEffect(() => {
        const unsubscribe = registerOnMessageCallback((updatedMessage: MessageType) => {
            const tempUpdatedChatId = updatedMessage.chat.split("/").pop();
            if (!tempUpdatedChatId) return;

            const updatedChatId = parseInt(tempUpdatedChatId, 10);

            setChatsListWithVolunteers((prev) => prev.map((chat) => (chat.id === updatedChatId
                ? {
                    ...chat,
                    lastMessage: updatedMessage,
                    countUnreadMessagesByOrganization:
                              chat.countUnreadMessagesByOrganization + 1,
                }
                : chat)));

            setChatsListWithOrganizations((prev) => prev.map((chat) => (chat.id === updatedChatId
                ? {
                    ...chat,
                    lastMessage: updatedMessage,
                    countUnreadMessagesByVolunteer:
                              chat.countUnreadMessagesByVolunteer + 1,
                }
                : chat)));
        });

        return () => {
            unsubscribe();
        };
    }, [registerOnMessageCallback]);

    const onChangeSearchValue = (value: string) => {
        setSearchValue(value);
    };

    const onChangeStatusValue = (value: FormApplicationStatus | null) => {
        setStatusValue(value);
    };

    return {
        chatsListWithVolunteers,
        chatsListWithOrganizations,
        searchValue,
        statusValue,
        onChangeSearchValue,
        onChangeStatusValue,
        fetchChats,
    };
};
