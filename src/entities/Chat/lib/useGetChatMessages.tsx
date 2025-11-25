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
    const itemsPerPage = 50;

    const {
        data: messagesData, isLoading, isFetching, error,
    } = useGetMessagesByChatIdQuery(
        { chatId: chatId ?? "", page, itemsPerPage },
        { skip: !chatId, refetchOnMountOrArgChange: true },
    );

    useEffect(() => {
        setMessages([]);
        setPage(1);
        setHasMore(true);
    }, [chatId]);

    useEffect(() => {
        if (messagesData) {
            setMessages((prevMessages) => {
                const merged = [...prevMessages, ...messagesData];
                const uniqueMessagesMap = new Map();

                merged.forEach((msg) => {
                    uniqueMessagesMap.set(msg.id, msg);
                });

                return Array.from(uniqueMessagesMap.values()).sort(
                    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
                );
            });

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
            setMessages((prevMessages) => {
                if (prevMessages.some((msg) => msg.id === updatedMessage.id)) {
                    return prevMessages;
                }

                return [updatedMessage, ...prevMessages];
            });
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
