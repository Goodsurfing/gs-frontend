import { createApi } from "@reduxjs/toolkit/dist/query/react";

import { baseQueryAcceptJson } from "@/shared/api/baseQuery/baseQuery";
import {
    ChatsList, ChatType, MessageType, GetChatsListRequest,
} from "@/entities/Messenger";
import {
    FormApplication, FormApplicationStatus, FullFormApplication,
    GetHostFormApplicationResponse, GetVolunteerFormApplicationResponse,
} from "@/entities/Application";
import { CreateMessageResponse, CreateMessageType } from "../model/types/messages";
import { PaginationParams } from "@/types/api/pagination";
import { API_BASE_URL_V3 } from "@/shared/constants/api";

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
        getChat: build.query<ChatType, string>({
            query: (chatId) => ({
                url: `chats/${chatId}`,
                method: "GET",
            }),
            providesTags: ["chat"],
        }),
        getMyChatsList: build.query<ChatsList[], GetChatsListRequest>({
            query: (request) => ({
                url: "personal/chats",
                method: "GET",
                params: request.params,
            }),
            providesTags: ["chat"],
        }),
        // applications
        createApplicationForm: build.mutation<FormApplication, FormData>({
            query: (data) => ({
                url: "applications",
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
                // body: { status },
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
                // body: { status },
            }),
        }),
        getApplicationFormById: build.query<FullFormApplication, string>({
            query: (applicationId) => ({
                url: `applications/${applicationId}`,
                method: "GET",
            }),
            providesTags: ["application"],
        }),
        getMyHostApplications: build.query<GetHostFormApplicationResponse, PaginationParams>({
            query: (params) => ({
                url: `${API_BASE_URL_V3}application/list-of-organization`,
                method: "GET",
                params,
            }),
            providesTags: ["application"],
        }),
        getMyVolunteerApplications: build.query<GetVolunteerFormApplicationResponse,
        PaginationParams>({
            query: (params) => ({
                url: `${API_BASE_URL_V3}application/list-of-volunteer`,
                method: "GET",
                params,
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
    useGetMyChatsListQuery,
    useLazyGetMyChatsListQuery,
} = chatApi;
