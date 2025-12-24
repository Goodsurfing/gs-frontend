import { createApi } from "@reduxjs/toolkit/dist/query/react";

import { baseQueryAcceptJson } from "@/shared/api/baseQuery/baseQuery";

import {
    GetAllOffersMapFilters,
    GetHostOffersFilters, GetHostOffersResponse,
    GetOffersFilters,
    GetOffersResponse, Offer,
    OfferMap,
    OfferSort,
    UpdateOldOffer,
} from "../model/types/offer";
import { GalleryItem } from "@/types/media";
import { OfferStatus } from "../model/types/offerStatus";
import { API_BASE_URL_V3 } from "@/shared/constants/api";
import { UpdateOfferWhatToDoParams } from "../model/types/offerWhatToDo";
import { UpdateOfferConditionsParams } from "../model/types/offerConditions";
import { UpdateOfferDescriptionParams } from "../model/types/offerDescription";

interface UpdateOfferParams {
    id: number;
    body: Partial<UpdateOldOffer>;
}

interface UpdateOfferImageGallery {
    offerId: number;
    body: {
        galleryImageIds: string[];
    }
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
        updateOfferImageGallery: build.mutation<void, UpdateOfferImageGallery>({
            query: ({ offerId, body }) => ({
                url: `${API_BASE_URL_V3}vacancy/image-gallery/${offerId}`,
                method: "PATCH",
                body,
            }),
            invalidatesTags: ["offer"],
        }),
        updateOfferDescription: build.mutation<void, UpdateOfferDescriptionParams>({
            query: ({ offerId, body }) => ({
                url: `${API_BASE_URL_V3}vacancy/description/${offerId}`,
                method: "PATCH",
                body,
            }),
            invalidatesTags: ["offer"],
        }),
        updateOfferWhatToDo: build.mutation<void, UpdateOfferWhatToDoParams>({
            query: ({ offerId, body }) => ({
                url: `${API_BASE_URL_V3}vacancy/what-to-do/${offerId}`,
                method: "PATCH",
                body,
            }),
            invalidatesTags: ["offer"],
        }),
        updateOfferConditions: build.mutation<void, UpdateOfferConditionsParams>({
            query: ({ offerId, body }) => ({
                url: `${API_BASE_URL_V3}vacancy/condition/${offerId}`,
                method: "PATCH",
                body,
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
                url: `${API_BASE_URL_V3}vacancy/${offerId}`,
                method: "DELETE",
            }),
            invalidatesTags: ["offer"],
        }),
        getOfferById: build.query<Offer, string>({
            query: (offerId) => ({
                url: `${API_BASE_URL_V3}vacancy/${offerId}`,
                method: "GET",
            }),
            providesTags: ["offer"],
        }),
        getOffers: build.query<GetOffersResponse, Partial<GetOffersFilters> | undefined>({
            query: (params) => ({
                url: `${API_BASE_URL_V3}vacancy/list`,
                method: "GET",
                params,
            }),
            providesTags: ["offer"],
        }),
        getAllOffersMap: build.query<OfferMap[], Partial<GetAllOffersMapFilters> | undefined>({
            query: (params) => ({
                url: `${API_BASE_URL_V3}vacancy/for-map/list`,
                method: "GET",
                params,
            }),
            providesTags: ["offer"],
        }),
        getHostOffersById: build.query<GetHostOffersResponse, Partial<GetHostOffersFilters>>({
            query: ({ organizationId, limit, page }) => ({
                url: `${API_BASE_URL_V3}vacancy/list/${organizationId}`,
                method: "GET",
                params: { limit, page, sort: OfferSort.UpdatedDesc },
            }),
            providesTags: ["offer"],
        }),
        getHostAllOffersById: build.query<GetHostOffersResponse, Partial<GetHostOffersFilters>>({
            query: ({
                organizationId, limit, page, statuses,
            }) => ({
                url: `${API_BASE_URL_V3}vacancy/list/${organizationId}`,
                method: "GET",
                params: { limit, page, statuses },
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

// export const offerApiv3 = createApi({
//     reducerPath: "offerApiv3",
//     baseQuery: baseQueryV3Json,
//     tagTypes: ["offer"],
//     endpoints: (build) => ({
//         getOffersList: build.query<Partial<OffersFilters> | undefiend>({
//             url:
//         })
//     })
// })

export const {
    useCreateOfferMutation,
    useGetOffersQuery,
    useLazyGetOffersQuery,
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
    useUpdateOfferWhatToDoMutation,
    useUpdateOfferConditionsMutation,
    useUpdateOfferDescriptionMutation,
    useUpdateOfferImageGalleryMutation,
    useGetAllOffersMapQuery,
    useLazyGetAllOffersMapQuery,
} = offerApi;
