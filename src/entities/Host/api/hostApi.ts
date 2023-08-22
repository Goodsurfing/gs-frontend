import { createApi } from "@reduxjs/toolkit/dist/query/react";
import { baseQuery } from "@/shared/api/baseQuery/baseQuery";
import { Host } from "../model/types/host";

interface UpdateHostParams {
    body: Partial<Host>;
    uuid: string;
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
    baseQuery,
    tagTypes: ["host"],
    endpoints: (build) => ({
        getHostById: build.query<Host, string>({
            query: (id) => ({
                url: `/organization/${id}`,
                method: "GET",
            }),
            providesTags: ["host"],
        }),
        getHosts: build.query<GetHostsResponse | { list: [] }, void>({
            query: () => ({
                url: "/organization",
                method: "GET",
            }),
            providesTags: ["host"],
        }),
        createHost: build.mutation<CreateHostResponse, Partial<Host>>({
            query: (body) => ({
                url: "/organization/",
                method: "POST",
                body,
            }),
            invalidatesTags: ["host"],
        }),
        updateHost: build.mutation<unknown, UpdateHostParams>({
            query: ({ uuid, body }) => ({
                url: `/organization/${uuid}`,
                body,
            }),
            invalidatesTags: ["host"],
        }),
    }),
});
