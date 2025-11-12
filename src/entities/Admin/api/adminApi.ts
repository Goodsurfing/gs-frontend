import { createApi } from "@reduxjs/toolkit/dist/query/react";
import { baseAdminQueryAcceptJson } from "@/shared/api/baseQuery/baseQuery";
import {
    AdminSkill,
    CreateAdminSkillRequest, EditAdminSkillRequest,
    EditReviewVacancy, GetAdminReviewVacancyListParams, GetAdminSkillsParams, GetAdminSkillsResponse,
    SearchUsersParams,
    SearchUsersResponse,
} from "../model/types/adminSchema";

export const adminApi = createApi({
    reducerPath: "adminApi",
    baseQuery: baseAdminQueryAcceptJson,
    tagTypes: ["skill", "user", "reviewVacancy"],
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
        getSkills: build.query<GetAdminSkillsResponse, undefined | GetAdminSkillsParams>({
            query: (params) => ({
                url: "skill/list",
                method: "GET",
                params,
            }),
            providesTags: ["skill"],
        }),
        getSkillById: build.query<AdminSkill, number>({
            query: (skillId) => ({
                url: `skill/${skillId}`,
                method: "GET",
            }),
            providesTags: ["skill"],
        }),
        addAdminRoleToUser: build.mutation<void, string >({ // Присвоение роли админ пользователю
            query: (userId) => ({
                url: "system-admin/add-role",
                method: "POST",
                body: {
                    id: userId,
                },
            }),
            invalidatesTags: ["user"],
        }),
        searchUserByParams: build.query<SearchUsersResponse, SearchUsersParams>({
            query: (params) => ({
                url: "system-admin/search",
                method: "GET",
                params,
            }),
            providesTags: ["user"],
        }),
        editReviewVacancy: build.mutation<void, EditReviewVacancy>({
            query: (data) => ({
                url: `review-vacancy/edit/${data.reviewId}`,
                method: "POST",
                body: data.body,
            }),
            invalidatesTags: ["reviewVacancy"],
        }),
        deleteReviewVacancy: build.mutation<void, EditReviewVacancy>({
            query: (data) => ({
                url: `review-vacancy/${data.reviewId}`,
                method: "DELETE",
                body: data.body,
            }),
            invalidatesTags: ["reviewVacancy"],
        }),
        getReviewVacancyList: build.query<AdminSkill, GetAdminReviewVacancyListParams>({
            query: (params) => ({
                url: "review-vacancy/list",
                method: "GET",
                params,
            }),
            providesTags: ["reviewVacancy"],
        }),
    }),
});

export const {
    useCreateSkillMutation,
    useEditSkillMutation, useDeleteSkillMutation,
    useLazyGetSkillsQuery,
} = adminApi;
