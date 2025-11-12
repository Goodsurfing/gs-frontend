import { createApi } from "@reduxjs/toolkit/dist/query/react";
import { baseAdminQueryAcceptJson } from "@/shared/api/baseQuery/baseQuery";
import {
    CreateAdminSkillRequest, EditAdminSkillRequest, GetAdminSkillsParams, GetAdminSkillsResponse,
} from "../model/types/adminSchema";

export const adminApi = createApi({
    reducerPath: "adminApi",
    baseQuery: baseAdminQueryAcceptJson,
    tagTypes: ["skill"],
    endpoints: (build) => ({
        createSkill: build.mutation<void, CreateAdminSkillRequest>({
            query: (body) => ({
                url: "skill/create",
                method: "POST",
                body,
            }),
            invalidatesTags: ["skill"],
        }),
        editSkill: build.mutation<void, EditAdminSkillRequest>({
            query: ({ skillId, body }) => ({
                url: `skill/edit/${skillId}`,
                method: "POST",
                body,
            }),
            invalidatesTags: ["skill"],
        }),
        deleteSkill: build.mutation<void, number>({
            query: (skillId) => ({
                url: `skill/${skillId}`,
                method: "DELETE",
            }),
            invalidatesTags: ["skill"],
        }),
        getSkills: build.query<void | GetAdminSkillsParams, GetAdminSkillsResponse>({
            query: (body) => ({
                url: "skill/list",
                method: "GET",
                params: body,
            }),
            providesTags: ["skill"],
        }),
    }),
});

export const {
    useCreateSkillMutation,
    useEditSkillMutation, useDeleteSkillMutation,
    useLazyGetSkillsQuery,
} = adminApi;
