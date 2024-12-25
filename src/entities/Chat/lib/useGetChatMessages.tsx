import { useEffect, useState } from "react";
import { BASE_URL } from "@/shared/constants/api";
import { useGetMessagesByChatIdQuery } from "../api/chatApi";
import { MessageType } from "@/entities/Messenger";

export const useGetChatMessages = (
    chatId: string | undefined,
    mercureToken: string | null,
    profileId?: string,
) => {
    const { data: messagesData, isLoading } = useGetMessagesByChatIdQuery(chatId ?? "", { skip: !chatId });
    const [messages, setMessages] = useState<MessageType[]>([]);

    useEffect(() => {
        if (messagesData) {
            setMessages(messagesData);
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
            setMessages((prevMessages) => [...prevMessages, updatedMessage]);
        });

        return () => {
            eventSource.close();
        };
    }, [chatId, mercureToken, profileId]);

    return { messages, isLoading };
};
