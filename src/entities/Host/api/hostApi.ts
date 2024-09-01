import { createApi } from "@reduxjs/toolkit/dist/query/react";

import { Application, Host, HostMember } from "@/entities/Host";

import { baseQueryAcceptJson } from "@/shared/api/baseQuery/baseQuery";

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

interface CreateMemberOrganizationParams {
    organizationId: string;
    formData: FormData;
}

interface MemberOrganizationParams {
    organizationId: string;
    memberId: string;
}

interface MemberOrganizationResponse {
    id: number;
    profile: string;
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
        addMemberToOrganization: build.mutation<
        MemberOrganizationResponse,
        CreateMemberOrganizationParams
        >({
            query: ({ organizationId, formData }) => ({
                url: `organization/${organizationId}/members`,
                method: "POST",
                body: formData,
            }),
            invalidatesTags: ["host"],
        }),
        deleteHostMember: build.mutation<void, MemberOrganizationParams>({
            query: ({ organizationId, memberId }) => ({
                url: `organization/${organizationId}/members/${memberId}`,
                method: "DELETE",
            }),
            invalidatesTags: ["host"],
        }),
        getHostMembersById: build.query<HostMember[], string>({
            query: (organizationId) => ({
                url: `organization/${organizationId}/members`,
                method: "GET",
            }),
            providesTags: ["host"],
        }),
        getHostMemberById: build.query<HostMember, MemberOrganizationParams>({
            query: ({ organizationId, memberId }) => ({
                url: `organization/${organizationId}/members/${memberId}`,
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
