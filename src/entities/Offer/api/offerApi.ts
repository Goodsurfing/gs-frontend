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
        // getWhere: build.query<OfferWhere, CreateOfferResponse>({
        //     query: (data) => ({
        //         url: `vacancies/${data.id}`,
        //         method: "GET",
        //     }),
        //     transformResponse: (response: Offer) => response.where,
        //     providesTags: ["offer"],
        // }),
        // getWhen: build.query<OfferWhenApi, CreateOfferResponse>({
        //     query: (data) => ({
        //         url: `vacancies/${data.id}`,
        //         method: "GET",
        //     }),
        //     transformResponse: (response: Offer) => response.when,
        //     providesTags: ["offer"],
        // }),
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
    }),
});

export const {
    useCreateOfferMutation,
    useUpdateOfferMutation,
    useGetHostOffersByIdQuery,
    useGetOfferByIdQuery,
    useLazyGetOfferByIdQuery,
    useUpdateConditionsMutation,
    useUpdateFinishingTouchesMutation,
} = offerApi;
