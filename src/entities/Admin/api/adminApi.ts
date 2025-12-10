import { createApi } from "@reduxjs/toolkit/dist/query/react";
import { baseAdminQueryAcceptJson } from "@/shared/api/baseQuery/baseQuery";
import {
    AdminOrganization,
    AdminReviewVacancy,
    AdminUser,
    CreateAdminAchievementsRequest,
    CreateAdminFoodRequest,
    CreateAdminHouseRequest,
    CreateAdminSkillRequest, CreateAdminTransferRequest,
    EditAdminAchievementsRequest, EditAdminFoodRequest, EditAdminHouseRequest,
    EditAdminSkillRequest, EditAdminTransferRequest,
    EditReviewVacancy, GetAdminAchievementsParams,
    GetAdminAchievementsResponse, GetAdminFoodParams, GetAdminFoodResponse,
    GetAdminHouseParams, GetAdminHouseResponse,
    GetAdminOrganizationParams, GetAdminOrganizationResponse, GetAdminReviewVacancyListParams,
    GetAdminReviewVacancyListResponse, GetAdminSkillsParams, GetAdminSkillsResponse,
    GetAdminTransfersParams,
    GetAdminTransfersResponse,
    GetAdminUserParams,
    GetAdminUserResponse,
    SearchUsersParams,
    SearchUsersResponse,
    UpdateAdminOrganizationRequest,
    UpdateAdminUserRequest,
} from "../model/types/adminSchema";
import {
    Category, CreateCategoryParams, GetCategoryResponse, UpdateCategoryParams,
} from "@/types/categories";
import { PaginationParams } from "@/types/api/pagination";
import { Skill } from "@/types/skills";
import { Achievement } from "@/types/achievements";
import { Food, House, Transfer } from "@/shared/data/conditions";
import { API_BASE_URL_V3 } from "@/shared/constants/api";

export const adminApi = createApi({
    reducerPath: "adminApi",
    baseQuery: baseAdminQueryAcceptJson,
    tagTypes: ["skill", "user", "reviewVacancy", "category", "achievement", "transfer",
        "house", "food", "organization",
    ],
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
        createAchievement: build.mutation<void, CreateAdminAchievementsRequest>({
            query: (body) => {
                const { name, image } = body;
                const formData = new FormData();
                formData.append("name", name);
                formData.append("image", image);
                return {
                    url: "achievement/create",
                    method: "POST",
                    body: formData,
                };
            },
            invalidatesTags: ["achievement"],
        }),
        editAchievement: build.mutation<void, EditAdminAchievementsRequest>({
            query: ({ achievementId, body }) => {
                const { name, image } = body;
                const formData = new FormData();
                formData.append("name", name);
                if (image instanceof File) {
                    formData.append("image", image);
                }
                return {
                    url: `achievement/edit/${achievementId}`,
                    method: "POST",
                    body: formData,
                };
            },
            invalidatesTags: ["achievement"],
        }),
        deleteAchievement: build.mutation<void, number>({
            query: (achievementId) => ({
                url: `achievement/${achievementId}`,
                method: "DELETE",
            }),
            invalidatesTags: ["achievement"],
        }),
        getPublicAchievements: build.query<Achievement[],
        void>({
            query: () => ({
                url: `${API_BASE_URL_V3}achievement/list`,
                method: "GET",
            }),
            providesTags: ["achievement"],
        }),
        getAchievements: build.query<GetAdminAchievementsResponse,
        undefined | Partial<GetAdminAchievementsParams>>({
            query: (params) => ({
                url: "achievement/list",
                method: "GET",
                params,
            }),
            providesTags: ["achievement"],
        }),
        getAchievementById: build.query<Achievement, number>({
            query: (achievementId) => ({
                url: `achievement/${achievementId}`,
                method: "GET",
            }),
            providesTags: ["achievement"],
        }),
        createTransfer: build.mutation<void, CreateAdminTransferRequest>({
            query: (body) => {
                const { name, image } = body;
                const formData = new FormData();
                formData.append("name", name);
                formData.append("image", image);
                return {
                    url: "transfer/create",
                    method: "POST",
                    body: formData,
                };
            },
            invalidatesTags: ["transfer"],
        }),
        editTransfer: build.mutation<void, EditAdminTransferRequest>({
            query: ({ transferId, body }) => {
                const { name, image } = body;
                const formData = new FormData();
                formData.append("name", name);
                if (image instanceof File) {
                    formData.append("image", image);
                }
                return {
                    url: `transfer/edit/${transferId}`,
                    method: "POST",
                    body: formData,
                };
            },
            invalidatesTags: ["transfer"],
        }),
        deleteTransfer: build.mutation<void, number>({
            query: (transferId) => ({
                url: `transfer/${transferId}`,
                method: "DELETE",
            }),
            invalidatesTags: ["transfer"],
        }),
        getTransfers: build.query<GetAdminTransfersResponse,
        undefined | Partial<GetAdminTransfersParams>>({
            query: (params) => ({
                url: "transfer/list",
                method: "GET",
                params,
            }),
            providesTags: ["transfer"],
        }),
        getTransfertById: build.query<Transfer, number>({
            query: (transferId) => ({
                url: `transfer/${transferId}`,
                method: "GET",
            }),
            providesTags: ["transfer"],
        }),
        createHouse: build.mutation<void, CreateAdminHouseRequest>({
            query: (body) => {
                const { name, image } = body;
                const formData = new FormData();
                formData.append("name", name);
                formData.append("image", image);
                return {
                    url: "house/create",
                    method: "POST",
                    body: formData,
                };
            },
            invalidatesTags: ["house"],
        }),
        editHouse: build.mutation<void, EditAdminHouseRequest>({
            query: ({ houseId, body }) => {
                const { name, image } = body;
                const formData = new FormData();
                formData.append("name", name);
                if (image instanceof File) {
                    formData.append("image", image);
                }
                return {
                    url: `house/edit/${houseId}`,
                    method: "POST",
                    body: formData,
                };
            },
            invalidatesTags: ["house"],
        }),
        deleteHouse: build.mutation<void, number>({
            query: (houseId) => ({
                url: `house/${houseId}`,
                method: "DELETE",
            }),
            invalidatesTags: ["house"],
        }),
        getHouses: build.query<GetAdminHouseResponse,
        undefined | Partial<GetAdminHouseParams>>({
            query: (params) => ({
                url: "house/list",
                method: "GET",
                params,
            }),
            providesTags: ["house"],
        }),
        getHouseById: build.query<House, number>({
            query: (houseId) => ({
                url: `house/${houseId}`,
                method: "GET",
            }),
            providesTags: ["house"],
        }),
        createFood: build.mutation<void, CreateAdminFoodRequest>({
            query: (body) => {
                const { name, image } = body;
                const formData = new FormData();
                formData.append("name", name);
                formData.append("image", image);
                return {
                    url: "food/create",
                    method: "POST",
                    body: formData,
                };
            },
            invalidatesTags: ["food"],
        }),
        editFood: build.mutation<void, EditAdminFoodRequest>({
            query: ({ foodId, body }) => {
                const { name, image } = body;
                const formData = new FormData();
                formData.append("name", name);
                if (image instanceof File) {
                    formData.append("image", image);
                }
                return {
                    url: `food/edit/${foodId}`,
                    method: "POST",
                    body: formData,
                };
            },
            invalidatesTags: ["food"],
        }),
        deleteFood: build.mutation<void, number>({
            query: (foodId) => ({
                url: `food/${foodId}`,
                method: "DELETE",
            }),
            invalidatesTags: ["food"],
        }),
        getFoods: build.query<GetAdminFoodResponse,
        undefined | Partial<GetAdminFoodParams>>({
            query: (params) => ({
                url: "food/list",
                method: "GET",
                params,
            }),
            providesTags: ["food"],
        }),
        getFoodById: build.query<Food, number>({
            query: (foodId) => ({
                url: `food/${foodId}`,
                method: "GET",
            }),
            providesTags: ["food"],
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
        updateAdminUser: build.mutation<void, UpdateAdminUserRequest>({
            query: (data) => {
                const { id, body } = data;
                return {
                    url: `organization/edit/${id}`,
                    method: "POST",
                    body,
                };
            },
            invalidatesTags: ["user"],
        }),
        toggleAdminUserActive: build.mutation<void, string>({
            query: (userId) => ({
                url: `user/toggle-active/${userId}`,
                method: "POST",
            }),
            invalidatesTags: ["user"],
        }),
        deleteUser: build.mutation<void, string>({
            query: (userId) => ({
                url: `user/${userId}`,
                method: "DELETE",
            }),
            invalidatesTags: ["user"],
        }),
        getUsers: build.query<GetAdminUserResponse, Partial<GetAdminUserParams>>({
            query: (params) => ({
                url: "user/list",
                method: "GET",
                params,
            }),
            providesTags: ["user"],
        }),
        getUserById: build.query<AdminUser, string>({
            query: (userId) => ({
                url: `user/${userId}`,
                method: "GET",
            }),
            providesTags: ["user"],
        }),
        updateAdminOrganization: build.mutation<void, UpdateAdminOrganizationRequest>({
            query: (data) => {
                const { id, body } = data;
                return {
                    url: `organization/edit/${id}`,
                    method: "POST",
                    body,
                };
            },
            invalidatesTags: ["organization"],
        }),
        toggleAdminOrganizationActive: build.mutation<void, string>({
            query: (organizationId) => ({
                url: `organization/toggle-active/${organizationId}`,
                method: "POST",
            }),
            invalidatesTags: ["organization"],
        }),
        deleteOrganization: build.mutation<void, string>({
            query: (organizationId) => ({
                url: `organization/${organizationId}`,
                method: "DELETE",
            }),
            invalidatesTags: ["organization"],
        }),
        getOrganizations: build.query<GetAdminOrganizationResponse,
        Partial<GetAdminOrganizationParams>>({
            query: (params) => ({
                url: "organization/list",
                method: "GET",
                params,
            }),
            providesTags: ["organization"],
        }),
        getOrganizationById: build.query<AdminOrganization, string>({
            query: (organizationId) => ({
                url: `organization/${organizationId}`,
                method: "GET",
            }),
            providesTags: ["organization"],
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
    useCreateAchievementMutation,
    useEditAchievementMutation,
    useDeleteAchievementMutation,
    useLazyGetAchievementsQuery,
    useGetAchievementsQuery,
    useGetAchievementByIdQuery,
    useCreateHouseMutation,
    useEditHouseMutation,
    useDeleteHouseMutation,
    useGetHousesQuery,
    useLazyGetHousesQuery,
    useGetHouseByIdQuery,
    useCreateFoodMutation,
    useEditFoodMutation,
    useDeleteFoodMutation,
    useGetFoodsQuery,
    useLazyGetFoodsQuery,
    useGetFoodByIdQuery,
    useCreateTransferMutation,
    useEditTransferMutation,
    useDeleteTransferMutation,
    useGetTransfersQuery,
    useLazyGetTransfersQuery,
    useGetTransfertByIdQuery,
    useLazyGetUsersQuery,
    useUpdateAdminUserMutation,
    useDeleteUserMutation,
    useToggleAdminUserActiveMutation,
    useGetUserByIdQuery,
    useUpdateAdminOrganizationMutation,
    useToggleAdminOrganizationActiveMutation,
    useDeleteOrganizationMutation,
    useLazyGetOrganizationsQuery,
    useGetOrganizationByIdQuery,
    useGetPublicAchievementsQuery,
} = adminApi;
