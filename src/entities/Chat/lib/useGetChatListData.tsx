import { useCallback, useEffect, useState } from "react";

import { FormApplicationStatus } from "@/entities/Application";
import {
    ChatsList,
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
    const [chatsList, setChatsList] = useState<
    ChatsList[]
    >([]);

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

            const chatListResponse = await fetch(
                `${BASE_URL}api/v1/personal/chats${queryPart}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                },
            );
            const chatListData = await chatListResponse.json();

            setChatsList([...chatListData]);
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

            setChatsList((prev) => prev.map((chat) => (chat.id === updatedChatId
                ? {
                    ...chat,
                    lastMessage: updatedMessage,
                    countUnreadMessagesByOrganization:
                              chat.countUnreadMessagesByOrganization + 1,
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
        chatsList,
        searchValue,
        statusValue,
        onChangeSearchValue,
        onChangeStatusValue,
        fetchChats,
    };
};
