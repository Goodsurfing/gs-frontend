import { useCallback, useEffect, useState } from "react";
import { BASE_URL } from "@/shared/constants/api";
import { useLazyGetMessagesByChatIdQuery } from "../api/chatApi";
import { MessageType } from "@/entities/Messenger";

export const useGetChatMessages = (
    chatId: string | undefined,
    mercureToken: string | null,
    profileId?: string,
) => {
    const [messages, setMessages] = useState<MessageType[]>([]);
    const [hasMore, setHasMore] = useState(true);
    const [page, setPage] = useState(1);
    const [loadingInitial, setLoadingInitial] = useState(true);
    const itemsPerPage = 30;

    const [getMessagesData, { data: messagesData }] = useLazyGetMessagesByChatIdQuery();
    useEffect(() => {
        setMessages([]);
        setPage(1);
        setHasMore(true);
        setLoadingInitial(true);
    }, [chatId]);

    useEffect(() => {
        if (chatId) {
            getMessagesData({ chatId, page, itemsPerPage });
        }
    }, [chatId, getMessagesData, page]);

    useEffect(() => {
        if (messagesData && messagesData.length > 0) {
            setMessages((prevMessages) => [...prevMessages, ...messagesData]);
        }
        if (messagesData && messagesData.length < itemsPerPage) {
            setHasMore(false);
        }
        setLoadingInitial(false);
    }, [messagesData]);

    useEffect(() => {
        if (!mercureToken || !chatId || !profileId) return;

        const url = new URL(`${BASE_URL}.well-known/mercure`);
        url.searchParams.append("topic", `${BASE_URL}api/v1/users/${profileId}/messages/?chat=${chatId}`);
        url.searchParams.append("authorization", mercureToken);

        const eventSource = new EventSource(url);

        eventSource.addEventListener("messageOnChat", (event) => {
            const updatedMessage = JSON.parse(event.data);
            setMessages((prevMessages) => [updatedMessage, ...prevMessages]);
        });

        return () => {
            eventSource.close();
        };
    }, [chatId, mercureToken, profileId]);

    const fetchMoreMessages = useCallback(() => {
        if (hasMore) {
            setPage((prevPage) => prevPage + 1);
        }
    }, [hasMore]);

    return {
        messages, fetchMoreMessages, hasMore, loadingInitial,
    };
};
