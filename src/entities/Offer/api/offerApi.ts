import { createApi } from "@reduxjs/toolkit/dist/query/react";

import { baseQueryAcceptJson } from "@/shared/api/baseQuery/baseQuery";

import { Offer, OffersFilters } from "../model/types/offer";
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

interface OfferParams {
    organizationId: string;
    page?: number;
    itemsPerPage?: number;
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
        getOffers: build.query<Offer[], Partial<OffersFilters> | undefined>({
            query: (params) => ({
                url: "vacancies",
                method: "GET",
                params,
            }),
            providesTags: ["offer"],
        }),
        getSearchOffers: build.query<Offer[], Partial<OffersFilters> | undefined>({
            query: (params) => ({
                url: "vacancies",
                method: "GET",
                params,
            }),
            providesTags: ["offer"],
        }),
        getHostOffersById: build.query<Offer[], OfferParams>({
            query: ({ organizationId, itemsPerPage, page }) => ({
                url: `organizations/${organizationId}/vacancies`,
                method: "GET",
                params: { itemsPerPage, page, "order[updatedAt]": "desc" },
            }),
            providesTags: ["offer"],
        }),
        getHostAllOffersById: build.query<Offer[], string>({
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
    useGetOffersQuery,
    useLazyGetOffersQuery,
    useLazyGetSearchOffersQuery,
    useUpdateOfferMutation,
    useUpdateOfferStatusMutation,
    useDeleteOfferMutation,
    useGetHostOffersByIdQuery,
    useLazyGetHostOffersByIdQuery,
    useLazyGetHostAllOffersByIdQuery,
    useGetOfferByIdQuery,
    useLazyGetOfferByIdQuery,
    useCreateOfferGalleryItemMutation,
    useGetOfferGalleryItemsQuery,
    useGetOfferGalleryItemByIdQuery,
    useDeleteOfferGalleryItemMutation,
} = offerApi;
