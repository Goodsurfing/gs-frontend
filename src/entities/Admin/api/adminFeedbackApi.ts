import { createApi } from "@reduxjs/toolkit/dist/query/react";
import { baseAdminQueryAcceptJson } from "@/shared/api/baseQuery/baseQuery";
import {
    GetAdminFeedback, GetAdminFeedbackListParams, GetAdminFeedbackListResponse,
    UpdateAdminFeedbackParams,
} from "../model/types/adminFeedbackSchema";

export const adminFeedbackApi = createApi({
    reducerPath: "adminFeedbackApi",
    baseQuery: baseAdminQueryAcceptJson,
    tagTypes: ["feedback"],
    endpoints: (build) => ({
        getAdminFeedbackList: build.query<GetAdminFeedbackListResponse,
        Partial<GetAdminFeedbackListParams>>({
            query: (params) => ({
                url: "feedback/list",
                method: "GET",
                params,
            }),
            providesTags: ["feedback"],
        }),
        getAdminFeedbackById: build.query<GetAdminFeedback, string>({
            query: (id) => ({
                url: `feedback/element/${id}`,
                method: "GET",
            }),
            providesTags: ["feedback"],
        }),
        updateAdminFeedback: build.mutation<void, UpdateAdminFeedbackParams>({
            query: ({ id, body }) => ({
                url: `feedback/edit/${id}`,
                method: "PATCH",
                body,
            }),
            invalidatesTags: ["feedback"],
        }),
        deleteAdminFeedback: build.mutation<void, string>({
            query: (id) => ({
                url: `feedback/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["feedback"],
        }),
    }),
});

export const {
    useLazyGetAdminFeedbackListQuery,
    useGetAdminFeedbackByIdQuery,
    useUpdateAdminFeedbackMutation,
    useDeleteAdminFeedbackMutation,
} = adminFeedbackApi;
