import { createApi } from "@reduxjs/toolkit/dist/query/react";

import { baseQuery, baseQueryMergeJson } from "@/shared/api/baseQuery/baseQuery";

import { AddressAutoComplete, MyOffers, Offer } from "../model/types/offer";
import { OfferWhere } from "../model/types/offerWhere";
import { OfferWhoNeedsApi } from "../model/types/offerWhoNeeds";
import { OfferDescriptionApi } from "../model/types/offerDescription";
import { OfferWhatToDoApi } from "../model/types/offerWhatToDo";
import { OfferConditionsApi } from "../model/types/offerConditions";
import { OfferFinishingTouchesApi } from "../model/types/offerFinishingTouches";
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
            query: (data) => {
                console.log(data);
                return {
                    url: `/vacancies/${data.id}`,
                    method: "PATCH",
                    body: JSON.stringify(data.body),
                };
            },
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
        getAddressAutoComplete: build.query<AddressAutoComplete, void>({
            query: () => ({
                url: "/address-autocomplet",
                method: "GET",
            }),
            providesTags: ["address"],
        }),
        updateStatus: build.mutation<CreateOfferResponse, UpdateOfferParams>({
            query: (data) => ({
                url: `/vacancies/${data.body.id}`,
                method: "PATCH",
                body: { status: data.body.status },
            }),
            invalidatesTags: ["offer"],
        }),
        updateWhere: build.mutation<CreateOfferResponse, UpdateOfferParams>({
            query: (data) => ({
                url: `/vacancies/${data.body.id}`,
                method: "PATCH",
                body: data.body.where,
            }),
            invalidatesTags: ["offer"],
        }),
        // getWhere: build.query<OfferWhere, CreateOfferResponse>({
        //     query: (data) => ({
        //         url: `vacancies/${data.id}`,
        //         method: "GET",
        //     }),
        //     transformResponse: (response: Offer) => response.where,
        //     providesTags: ["offer"],
        // }),
        updateWhen: build.mutation<CreateOfferResponse, UpdateOfferParams>({
            query: (data) => ({
                url: `/vacancies/${data.body.id}`,
                method: "PUT",
                body: data.body.when,
            }),
            invalidatesTags: ["offer"],
        }),
        // getWhen: build.query<OfferWhenApi, CreateOfferResponse>({
        //     query: (data) => ({
        //         url: `vacancies/${data.id}`,
        //         method: "GET",
        //     }),
        //     transformResponse: (response: Offer) => response.when,
        //     providesTags: ["offer"],
        // }),
        updateWhoNeeds: build.mutation<CreateOfferResponse, UpdateOfferParams>({
            query: (data) => ({
                url: `/vacancies/${data.body.id}`,
                method: "PUT",
                body: data.body.whoNeeds,
            }),
            invalidatesTags: ["offer"],
        }),
        getWhoNeeds: build.query<OfferWhoNeedsApi, CreateOfferResponse>({
            query: (data) => ({
                url: `vacancy/${data.id}/how-needs`,
                method: "GET",
            }),
            providesTags: ["offer"],
        }),
        updateDescription: build.mutation<
        CreateOfferResponse,
        UpdateOfferParams
        >({
            query: (data) => ({
                url: `/vacancy/${data.body.id}/description`,
                method: "PUT",
                body: data.body.description,
            }),
            invalidatesTags: ["offer"],
        }),
        getDescription: build.query<OfferDescriptionApi, CreateOfferResponse>({
            query: (data) => ({
                url: `vacancy/${data.id}/description`,
                method: "GET",
            }),
            providesTags: ["offer"],
        }),
        updateWhatToDo: build.mutation<CreateOfferResponse, UpdateOfferParams>({
            query: (data) => ({
                url: `/vacancy/${data.body.id}/what-to-do`,
                method: "PUT",
                body: data.body.whatToDo,
            }),
            invalidatesTags: ["offer"],
        }),
        getWhatToDo: build.query<OfferWhatToDoApi, CreateOfferResponse>({
            query: (data) => ({
                url: `vacancy/${data.id}/what-to-do`,
                method: "GET",
            }),
            providesTags: ["offer"],
        }),
        updateConditions: build.mutation<
        CreateOfferResponse,
        UpdateOfferParams
        >({
            query: (data) => {
                const { body: { id, conditions } } = data;
                return {
                    url: `/vacancy/${id}/conditions`,
                    method: "PUT",
                    // toDo: Change body typing for backend
                    body: {
                        housingIds: conditions?.housingIds ? [conditions?.housingIds] : [],
                        foodIds: conditions?.foodIds ? [conditions?.foodIds] : [],
                        paidTravelIds: conditions?.paidTravelIds ? [conditions?.paidTravelIds] : [],
                        conveniencesIds: conditions?.conveniencesIds,
                        additionalFeaturesIds: conditions?.additionalFeaturesIds,
                        volunteerContributions: conditions?.volunteerContributions,
                        volunteerRemuneration: conditions?.volunteerRemuneration,
                        currency: conditions?.currency,
                        additionalConditions: conditions?.additionalConditions,
                    },
                };
            },
            invalidatesTags: ["offer"],
        }),
        getConditions: build.query<OfferConditionsApi, CreateOfferResponse>({
            query: (data) => ({
                url: `vacancy/${data.id}/conditions`,
                method: "GET",
            }),
            providesTags: ["offer"],
        }),
        updateFinishingTouches: build.mutation<
        CreateOfferResponse,
        UpdateOfferParams
        >({
            query: (data) => ({
                url: `/vacancy/${data.body.id}/finishing-touches`,
                method: "PUT",
                // toDo: Change body typing for backend
                body: {
                    additionalConditionsIds: data.body.finishingTouches?.extraConditions,
                    onlyVerified: data.body.finishingTouches?.onlyVerified,
                    helloText: data.body.finishingTouches?.welcomeMessage,
                    roles: data.body.finishingTouches?.rulesInfo,
                    questionnaireUrl: data.body.finishingTouches?.questionnaireUrl,
                    questions: data.body.finishingTouches?.questions,
                },
            }),
            invalidatesTags: ["offer"],
        }),
        getFinishingTouches: build.query<OfferFinishingTouchesApi, CreateOfferResponse>({
            query: (data) => ({
                url: `vacancy/${data.id}/finishing-touches`,
                method: "GET",
            }),
            providesTags: ["offer"],
        }),
    }),
});

export const {
    useCreateOfferMutation,
    useUpdateOfferMutation,
    useUpdateStatusMutation,
    useUpdateWhereMutation,
    useGetHostOffersByIdQuery,
    useGetOfferByIdQuery,
    useLazyGetOfferByIdQuery,
    useUpdateWhenMutation,
    useUpdateWhoNeedsMutation,
    useGetWhoNeedsQuery,
    useUpdateDescriptionMutation,
    useGetDescriptionQuery,
    useUpdateWhatToDoMutation,
    useGetWhatToDoQuery,
    useUpdateConditionsMutation,
    useGetConditionsQuery,
    useUpdateFinishingTouchesMutation,
    useGetFinishingTouchesQuery,
} = offerApi;
