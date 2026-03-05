import { createApi } from "@reduxjs/toolkit/dist/query/react";
import { baseQueryV3 } from "@/shared/api/baseQuery/baseQuery";
import {
    CreateDonationResponse,
    GetDonation, GetDonationAddress,
    GetDonationAutoMessages, GetDonationDescription,
    GetDonationHowMany, GetDonationParams, GetDonationsMap,
    GetDonationsMapParams, GetDonationsParams, GetDonationsResponse,
    GetDonationWhen,
    UpdateDonationAddressRequest,
    UpdateDonationAutoMessagesRequest,
    UpdateDonationDescriptionRequest,
    UpdateDonationHowManyRequest,
    UpdateDonationStatusRequest,
    UpdateDonationWhenRequest,
} from "../model/types/donationSchema";

export const donationApi = createApi({
    reducerPath: "donationApi",
    baseQuery: baseQueryV3,
    tagTypes: ["donation"],
    endpoints: (build) => ({
        getDonations: build.query<GetDonationsResponse, GetDonationsParams>({
            query: (params) => ({
                url: "fundraise/list",
                method: "GET",
                params,
            }),
        }),
        getDonation: build.query<GetDonation, GetDonationParams>({
            query: ({ id, lang }) => ({
                url: `fundraise/element/${id}`,
                method: "GET",
                params: { lang },
            }),
        }),
        getDonationsMap: build.query<GetDonationsMap[], GetDonationsMapParams>({
            query: (params) => ({
                url: "fundraise/for-map/list",
                method: "GET",
                params,
            }),
        }),
        deleteDonationById: build.mutation<void, string>({
            query: (id) => ({
                url: `fundraise/${id}`,
                method: "DELETE",
            }),
        }),
        createDonation: build.mutation<CreateDonationResponse, void>({
            query: () => ({
                url: "fundraise/create",
                method: "POST",
            }),
        }),
        getDonationAddress: build.query<GetDonationAddress, string>({
            query: (id) => ({
                url: `fundraise/address/${id}`,
                method: "GET",
            }),
        }),
        updateDonationAddress: build.mutation<void, UpdateDonationAddressRequest>({
            query: ({ id, body }) => ({
                url: `fundraise/address/${id}`,
                method: "PATCH",
                body,
            }),
        }),
        getDonationWhen: build.query<GetDonationWhen, string>({
            query: (id) => ({
                url: `fundraise/when/${id}`,
                method: "GET",
            }),
        }),
        updateDonationWhen: build.mutation<void, UpdateDonationWhenRequest>({
            query: ({ id, body }) => ({
                url: `fundraise/when/${id}`,
                method: "PATCH",
                body,
            }),
        }),
        getDonationHowMany: build.query<GetDonationHowMany, string>({
            query: (id) => ({
                url: `fundraise/how-many/${id}`,
                method: "GET",
            }),
        }),
        updateDonationHowMany: build.mutation<void, UpdateDonationHowManyRequest>({
            query: ({ id, body }) => ({
                url: `fundraise/how-many/${id}`,
                method: "PATCH",
                body,
            }),
        }),
        getDonationDescription: build.query<GetDonationDescription, string>({
            query: (id) => ({
                url: `fundraise/description/${id}`,
                method: "GET",
            }),
        }),
        updateDonationDescription: build.mutation<void, UpdateDonationDescriptionRequest>({
            query: ({ id, body }) => ({
                url: `fundraise/description/${id}`,
                method: "PATCH",
                body,
            }),
        }),
        getDonationAutoMessages: build.query<GetDonationAutoMessages, string>({
            query: (id) => ({
                url: `fundraise/description/${id}`,
                method: "GET",
            }),
        }),
        updateDonationAutoMessages: build.mutation<void, UpdateDonationAutoMessagesRequest>({
            query: ({ id, body }) => ({
                url: `fundraise/automatic-messages/${id}`,
                method: "PATCH",
                body,
            }),
        }),
        updateDonationStatus: build.mutation<void, UpdateDonationStatusRequest>({
            query: ({ id, body }) => ({
                url: `fundraise/toggle-status/${id}`,
                method: "PATCH",
                body,
            }),
        }),
    }),
});

export const {
    useLazyGetDonationsQuery,
    useGetDonationQuery,
    useLazyGetDonationsMapQuery,
    useGetDonationsMapQuery,
    useDeleteDonationByIdMutation,
    useCreateDonationMutation,
    useGetDonationAddressQuery,
    useUpdateDonationAddressMutation,
    useGetDonationWhenQuery,
    useUpdateDonationWhenMutation,
    useGetDonationHowManyQuery,
    useUpdateDonationHowManyMutation,
    useGetDonationDescriptionQuery,
    useUpdateDonationDescriptionMutation,
    useGetDonationAutoMessagesQuery,
    useUpdateDonationAutoMessagesMutation,
    useUpdateDonationStatusMutation,
} = donationApi;
