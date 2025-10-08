import { createApi } from "@reduxjs/toolkit/dist/query/react";

import { baseQueryAcceptJson } from "@/shared/api/baseQuery/baseQuery";
import { ChatType, MessageType } from "@/entities/Messenger";
import {
    FormApplication, FormApplicationStatus, FullFormApplication, SimpleFormApplication,
} from "@/entities/Application";
import { CreateMessageResponse, CreateMessageType } from "../model/types/messages";

interface MessagesRequest {
    chatId: string;
    page: number;
    itemsPerPage: number;
}

interface MessageRequest {
    message: string;
}

interface UpdateFormApplicationStatus {
    applicationId: string;
    status: FormApplicationStatus;
}

export const chatApi = createApi({
    reducerPath: "chatApi",
    baseQuery: baseQueryAcceptJson,
    tagTypes: ["chat", "application"],
    endpoints: (build) => ({
        createMessage: build.mutation<CreateMessageResponse, CreateMessageType>({
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
        // applications
        createApplicationForm: build.mutation<FormApplication, FormData>({
            query: (data) => ({
                url: "application_forms",
                method: "POST",
                body: data,
            }),
            invalidatesTags: ["application", "chat"],
        }),
        updateApplicationFormStatusById: build.mutation<FormApplication,
        UpdateFormApplicationStatus>({
            query: ({ applicationId, status }) => ({
                url: `application_forms/${applicationId}/status`,
                method: "PATCH",
                headers: {
                    "Content-Type": "application/merge-patch+json",
                },
                body: JSON.stringify({ status }),
            }),
            invalidatesTags: ["application"],
        }),
        updateApplicationFormStatusByIdWithoutTags: build.mutation<FormApplication,
        UpdateFormApplicationStatus>({
            query: ({ applicationId, status }) => ({
                url: `application_forms/${applicationId}/status`,
                method: "PATCH",
                headers: {
                    "Content-Type": "application/merge-patch+json",
                },
                body: JSON.stringify({ status }),
            }),
        }),
        getApplicationFormById: build.query<FullFormApplication, string>({
            query: (applicationId) => ({
                url: `application_forms/${applicationId}`,
                method: "GET",
            }),
            providesTags: ["application"],
        }),
        getMyHostApplications: build.query<SimpleFormApplication[], void>({
            query: () => ({
                url: "personal/forms/with-organization",
                method: "GET",
            }),
            providesTags: ["application"],
        }),
        getMyVolunteerApplications: build.query<SimpleFormApplication[], void>({
            query: () => ({
                url: "personal/forms/with-volunteer",
                method: "GET",
            }),
            providesTags: ["application"],
        }),
    }),
});

export const {
    useCreateMessageMutation, useLazyGetMessagesByChatIdQuery,
    useGetMessagesByChatIdQuery, useGetChatQuery,
    useReadMessageMutation,
    useCreateApplicationFormMutation,
    useGetApplicationFormByIdQuery,
    useLazyGetApplicationFormByIdQuery,
    useGetMyHostApplicationsQuery,
    useLazyGetMyHostApplicationsQuery,
    useGetMyVolunteerApplicationsQuery,
    useLazyGetMyVolunteerApplicationsQuery,
    useUpdateApplicationFormStatusByIdMutation,
    useUpdateApplicationFormStatusByIdWithoutTagsMutation,
} = chatApi;
