import { useCallback, useEffect, useState } from "react";

import { FormApplicationStatus } from "@/entities/Application";
import {
    ChatsList, MessageType,
} from "@/entities/Messenger";

import { API_BASE_URL } from "@/shared/constants/api";

export const useGetChatListData = (
    token: string | null,
    mercureToken: string | null,
) => {
    const [searchValue, setSearchValue] = useState<string>("");
    const [statusValue, setStatusValue] = useState<FormApplicationStatus | null>(null);
    const [chatsList, setChatsList] = useState<
    ChatsList[]
    >([]);

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
                `${API_BASE_URL}personal/chats${queryPart}`,
                {
                    credentials: "include",
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

    // Точечно обновляет lastMessage/countUnreadMessages чата по SSE-событию,
    // без полного сетевого рефетча всего списка (был источник "моргания" и
    // схлопывания непрочитанных чатов при активной переписке — row 116).
    // Если чата ещё нет в текущем списке (например, только что создан) —
    // просто игнорируем событие, он появится при следующем обычном fetchChats.
    const applyIncomingMessage = useCallback((updatedMessage: MessageType) => {
        const tempUpdatedChatId = updatedMessage.chat?.split("/").pop();
        if (!tempUpdatedChatId) return;
        const updatedChatId = parseInt(tempUpdatedChatId, 10);

        setChatsList((prev) => prev.map((chat) => {
            if (chat.id !== updatedChatId || !chat.lastMessage) return chat;

            return {
                ...chat,
                // author у ChatsList.lastMessage — Profile, а в SSE-пейлоаде
                // только id автора строкой; author нигде не рендерится в
                // превью чата (см. UserCard), поэтому оставляем прежний.
                lastMessage: { ...updatedMessage, author: chat.lastMessage.author },
                countUnreadMessages: chat.countUnreadMessages + 1,
            };
        }));
    }, []);

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
        applyIncomingMessage,
    };
};
