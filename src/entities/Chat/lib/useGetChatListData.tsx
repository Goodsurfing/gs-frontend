import { useCallback, useEffect, useState } from "react";

import { FormApplicationStatus } from "@/entities/Application";
import {
    ChatsList,
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

    // useEffect(() => {
    //     const unsubscribe = registerOnMessageCallback((updatedMessage: MessageType) => {
    //         const tempUpdatedChatId = updatedMessage.chat.split("/").pop();
    //         if (!tempUpdatedChatId) return;

    //         console.log("updatedMessage", updatedMessage);
    //         const updatedChatId = parseInt(tempUpdatedChatId, 10);

    //         // setChatsList((prev) => prev.map((chat) => (chat.id === updatedChatId
    //         //     ? {
    //         //         ...chat,
    //         //         lastMessage: updatedMessage,
    //         //         countUnreadMessages: chat.countUnreadMessages + 1,
    //         //     }
    //         //     : chat)));
    //     });

    //     return () => {
    //         unsubscribe();
    //     };
    // }, [registerOnMessageCallback]);

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
