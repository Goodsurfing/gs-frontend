import { useEffect } from "react";
import { BASE_URL } from "@/shared/constants/api";

export const useGetChatMessages = (
    chatId: string,
    token: string,
    setMessages: (messages: (prevMessages: any[]) => any[]) => void,
) => {
    useEffect(() => {
        if (!token || !chatId) return;

        const topicUrl = encodeURIComponent(`${BASE_URL}api/chats/${chatId}/messages`);
        const eventSourceUrl = `${BASE_URL}.well-known/mercure?topic=${topicUrl}&authorization=${token}`;

        const eventSource = new EventSource(eventSourceUrl);

        eventSource.onmessage = (event) => {
            const updatedMessage = JSON.parse(event.data);
            setMessages((prevMessages) => [...prevMessages, updatedMessage]);
        };

        eventSource.onerror = (error) => {
            // eslint-disable-next-line no-console
            console.error("EventSource error:", error);
        };

        return () => {
            eventSource.close();
        };
    }, [chatId, token, setMessages]);
};
