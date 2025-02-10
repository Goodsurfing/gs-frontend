import { createApi } from "@reduxjs/toolkit/dist/query/react";

import { baseQueryAcceptJson } from "@/shared/api/baseQuery/baseQuery";
import { Message } from "@/entities/Chat";
import { ChatType, MessageType } from "@/entities/Messenger";

interface MessagesRequest {
    chatId: string;
    page: number;
    itemsPerPage: number;
}

interface MessageRequest {
    message: string;
}

export interface CreateMessageType {
    text?: string;
    chat: string;
    attachments: string[];
}

export const chatApi = createApi({
    reducerPath: "chatApi",
    baseQuery: baseQueryAcceptJson,
    tagTypes: ["chat"],
    endpoints: (build) => ({
        createMessage: build.mutation<Message[], CreateMessageType>({
            query: (body) => ({
                url: "messages",
                method: "POST",
                body,
            }),
        }),
        readMessage: build.mutation<ChatType, MessageRequest>({
            query: (data) => ({
                url: "chats/read",
                method: "POST",
                body: data,
            }),
        }),
        getMessagesByChatId: build.query<MessageType[], MessagesRequest>({
            query: ({ chatId, page = 1, itemsPerPage = 30 }) => ({
                url: `chats/${chatId}/messages?page=${page}&itemsPerPage=${itemsPerPage}`,
                method: "GET",
            }),
            providesTags: ["chat"],
        }),
        getChatsWithOrganizations: build.query<any, string>({
            query: () => ({
                url: "chats/my/with-organizations",
                method: "GET",
            }),
            providesTags: ["chat"],
        }),
        getChatsWithVolunteers: build.query<any, string>({
            query: () => ({
                url: "chats/my/with-volunteers",
                method: "GET",
            }),
            providesTags: ["chat"],
        }),
        getChat: build.query<ChatType, string>({
            query: (chatId) => ({
                url: `chats/${chatId}`,
                method: "GET",
            }),
            providesTags: ["chat"],
        }),
    }),
});

export const {
    useCreateMessageMutation, useLazyGetMessagesByChatIdQuery,
    useGetMessagesByChatIdQuery, useGetChatQuery,
    useReadMessageMutation,
} = chatApi;
