import { createApi } from "@reduxjs/toolkit/dist/query/react";

import { baseQueryMergeJson } from "@/shared/api/baseQuery/baseQuery";

import { Offer } from "../model/types/offer";
import { OfferStatus } from "../model/types/offerStatus";

interface UpdateOfferParams {
    id: number
    body: Partial<Offer>;
}

interface CreateOfferResponse {
    id: number;
}

interface CreateOfferRequest {
    status: OfferStatus;
}

export const offerApi = createApi({
    reducerPath: "offerApi",
    baseQuery: baseQueryMergeJson,
    tagTypes: ["offer", "address"],
    endpoints: (build) => ({
        createOffer: build.mutation<CreateOfferResponse, CreateOfferRequest>({
            query: () => ({
                url: "/vacancies",
                method: "POST",
            }),
            invalidatesTags: ["offer"],
        }),
        updateOffer: build.mutation<CreateOfferResponse, UpdateOfferParams>({
            query: (data) => ({
                url: `/vacancies/${data.id}`,
                method: "PATCH",
                body: JSON.stringify(data.body),
            }),
            invalidatesTags: ["offer"],
        }),
        deleteOffer: build.mutation<CreateOfferResponse, UpdateOfferParams>({
            query: (data) => ({
                url: `/vacancies/${data.body.id}`,
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
                url: `ogranizations/${organizationId}`,
                method: "GET",
            }),
            providesTags: ["offer"],
        }),
    }),
});

export const {
    useCreateOfferMutation,
    useUpdateOfferMutation,
    useGetHostOffersByIdQuery,
    useGetOfferByIdQuery,
    useLazyGetOfferByIdQuery,
} = offerApi;
