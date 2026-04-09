import { createApi } from "@reduxjs/toolkit/dist/query/react";
import { baseAdminQueryAcceptJson } from "@/shared/api/baseQuery/baseQuery";
import { API_BASE_URL_V3 } from "@/shared/constants/api";
import {
    CreateAdminOurTeam,
    GetAdminOurTeam,
    GetAdminOurTeamParams, GetAdminOurTeamResponse,
    GetOurTeamParams, GetOurTeamResponse, UpdateAdminOurTeamRequest,
} from "../model/types/adminOurTeam";

export const adminOurTeamApi = createApi({
    reducerPath: "adminOurTeamApi",
    baseQuery: baseAdminQueryAcceptJson,
    tagTypes: ["ourTeam"],
    endpoints: (build) => ({
        getOurTeamList: build.query<GetOurTeamResponse, GetOurTeamParams>({
            query: (params) => ({
                url: `${API_BASE_URL_V3}our-team/list`,
                method: "GET",
                params,
            }),
            providesTags: ["ourTeam"],
        }),
        getAdminOurTeamList: build.query<GetAdminOurTeamResponse, GetAdminOurTeamParams>({
            query: (params) => ({
                url: "our-team/list",
                method: "GET",
                params,
            }),
            providesTags: ["ourTeam"],
        }),
        getAdminOurTeamById: build.query<GetAdminOurTeam, string>({
            query: (id) => ({
                url: `our-team/element/${id}`,
                method: "GET",
            }),
            providesTags: ["ourTeam"],
        }),
        createAdminOurTeam: build.mutation<void, CreateAdminOurTeam>({
            query: (body) => ({
                url: "our-team/create",
                method: "POST",
                body,
            }),
            invalidatesTags: ["ourTeam"],
        }),
        updateAdminOurTeam: build.mutation<void, UpdateAdminOurTeamRequest>({
            query: ({ id, body }) => ({
                url: `our-team/edit/${id}`,
                method: "PATCH",
                body,
            }),
            invalidatesTags: ["ourTeam"],
        }),
        deleteAdminOurTeam: build.mutation<void, string>({
            query: (id) => ({
                url: `our-team/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["ourTeam"],
        }),
    }),
});

export const {
    useGetOurTeamListQuery,
    useLazyGetAdminOurTeamListQuery,
    useGetAdminOurTeamByIdQuery,
    useCreateAdminOurTeamMutation,
    useUpdateAdminOurTeamMutation,
    useDeleteAdminOurTeamMutation,
} = adminOurTeamApi;
