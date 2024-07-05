import { createApi } from "@reduxjs/toolkit/dist/query/react";

import { baseQueryAcceptJson } from "@/shared/api/baseQuery/baseQuery";

import { Offer } from "../model/types/offer";

interface UpdateOfferParams {
    id: number
    body: Partial<Offer>;
}

interface CreateOfferResponse {
    id: number;
}

export const offerApi = createApi({
    reducerPath: "offerApi",
    baseQuery: baseQueryAcceptJson,
    tagTypes: ["offer", "address"],
    endpoints: (build) => ({
        createOffer: build.mutation<CreateOfferResponse, FormData>({
            query: (data) => ({
                url: "/vacancies",
                method: "POST",
                body: data,
            }),
            invalidatesTags: ["offer"],
        }),
        updateOffer: build.mutation<CreateOfferResponse, UpdateOfferParams>({
            query: (data) => ({
                url: `/vacancies/${data.id}`,
                method: "PATCH",
                headers: {
                    "Content-Type": "application/merge-patch+json",
                },
                body: JSON.stringify(data.body),
            }),
            invalidatesTags: ["offer"],
        }),
        deleteOffer: build.mutation<CreateOfferResponse, string>({
            query: (offerId) => ({
                url: `/vacancies/${offerId}`,
                method: "DELETE",
            }),
            invalidatesTags: ["offer"],
        }),
        getOfferById: build.query<Offer, string>({
            query: (offerId) => ({
                url: `vacancies/${offerId}`,
                method: "GET",
            }),
            providesTags: ["offer"],
        }),
        getOffers: build.query<Offer[], void>({
            query: () => ({
                url: "vacancies",
                method: "GET",
            }),
            providesTags: ["offer"],
        }),
        getHostOffersById: build.query<Offer[], string>({
            query: (organizationId) => ({
                url: `organizations/${organizationId}/vacancies`,
                method: "GET",
            }),

            providesTags: ["offer"],
        }),
    }),
});

export const {
    useCreateOfferMutation,
    useUpdateOfferMutation,
    useDeleteOfferMutation,
    useGetHostOffersByIdQuery,
    useLazyGetHostOffersByIdQuery,
    useGetOfferByIdQuery,
    useLazyGetOfferByIdQuery,
} = offerApi;
