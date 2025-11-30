import { createApi } from "@reduxjs/toolkit/dist/query/react";
import { baseAdminQueryAcceptJson } from "@/shared/api/baseQuery/baseQuery";
import {
    AdminReviewVacancy,
    CreateAdminSkillRequest, EditAdminSkillRequest,
    EditReviewVacancy, GetAdminReviewVacancyListParams,
    GetAdminReviewVacancyListResponse, GetAdminSkillsParams, GetAdminSkillsResponse,
    SearchUsersParams,
    SearchUsersResponse,
} from "../model/types/adminSchema";
import {
    Category, CreateCategoryParams, GetCategoryResponse, UpdateCategoryParams,
} from "@/types/categories";
import { PaginationParams } from "@/types/api/pagination";
import { Skill } from "@/types/skills";

export const adminApi = createApi({
    reducerPath: "adminApi",
    baseQuery: baseAdminQueryAcceptJson,
    tagTypes: ["skill", "user", "reviewVacancy", "category"],
    endpoints: (build) => ({
        createSkill: build.mutation<void, CreateAdminSkillRequest>({
            query: (body) => {
                const { name, image } = body;
                const formData = new FormData();
                formData.append("name", name);
                formData.append("image", image);
                return {
                    url: "skill/create",
                    method: "POST",
                    body: formData,
                };
            },
            invalidatesTags: ["skill"],
        }),
        editSkill: build.mutation<void, EditAdminSkillRequest>({
            query: ({ skillId, body }) => {
                const { name, image } = body;
                const formData = new FormData();
                formData.append("name", name);
                if (image instanceof File) {
                    formData.append("image", image);
                }
                return {
                    url: `skill/edit/${skillId}`,
                    method: "POST",
                    body: formData,
                };
            },
            invalidatesTags: ["skill"],
        }),
        deleteSkill: build.mutation<void, number>({
            query: (skillId) => ({
                url: `skill/${skillId}`,
                method: "DELETE",
            }),
            invalidatesTags: ["skill"],
        }),
        getSkills: build.query<GetAdminSkillsResponse, undefined | Partial<GetAdminSkillsParams>>({
            query: (params) => ({
                url: "skill/list",
                method: "GET",
                params,
            }),
            providesTags: ["skill"],
        }),
        getSkillById: build.query<Skill, number>({
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
        getReviewVacanciesList: build.query<GetAdminReviewVacancyListResponse,
        GetAdminReviewVacancyListParams>({
            query: (params) => ({
                url: "review-vacancy/list",
                method: "GET",
                params,
            }),
            providesTags: ["reviewVacancy"],
        }),
        getReviewVacancyById: build.query<AdminReviewVacancy,
        string>({
            query: (reviewVacancyId) => ({
                url: `review-vacancy/${reviewVacancyId}`,
                method: "GET",
            }),
            providesTags: ["reviewVacancy"],
        }),
        createCategoryVacancy: build.mutation<void, CreateCategoryParams>({
            query: ({ name, color, image }) => {
                const formData = new FormData();
                formData.append("name", name);
                formData.append("color", color);
                formData.append("image", image);

                return {
                    url: "category/create",
                    method: "POST",
                    body: formData,
                };
            },
            invalidatesTags: ["category"],
        }),
        editCategoryVacancy: build.mutation<void, UpdateCategoryParams>({
            query: ({ id, data }) => {
                const { name, color, image } = data;
                const formData = new FormData();
                formData.append("name", name);
                formData.append("color", color);
                if (image instanceof File) {
                    formData.append("image", image);
                }
                return {
                    url: `category/edit/${id}`,
                    method: "POST",
                    body: formData,
                };
            },
            invalidatesTags: ["category"],
        }),
        deleteCategoryVacancy: build.mutation<void, number>({
            query: (id) => ({
                url: `category/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["category"],
        }),
        getCategoriesVacancy: build.query<GetCategoryResponse,
        PaginationParams>({
            query: (params) => ({
                url: "category/list",
                method: "GET",
                params,
            }),
            providesTags: ["category"],
        }),
        getCategoryVacancyById: build.query<Category,
        number>({
            query: (id) => ({
                url: `category/${id}`,
                method: "GET",
            }),
            providesTags: ["category"],
        }),
    }),
});

export const {
    useCreateSkillMutation,
    useEditSkillMutation, useDeleteSkillMutation,
    useGetSkillsQuery,
    useLazyGetSkillsQuery,
    useGetSkillByIdQuery,
    useLazyGetSkillByIdQuery,
    useAddAdminRoleToUserMutation,
    useLazySearchUserByParamsQuery,
    useEditReviewVacancyMutation,
    useDeleteReviewVacancyMutation,
    useGetReviewVacanciesListQuery,
    useLazyGetReviewVacanciesListQuery,
    useGetReviewVacancyByIdQuery,
    useLazyGetReviewVacancyByIdQuery,
    useCreateCategoryVacancyMutation,
    useEditCategoryVacancyMutation,
    useDeleteCategoryVacancyMutation,
    useGetCategoryVacancyByIdQuery,
    useLazyGetCategoriesVacancyQuery,
} = adminApi;
