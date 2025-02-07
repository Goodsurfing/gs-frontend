import { useEffect, useState } from "react";

import { FormApplicationStatus } from "@/entities/Application";
import {
    ChatsListWithOrganizations,
    ChatsListWithVolunteers,
} from "@/entities/Messenger";

import { BASE_URL } from "@/shared/constants/api";

export const useGetChatListData = (
    token: string | null,
    mercureToken: string | null,
) => {
    const [searchValue, setSearchValue] = useState<string>("");
    const [statusValue, setStatusValue] = useState<FormApplicationStatus | null>(null);
    const [chatsListWithVolunteers,
        setChatsListWithVolunteers] = useState<
    ChatsListWithVolunteers[]
    >([]);
    const [chatsListWithOrganizations,
        setChatsListWithOrganizations] = useState<ChatsListWithOrganizations[]>([]);

    useEffect(() => {
        if (!token || !mercureToken) return;
        const fetchChats = async () => {
            try {
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
        };

        const intervalId = setInterval(fetchChats, 10000);

        fetchChats();

        return () => clearInterval(intervalId);
    }, [mercureToken, searchValue, statusValue, token]);

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
