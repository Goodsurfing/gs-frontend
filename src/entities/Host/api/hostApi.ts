import { createApi } from "@reduxjs/toolkit/dist/query/react";

import { baseQueryAcceptJson } from "@/shared/api/baseQuery/baseQuery";

import { Host } from "../model/types/host";

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
                url: "organizations/my",
                method: "GET",
            }),
            providesTags: ["host"],
        }),
        createHost: build.mutation<CreateHostResponse, FormData>({
            query: (body) => ({
                url: "organizations",
                method: "POST",
                headers: {
                    // "Content-Type": "multipart/form-data",
                },
                body,
            }),
            invalidatesTags: ["host"],
        }),
        updateHost: build.mutation<unknown, UpdateHostParams>({
            query: (data) => ({
                url: `organizations/${data.id}`,
                method: "PATH",
                body: data.body,
            }),
            invalidatesTags: ["host"],
        }),
    }),
});

export const {
    useCreateHostMutation,
    useGetHostByIdQuery,
    useGetMyHostQuery,
    useGetHostsQuery,
    useUpdateHostMutation,
} = hostApi;
