import { useCallback, useEffect, useState } from "react";

import { FormApplicationStatus } from "@/entities/Application";
import {
    ChatsListWithOrganizations,
    ChatsListWithVolunteers,
    MessageType,
} from "@/entities/Messenger";

import { BASE_URL } from "@/shared/constants/api";

export const useGetChatListData = (
    token: string | null,
    mercureToken: string | null,
    onReadMessage: (chatId: string) => void,
) => {
    const [searchValue, setSearchValue] = useState<string>("");
    const [statusValue, setStatusValue] = useState<FormApplicationStatus | null>(null);
    const [chatsListWithVolunteers, setChatsListWithVolunteers] = useState<
    ChatsListWithVolunteers[]
    >([]);
    const [chatsListWithOrganizations,
        setChatsListWithOrganizations] = useState<ChatsListWithOrganizations[]>([]);

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
    }, [mercureToken, searchValue, statusValue, token]);

    useEffect(() => {
        fetchChats();
    }, [fetchChats, onReadMessage]);

    useEffect(() => {
        if (!mercureToken) return;

        const url = new URL(`${BASE_URL}.well-known/mercure`);
        url.searchParams.append(
            "topic",
            `${BASE_URL}api/v1/users/01963848-8806-75cb-a5d1-ea09debd39a6/messages/{?chat}`,
        );
        url.searchParams.append("authorization", mercureToken);

        const eventSource = new EventSource(url);

        eventSource.addEventListener("messageOnChat", (event) => {
            const updatedMessage: MessageType = JSON.parse(event.data);
            const tempUpdatedChatId = updatedMessage.chat.split("/").pop();
            if (tempUpdatedChatId) {
                const updatedChatId = parseInt(tempUpdatedChatId, 10);
                setChatsListWithVolunteers((prev) => prev.map(
                    (chat) => (chat.id === updatedChatId
                        ? {
                            ...chat,
                            lastMessage: updatedMessage,
                            countUnreadMessagesByOrganization:
                                      chat.countUnreadMessagesByOrganization
                                      + 1,
                        }
                        : chat),
                ));

                setChatsListWithOrganizations((prev) => prev.map(
                    (chat) => (chat.id === updatedChatId
                        ? {
                            ...chat,
                            lastMessage: updatedMessage,
                            countUnreadMessagesByVolunteer:
                                      chat.countUnreadMessagesByVolunteer + 1,
                        }
                        : chat),
                ));
            }
        });

        return () => {
            eventSource.close();
        };
    }, [mercureToken]);

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
    };
};
