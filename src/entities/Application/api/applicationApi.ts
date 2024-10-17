import { createApi } from "@reduxjs/toolkit/dist/query/react";

import { baseQueryAcceptJson } from "@/shared/api/baseQuery/baseQuery";
import { FormApplication, FormApplicationStatus, FullFormApplication } from "../model/types/application";

interface UpdateFormApplicationStatus {
    applicationId: string;
    status: FormApplicationStatus;
}

export const applicationApi = createApi({
    reducerPath: "applicationApi",
    baseQuery: baseQueryAcceptJson,
    tagTypes: ["application"],
    endpoints: (build) => ({
        createApplicationForm: build.mutation<FormApplication, FormData>({
            query: (data) => ({
                url: "application_forms",
                method: "POST",
                body: data,
            }),
            invalidatesTags: ["application"],
        }),
        updateApplicationFormStatusById: build.mutation<FormApplication,
        UpdateFormApplicationStatus>({
            query: ({ applicationId, status }) => ({
                url: `application_forms${applicationId}/status`,
                method: "PATCH",
                body: { status },
            }),
            invalidatesTags: ["application"],
        }),
        getApplicationFormById: build.query<FullFormApplication, string>({
            query: (applicationId) => ({
                url: `application_forms/${applicationId}`,
                method: "GET",
            }),
            providesTags: ["application"],
        }),
        getMyHostApplications: build.query<FullFormApplication[], void>({
            query: () => ({
                url: "personal/organization/forms",
                method: "GET",
            }),
            providesTags: ["application"],
        }),
    }),
});

export const {
    useCreateApplicationFormMutation,
    useGetApplicationFormByIdQuery,
    useGetMyHostApplicationsQuery,
    useUpdateApplicationFormStatusByIdMutation,
} = applicationApi;
