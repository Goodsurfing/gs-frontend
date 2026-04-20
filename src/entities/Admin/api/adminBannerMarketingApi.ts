import { createApi } from "@reduxjs/toolkit/dist/query/react";
import { baseAdminQueryAcceptJson } from "@/shared/api/baseQuery/baseQuery";
import { API_BASE_URL_V3 } from "@/shared/constants/api";
import {
    BannerMarketingElement, CreateAdminBannerMarketing, GetAdminBannerMarketingListParams,
    GetAdminBannerMarketingListResponse, GetAdminMarketingBanner, GetBannerMarketingParams,
    UpdateAdminBannerMarketingParams,
} from "../model/types/adminBannerMarketingSchema";

export const adminBannerMarketingApi = createApi({
    reducerPath: "adminBannerMarketingApi",
    baseQuery: baseAdminQueryAcceptJson,
    tagTypes: ["banner"],
    endpoints: (build) => ({
        getBannerMarketing: build.query<BannerMarketingElement,
        GetBannerMarketingParams>({
            query: ({ type }) => ({
                url: `${API_BASE_URL_V3}marketing-banner/element/${type}`,
                method: "GET",
            }),
            providesTags: ["banner"],
        }),
        getAdminBannerMarketingList: build.query<GetAdminBannerMarketingListResponse,
        Partial<GetAdminBannerMarketingListParams>>({
            query: (params) => ({
                url: "marketing-banner/list",
                method: "GET",
                params,
            }),
            providesTags: ["banner"],
        }),
        getAdminBannerMarketing: build.query<GetAdminMarketingBanner,
        string>({
            query: (id) => ({
                url: `marketing-banner/element/${id}`,
                method: "GET",
            }),
            providesTags: ["banner"],
        }),
        createAdminBannerMarketing: build.mutation<void, CreateAdminBannerMarketing>({
            query: (body) => ({
                url: "marketing-banner/create",
                method: "POST",
                body,
            }),
            invalidatesTags: ["banner"],
        }),
        updateAdminBannerMarketing: build.mutation<void, UpdateAdminBannerMarketingParams>({
            query: ({ id, body }) => ({
                url: `marketing-banner/edit/${id}`,
                method: "PATCH",
                body,
            }),
            invalidatesTags: ["banner"],
        }),
        deleteAdminBannerMarketing: build.mutation<void, string>({
            query: (id) => ({
                url: `marketing-banner/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["banner"],
        }),
    }),
});

export const {
    useGetBannerMarketingQuery,
    useLazyGetAdminBannerMarketingListQuery,
    useGetAdminBannerMarketingQuery,
    useCreateAdminBannerMarketingMutation,
    useUpdateAdminBannerMarketingMutation,
    useDeleteAdminBannerMarketingMutation,
} = adminBannerMarketingApi;
