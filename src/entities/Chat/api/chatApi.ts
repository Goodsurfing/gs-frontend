import { createApi } from "@reduxjs/toolkit/dist/query/react";

import { baseQuery } from "@/shared/api/baseQuery/baseQuery";
import { FormApplicationRequest, FormApplicationResponse, Message } from "@/entities/Chat";

export const chatApi = createApi({
    reducerPath: "chatApi",
    baseQuery,
    tagTypes: ["chat"],
    endpoints: (build) => ({
        createApplicationForm: build.mutation<FormApplicationResponse, FormApplicationRequest>({
            query: (data) => ({
                url: "application_forms",
                method: "POST",
                body: data,
            }),
            invalidatesTags: ["chat"],
        }),
        getMessagesById: build.query<Message[], string>({
            query: (chatId) => ({
                url: `chats/${chatId}/messages`,
                method: "GET",
            }),
            providesTags: ["chat"],
        }),
        getChatsWithOrganizations: build.query<Offer, string>({
            query: () => ({
                url: "chats/my/with-organizations",
                method: "GET",
            }),
            providesTags: ["chat"],
        }),
        getChatsWithVolunteers: build.query<Offer, string>({
            query: () => ({
                url: "chats/my/with-volunteers",
                method: "GET",
            }),
            providesTags: ["chat"],
        }),
    }),
});
