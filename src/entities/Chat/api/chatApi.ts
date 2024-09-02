import { createApi } from "@reduxjs/toolkit/dist/query/react";

import { baseQueryAcceptJson } from "@/shared/api/baseQuery/baseQuery";
import { Message } from "@/entities/Chat";

export const chatApi = createApi({
    reducerPath: "chatApi",
    baseQuery: baseQueryAcceptJson,
    tagTypes: ["chat"],
    endpoints: (build) => ({
        getMessagesById: build.query<Message[], string>({
            query: (chatId) => ({
                url: `chats/${chatId}/messages`,
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
    }),
});
