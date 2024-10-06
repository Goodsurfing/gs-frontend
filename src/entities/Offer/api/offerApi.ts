import { createApi } from "@reduxjs/toolkit/dist/query/react";

import { baseQueryAcceptJson } from "@/shared/api/baseQuery/baseQuery";

import { Offer } from "../model/types/offer";
import { GalleryItem } from "@/types/media";
import { OfferStatus } from "../model/types/offerStatus";

interface UpdateOfferParams {
    id: number
    body: Partial<Offer>;
}

interface CreateOfferResponse {
    id: number;
}

interface UpdateOfferStatusRequest {
    id: string;
    status: OfferStatus;
}

interface UpdateOfferStatusResponse {
    status: OfferStatus;
}

interface CreateOfferGalleryItemRequest {
    offerId: string;
    formData: FormData;
}

interface OfferGalleryItemRequest {
    offerId: string;
    galleryId: string;
}

export const offerApi = createApi({
    reducerPath: "offerApi",
    baseQuery: baseQueryAcceptJson,
    tagTypes: ["offer"],
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
        updateOfferStatus: build.mutation<UpdateOfferStatusResponse, UpdateOfferStatusRequest>({
            query: (data) => ({
                url: `/vacancies/${data.id}/status`,
                method: "PATCH",
                headers: {
                    "Content-Type": "application/merge-patch+json",
                },
                body: JSON.stringify({ status: data.status }),
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
        createOfferGalleryItem: build.mutation<GalleryItem, CreateOfferGalleryItemRequest>({
            query: (data) => ({
                url: `/vacancies/${data.offerId}/gallery`,
                method: "POST",
                body: data.formData,
            }),
            invalidatesTags: ["offer"],
        }),
        getOfferGalleryItems: build.query<GalleryItem[], string>({
            query: (offerId) => ({
                url: `vacancies/${offerId}/gallery`,
                method: "GET",
            }),
            providesTags: ["offer"],
        }),
        getOfferGalleryItemById: build.query<GalleryItem, OfferGalleryItemRequest>({
            query: (data) => ({
                url: `vacancies/${data.offerId}/gallery/${data.galleryId}`,
                method: "GET",
            }),
            providesTags: ["offer"],
        }),
        deleteOfferGalleryItem: build.mutation<CreateOfferResponse, OfferGalleryItemRequest>({
            query: (data) => ({
                url: `/vacancies/${data.offerId}/gallery/${data.galleryId}`,
                method: "DELETE",
            }),
            invalidatesTags: ["offer"],
        }),
    }),
});

export const {
    useCreateOfferMutation,
    useUpdateOfferMutation,
    useUpdateOfferStatusMutation,
    useDeleteOfferMutation,
    useGetHostOffersByIdQuery,
    useLazyGetHostOffersByIdQuery,
    useGetOfferByIdQuery,
    useLazyGetOfferByIdQuery,
    useCreateOfferGalleryItemMutation,
    useGetOfferGalleryItemsQuery,
    useGetOfferGalleryItemByIdQuery,
    useDeleteOfferGalleryItemMutation,
} = offerApi;
