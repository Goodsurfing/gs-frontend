import { createApi } from "@reduxjs/toolkit/dist/query/react";

import { baseQueryAcceptJson } from "@/shared/api/baseQuery/baseQuery";

import { Application, Host } from "@/entities/Host";

interface UpdateHostParams {
    id: string;
    body: Partial<Host>;
}

interface CreateHostResponse {
    id: string;
    name: string;
    description: string;
}

interface GetHostsResponse {
    list: Host[];
}

export const hostApi = createApi({
    reducerPath: "hostApi",
    baseQuery: baseQueryAcceptJson,
    tagTypes: ["host"],
    endpoints: (build) => ({
        getHostById: build.query<Host, string>({
            query: (id) => ({
                url: `organizations/${id}`,
                method: "GET",
            }),
            providesTags: ["host"],
        }),
        getHosts: build.query<GetHostsResponse | { list: [] }, void>({
            query: () => ({
                url: "organizations/",
                method: "GET",
            }),
            providesTags: ["host"],
        }),
        getMyHost: build.query<Host, void>({
            query: () => ({
                url: "personal/organization",
                method: "GET",
            }),
            providesTags: ["host"],
        }),
        createHost: build.mutation<CreateHostResponse, FormData>({
            query: (body) => ({
                url: "organizations",
                method: "POST",
                body,
            }),
            invalidatesTags: ["host"],
        }),
        updateHost: build.mutation<Host, UpdateHostParams>({
            query: (data) => ({
                url: `organizations/${data.id}`,
                method: "PATCH",
                headers: {
                    "Content-Type": "application/merge-patch+json",
                },
                body: JSON.stringify(data.body),
            }),
            invalidatesTags: ["host"],
        }),
        getMyHostApplications: build.query<Application[], void>({
            query: () => ({
                url: "personal/organization/forms",
                method: "GET",
            }),
            providesTags: ["host"],
        }),
    }),
});

export const {
    useCreateHostMutation,
    useGetHostByIdQuery,
    useGetMyHostQuery,
    useGetHostsQuery,
    useUpdateHostMutation,
    useGetMyHostApplicationsQuery,
} = hostApi;
