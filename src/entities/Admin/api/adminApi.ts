import { createApi } from "@reduxjs/toolkit/dist/query/react";
import { baseAdminQueryAcceptJson } from "@/shared/api/baseQuery/baseQuery";
import {
    AdminOrganization,
    AdminReviewVacancy,
    AdminReviewVolunteer,
    AdminUser,
    AdminVacancyConditions,
    AdminVacancyDescription,
    AdminVacancyFinishingTouches,
    AdminVacancyWhatToDo,
    AdminVacancyWhen,
    AdminVacancyWhere,
    AdminVacancyWhoNeeds,
    CreateAdminAchievementsRequest,
    CreateAdminFoodRequest,
    CreateAdminHouseRequest,
    CreateAdminSkillRequest, CreateAdminTransferRequest,
    EditAdminAchievementsRequest, EditAdminFoodRequest, EditAdminHouseRequest,
    EditAdminReviewVolunteerRequest,
    EditAdminSkillRequest, EditAdminTransferRequest,
    EditReviewVacancy, GetAdminAchievementsParams,
    GetAdminAchievementsResponse, GetAdminFoodParams, GetAdminFoodResponse,
    GetAdminHouseParams, GetAdminHouseResponse,
    GetAdminOffersParams,
    GetAdminOffersRequest,
    GetAdminOrganizationParams, GetAdminOrganizationResponse,
    GetAdminReviewVacancyListParams,
    GetAdminReviewVacancyListResponse,
    GetAdminReviewVolunteerListParams,
    GetAdminReviewVolunteerListResponse,
    GetAdminSkillsParams, GetAdminSkillsResponse,
    GetAdminTransferRequest,
    GetAdminTransfersParams,
    GetAdminTransfersResponse,
    GetAdminUserParams,
    GetAdminUserResponse,
    GetHouseRequest,
    GetPublicSkillRequest,
    SearchUsersParams,
    SearchUsersResponse,
    UpdateAdminOrganizationRequest,
    UpdateAdminUserRequest,
    UpdateAdminVacancyConditionsRequest,
    UpdateAdminVacancyDescriptionRequest,
    UpdateAdminVacancyFinishingTouchesRequest,
    UpdateAdminVacancyWhatToDoRequest,
    UpdateAdminVacancyWhenRequest,
    UpdateAdminVacancyWhereRequest,
    UpdateAdminVacancyWhoNeedsRequest,
} from "../model/types/adminSchema";
import {
    CategoryCountVacancy, CreateCategoryParams, GetCategory,
    GetCategoryRequest, GetCategoryResponse, UpdateCategoryParams,
} from "@/types/categories";
import { PaginationParams } from "@/types/api/pagination";
import { GetSkillRequest, Skill } from "@/types/skills";
import { Achievement, GetAchievement, GetAchievementRequest } from "@/types/achievements";
import {
    Food, GetFood, GetFoodRequest, GetHouse, GetTransfer, House, Transfer,
} from "@/shared/data/conditions";
import { API_BASE_URL_V3 } from "@/shared/constants/api";
import { UpdateOfferImageGallery, UpdateOfferStatusRequest, UpdateOfferStatusResponse } from "@/entities/Offer";

interface GoodsurfingToday {
    volunteerCount: number;
    vacancyCountryCount: number;
    vacancyCount: number;
    reviewCount: number;
}

export const adminApi = createApi({
    reducerPath: "adminApi",
    baseQuery: baseAdminQueryAcceptJson,
    tagTypes: ["skill", "user", "reviewVacancy", "reviewVolunteer", "category", "achievement", "transfer",
        "house", "food", "organization", "offer",
    ],
    endpoints: (build) => ({
        createSkill: build.mutation<void, CreateAdminSkillRequest>({
            query: (body) => {
                const {
                    name, nameEn, nameEs, image,
                } = body;
                const formData = new FormData();
                formData.append("name", name);
                formData.append("nameEn", nameEn);
                formData.append("nameEs", nameEs);
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
                const {
                    name, nameEn, nameEs, image,
                } = body;
                const formData = new FormData();
                formData.append("name", name);
                formData.append("nameEn", nameEn);
                formData.append("nameEs", nameEs);
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
        getPublicSkills: build.query<Skill[], GetPublicSkillRequest>({
            query: (params) => ({
                url: `${API_BASE_URL_V3}skill/list`,
                method: "GET",
                params,
            }),
            providesTags: ["skill"],
        }),
        getSkills: build.query<GetAdminSkillsResponse, undefined | Partial<GetAdminSkillsParams>>({
            query: (params) => ({
                url: "skill/list",
                method: "GET",
                params,
            }),
            providesTags: ["skill"],
        }),
        getSkillById: build.query<GetSkillRequest, number>({
            query: (skillId) => ({
                url: `skill/${skillId}`,
                method: "GET",
            }),
            providesTags: ["skill"],
        }),
        createAchievement: build.mutation<void, CreateAdminAchievementsRequest>({
            query: (body) => {
                const {
                    name, nameEn, nameEs, image,
                } = body;
                const formData = new FormData();
                formData.append("name", name);
                formData.append("nameEn", nameEn);
                formData.append("nameEs", nameEs);
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
                const {
                    name, nameEn, nameEs, image,
                } = body;
                const formData = new FormData();
                formData.append("name", name);
                formData.append("nameEn", nameEn);
                formData.append("nameEs", nameEs);
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
        GetAchievementRequest>({
            query: (params) => ({
                url: `${API_BASE_URL_V3}achievement/list`,
                method: "GET",
                params,
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
        getAchievementById: build.query<GetAchievement, number>({
            query: (achievementId) => ({
                url: `achievement/${achievementId}`,
                method: "GET",
            }),
            providesTags: ["achievement"],
        }),
        createTransfer: build.mutation<void, CreateAdminTransferRequest>({
            query: (body) => {
                const {
                    name, nameEn, nameEs, image,
                } = body;
                const formData = new FormData();
                formData.append("name", name);
                formData.append("nameEn", nameEn);
                formData.append("nameEs", nameEs);
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
                const {
                    name, nameEn, nameEs, image,
                } = body;
                const formData = new FormData();
                formData.append("name", name);
                formData.append("nameEn", nameEn);
                formData.append("nameEs", nameEs);
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
        getPublicTransfers: build.query<Transfer[],
        GetAdminTransferRequest>({
            query: (params) => ({
                url: `${API_BASE_URL_V3}transfer/list`,
                method: "GET",
                params,
            }),
            providesTags: ["transfer"],
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
        getTransfertById: build.query<GetTransfer, number>({
            query: (transferId) => ({
                url: `transfer/${transferId}`,
                method: "GET",
            }),
            providesTags: ["transfer"],
        }),
        createHouse: build.mutation<void, CreateAdminHouseRequest>({
            query: (body) => {
                const {
                    name, nameEn, nameEs, image,
                } = body;
                const formData = new FormData();
                formData.append("name", name);
                formData.append("nameEn", nameEn);
                formData.append("nameEs", nameEs);
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
                const {
                    name, nameEn, nameEs, image,
                } = body;
                const formData = new FormData();
                formData.append("name", name);
                formData.append("nameEn", nameEn);
                formData.append("nameEs", nameEs);
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
        getPublicHouses: build.query<House[],
        GetHouseRequest>({
            query: (params) => ({
                url: `${API_BASE_URL_V3}house/list`,
                method: "GET",
                params,
            }),
            providesTags: ["house"],
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
        getHouseById: build.query<GetHouse, number>({
            query: (houseId) => ({
                url: `house/${houseId}`,
                method: "GET",
            }),
            providesTags: ["house"],
        }),
        createFood: build.mutation<void, CreateAdminFoodRequest>({
            query: (body) => {
                const {
                    name, nameEn, nameEs, image,
                } = body;
                const formData = new FormData();
                formData.append("name", name);
                formData.append("nameEn", nameEn);
                formData.append("nameEs", nameEs);
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
                const {
                    name, nameEn, nameEs, image,
                } = body;
                const formData = new FormData();
                formData.append("name", name);
                formData.append("nameEn", nameEn);
                formData.append("nameEs", nameEs);
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
        getPublicFoods: build.query<Food[],
        GetFoodRequest>({
            query: (params) => ({
                url: `${API_BASE_URL_V3}food/list`,
                method: "GET",
                params,
            }),
            providesTags: ["food"],
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
        getFoodById: build.query<GetFood, number>({
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
                    url: `user/edit/${id}`,
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
        editAdminReviewVacancy: build.mutation<void, EditReviewVacancy>({
            query: (data) => ({
                url: `review-vacancy/edit/${data.reviewId}`,
                method: "POST",
                body: data.body,
            }),
            invalidatesTags: ["reviewVacancy"],
        }),
        deleteAdminReviewVacancy: build.mutation<void, string>({
            query: (reviewId) => ({
                url: `review-vacancy/${reviewId}`,
                method: "DELETE",
            }),
            invalidatesTags: ["reviewVacancy"],
        }),
        getAdminReviewVacanciesList: build.query<GetAdminReviewVacancyListResponse,
        GetAdminReviewVacancyListParams>({
            query: (params) => ({
                url: "review-vacancy/list",
                method: "GET",
                params,
            }),
            providesTags: ["reviewVacancy"],
        }),
        getAdminReviewVacancyById: build.query<AdminReviewVacancy,
        string>({
            query: (reviewVacancyId) => ({
                url: `review-vacancy/${reviewVacancyId}`,
                method: "GET",
            }),
            providesTags: ["reviewVacancy"],
        }),
        editAdminReviewVolunteer: build.mutation<void, EditAdminReviewVolunteerRequest>({
            query: (data) => ({
                url: `review-volunteer/edit/${data.reviewId}`,
                method: "POST",
                body: data.body,
            }),
            invalidatesTags: ["reviewVolunteer"],
        }),
        deleteAdminReviewVolunteer: build.mutation<void, string>({
            query: (reviewId) => ({
                url: `review-volunteer/${reviewId}`,
                method: "DELETE",
            }),
            invalidatesTags: ["reviewVolunteer"],
        }),
        getAdminReviewVolunteerList: build.query<GetAdminReviewVolunteerListResponse,
        GetAdminReviewVolunteerListParams>({
            query: (params) => ({
                url: "review-volunteer/list",
                method: "GET",
                params,
            }),
            providesTags: ["reviewVolunteer"],
        }),
        getAdminReviewVolunteerById: build.query<AdminReviewVolunteer,
        string>({
            query: (reviewVolunteerId) => ({
                url: `review-volunteer/${reviewVolunteerId}`,
                method: "GET",
            }),
            providesTags: ["reviewVolunteer"],
        }),
        getAdminOffers: build.query<GetAdminOffersRequest,
        GetAdminOffersParams>({
            query: (params) => ({
                url: "vacancy/list",
                method: "GET",
                params,
            }),
            providesTags: ["offer"],
        }),
        deleteAdminOffer: build.mutation<void, string>({
            query: (offerId) => ({
                url: `vacancy/${offerId}`,
                method: "DELETE",
            }),
            invalidatesTags: ["offer"],
        }),
        createCategoryVacancy: build.mutation<void, CreateCategoryParams>({
            query: ({
                name, nameEn, nameEs, color, image,
            }) => {
                const formData = new FormData();
                formData.append("name", name);
                formData.append("nameEn", nameEn);
                formData.append("nameEs", nameEs);
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
                const {
                    name, nameEn, nameEs, color, image,
                } = data;
                const formData = new FormData();
                formData.append("name", name);
                formData.append("nameEn", nameEn);
                formData.append("nameEs", nameEs);
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
        getCategoryVacancyById: build.query<GetCategory,
        number>({
            query: (id) => ({
                url: `category/${id}`,
                method: "GET",
            }),
            providesTags: ["category"],
        }),
        getPublicCategoriesVacancy: build.query<CategoryCountVacancy[],
        GetCategoryRequest>({
            query: (params) => ({
                url: `${API_BASE_URL_V3}category/list`,
                method: "GET",
                params,
            }),
            providesTags: ["category"],
        }),
        getGoodsurfingToday: build.query<GoodsurfingToday,
        void>({
            query: () => ({
                url: `${API_BASE_URL_V3}goodsurfing/today`,
                method: "GET",
            }),
        }),
        getAdminVacancyWhere: build.query<AdminVacancyWhere, string>({
            query: (offerId) => ({
                url: `vacancy/address/${offerId}`,
                method: "GET",
            }),
            providesTags: ["offer"],
        }),
        updateAdminVacancyWhere: build.mutation<void, UpdateAdminVacancyWhereRequest>({
            query: ({ offerId, body }) => ({
                url: `vacancy/address/${offerId}`,
                method: "PATCH",
                body,
            }),
            invalidatesTags: ["offer"],
        }),
        getAdminVacancyWhen: build.query<AdminVacancyWhen, string>({
            query: (offerId) => ({
                url: `vacancy/when/${offerId}`,
                method: "GET",
            }),
            providesTags: ["offer"],
        }),
        updateAdminVacancyWhen: build.mutation<void, UpdateAdminVacancyWhenRequest>({
            query: ({ offerId, body }) => ({
                url: `vacancy/when/${offerId}`,
                method: "PATCH",
                body,
            }),
            invalidatesTags: ["offer"],
        }),
        getAdminVacancyWhoNeeds: build.query<AdminVacancyWhoNeeds, string>({
            query: (offerId) => ({
                url: `vacancy/how-need/${offerId}`,
                method: "GET",
            }),
            providesTags: ["offer"],
        }),
        updateAdminVacancyWhoNeeds: build.mutation<void, UpdateAdminVacancyWhoNeedsRequest>({
            query: ({ offerId, body }) => ({
                url: `vacancy/how-need/${offerId}`,
                method: "PATCH",
                body,
            }),
            invalidatesTags: ["offer"],
        }),
        getAdminVacancyDescription: build.query<AdminVacancyDescription, string>({
            query: (offerId) => ({
                url: `vacancy/description/${offerId}`,
                method: "GET",
            }),
            providesTags: ["offer"],
        }),
        updateAdminVacancyDescription: build.mutation<void, UpdateAdminVacancyDescriptionRequest>({
            query: ({ offerId, body }) => ({
                url: `vacancy/description/${offerId}`,
                method: "PATCH",
                body,
            }),
            invalidatesTags: ["offer"],
        }),
        updateAdminVacancyImageGallery: build.mutation<void, UpdateOfferImageGallery>({
            query: ({ offerId, body }) => ({
                url: `vacancy/image-gallery/${offerId}`,
                method: "PATCH",
                body,
            }),
            invalidatesTags: ["offer"],
        }),
        getAdminVacancyWhatToDo: build.query<AdminVacancyWhatToDo, string>({
            query: (offerId) => ({
                url: `vacancy/what-to-do/${offerId}`,
                method: "GET",
            }),
            providesTags: ["offer"],
        }),
        updateAdminVacancyWhatToDo: build.mutation<void, UpdateAdminVacancyWhatToDoRequest>({
            query: ({ offerId, body }) => ({
                url: `vacancy/what-to-do/${offerId}`,
                method: "PATCH",
                body,
            }),
            invalidatesTags: ["offer"],
        }),
        getAdminVacancyConditions: build.query<AdminVacancyConditions, string>({
            query: (offerId) => ({
                url: `vacancy/condition/${offerId}`,
                method: "GET",
            }),
            providesTags: ["offer"],
        }),
        updateAdminVacancyConditions: build.mutation<void, UpdateAdminVacancyConditionsRequest>({
            query: ({ offerId, body }) => ({
                url: `vacancy/condition/${offerId}`,
                method: "PATCH",
                body,
            }),
            invalidatesTags: ["offer"],
        }),
        getAdminVacancyFinishingTouches: build.query<AdminVacancyFinishingTouches, string>({
            query: (offerId) => ({
                url: `vacancy/finish-touche/${offerId}`,
                method: "GET",
            }),
            providesTags: ["offer"],
        }),
        updateAdminVacancyFinishingTouches: build.mutation<void,
        UpdateAdminVacancyFinishingTouchesRequest>({
            query: ({ offerId, body }) => ({
                url: `vacancy/finish-touche/${offerId}`,
                method: "PATCH",
                body,
            }),
            invalidatesTags: ["offer"],
        }),
        updateAdminVacancyStatus: build.mutation<UpdateOfferStatusResponse,
        UpdateOfferStatusRequest>({
            query: (data) => ({
                url: `vacancy/toggle-status/${data.id}`,
                method: "PATCH",
                body: { status: data.status },
            }),
            invalidatesTags: ["offer"],
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
    useEditAdminReviewVacancyMutation,
    useDeleteAdminReviewVacancyMutation,
    useGetAdminReviewVacanciesListQuery,
    useLazyGetAdminReviewVacanciesListQuery,
    useGetAdminReviewVacancyByIdQuery,
    useLazyGetAdminReviewVacancyByIdQuery,
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
    useGetPublicHousesQuery,
    useCreateFoodMutation,
    useEditFoodMutation,
    useDeleteFoodMutation,
    useGetFoodsQuery,
    useLazyGetFoodsQuery,
    useGetFoodByIdQuery,
    useGetPublicFoodsQuery,
    useCreateTransferMutation,
    useEditTransferMutation,
    useDeleteTransferMutation,
    useGetTransfersQuery,
    useLazyGetTransfersQuery,
    useGetTransfertByIdQuery,
    useGetPublicTransfersQuery,
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
    useGetPublicCategoriesVacancyQuery,
    useGetPublicSkillsQuery,
    useGetGoodsurfingTodayQuery,
    useEditAdminReviewVolunteerMutation,
    useDeleteAdminReviewVolunteerMutation,
    useLazyGetAdminReviewVolunteerListQuery,
    useLazyGetAdminReviewVolunteerByIdQuery,
    useGetAdminReviewVolunteerByIdQuery,
    useLazyGetAdminOffersQuery,
    useDeleteAdminOfferMutation,
    useGetAdminVacancyWhereQuery,
    useUpdateAdminVacancyWhereMutation,
    useGetAdminVacancyWhenQuery,
    useUpdateAdminVacancyWhenMutation,
    useGetAdminVacancyWhoNeedsQuery,
    useUpdateAdminVacancyWhoNeedsMutation,
    useGetAdminVacancyConditionsQuery,
    useGetAdminVacancyDescriptionQuery,
    useGetAdminVacancyWhatToDoQuery,
    useGetAdminVacancyFinishingTouchesQuery,
    useUpdateAdminVacancyConditionsMutation,
    useUpdateAdminVacancyDescriptionMutation,
    useUpdateAdminVacancyWhatToDoMutation,
    useUpdateAdminVacancyFinishingTouchesMutation,
    useUpdateAdminVacancyImageGalleryMutation,
    useUpdateAdminVacancyStatusMutation,
} = adminApi;
