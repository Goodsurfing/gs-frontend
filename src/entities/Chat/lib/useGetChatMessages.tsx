import { useCallback, useEffect, useState } from "react";
import { BASE_URL } from "@/shared/constants/api";
import { useGetMessagesByChatIdQuery } from "../api/chatApi";
import { MessageType } from "@/entities/Messenger";

export const useGetChatMessages = (
    chatId: string | undefined,
    mercureToken: string | null,
    profileId?: string,
) => {
    const [messages, setMessages] = useState<MessageType[]>([]);
    const [hasMore, setHasMore] = useState(true);
    const [page, setPage] = useState(1);
    const itemsPerPage = 30;

    const {
        data: messagesData, isLoading, isFetching, error,
    } = useGetMessagesByChatIdQuery(
        { chatId: chatId ?? "", page, itemsPerPage },
        { skip: !chatId },
    );

    useEffect(() => {
        setMessages([]);
        setPage(1);
        setHasMore(true);
    }, [chatId]);

    useEffect(() => {
        if (messagesData) {
            setMessages((prevMessages) => [...prevMessages, ...messagesData]);
            setHasMore(messagesData.length === itemsPerPage);
        }
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
        if (hasMore && !isFetching) {
            setPage((prevPage) => prevPage + 1);
        }
    }, [hasMore, isFetching]);

    return {
        messages,
        fetchMoreMessages,
        hasMore,
        loadingInitial: isLoading && page === 1,
        loadingMore: isFetching && page > 1,
        error,
    };
};
