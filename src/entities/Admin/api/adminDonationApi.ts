import { createApi } from "@reduxjs/toolkit/dist/query/react";
import { baseAdminQueryAcceptJson } from "@/shared/api/baseQuery/baseQuery";
import {
    CreateAdminDonationReport, GetAdminDonationReport,
    GetAdminDonationReports, GetAdminDonations,
    GetAdminDonationsParams, UpdateAdminDonationReportRequest,
} from "../model/types/adminDonationSchema";

export const adminDonationApi = createApi({
    reducerPath: "adminDoantionApi",
    baseQuery: baseAdminQueryAcceptJson,
    tagTypes: ["donation", "report"],
    endpoints: (build) => ({
        getAdminDonations: build.query<GetAdminDonations[], GetAdminDonationsParams>({
            query: (params) => ({
                url: "fundraise",
                method: "GET",
                params,
            }),
            transformResponse: (response: { data: GetAdminDonations[] } | GetAdminDonations[]) => {
                if (Array.isArray(response)) return response;
                return response.data ?? [];
            },
            providesTags: ["donation"],
        }),
        deleteAdminDonation: build.mutation<void, string>({
            query: (id) => ({
                url: `fundraise/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["donation"],
        }),
        getAdminDonationReports: build.query<GetAdminDonationReports[], void>({
            query: () => ({
                url: "report",
                method: "GET",
            }),
            providesTags: ["report"],
        }),
        getAdminDonationReport: build.query<GetAdminDonationReport, string>({
            query: (id) => ({
                url: `report/${id}`,
                method: "GET",
            }),
            providesTags: ["report"],
        }),
        createAdminDonationReport: build.mutation<void, CreateAdminDonationReport>({
            query: (body) => ({
                url: "report",
                method: "POST",
                body,
            }),
            invalidatesTags: ["report"],
        }),
        updateAdminDonationReport: build.mutation<void, UpdateAdminDonationReportRequest>({
            query: ({ id, body }) => ({
                url: `report/${id}`,
                method: "PATCH",
                body,
            }),
            invalidatesTags: ["report"],
        }),
        deleteAdminDonationReport: build.mutation<void, string>({
            query: (id) => ({
                url: `report/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["report"],
        }),
    }),
});

export const {
    useLazyGetAdminDonationsQuery,
    useDeleteAdminDonationMutation,
    useGetAdminDonationReportsQuery,
    useGetAdminDonationReportQuery,
    useCreateAdminDonationReportMutation,
    useUpdateAdminDonationReportMutation,
    useDeleteAdminDonationReportMutation,
} = adminDonationApi;
