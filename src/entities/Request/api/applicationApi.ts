import { createApi } from "@reduxjs/toolkit/dist/query/react";

import { baseQueryAcceptJson } from "@/shared/api/baseQuery/baseQuery";
import { FormApplicationResponse } from "@/entities/Chat";
import { Application } from "@/entities/Host";

export const applicationApi = createApi({
    reducerPath: "applicationApi",
    baseQuery: baseQueryAcceptJson,
    tagTypes: ["application"],
    endpoints: (build) => ({
        createApplicationForm: build.mutation<FormApplicationResponse, FormData>({
            query: (data) => ({
                url: "application_forms",
                method: "POST",
                body: data,
            }),
            invalidatesTags: ["application"],
        }),
        getApplicationFormById: build.query<Application, string>({
            query: (applicationId) => ({
                url: `application_forms/${applicationId}`,
                method: "GET",
            }),
            providesTags: ["application"],
        }),
        getMyHostApplications: build.query<Application, string>({
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
} = applicationApi;
