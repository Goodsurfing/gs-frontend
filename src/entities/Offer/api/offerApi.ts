import { createApi } from "@reduxjs/toolkit/dist/query/react";

import { baseQuery } from "@/shared/api/baseQuery/baseQuery";

import { AddressAutoComplete, MyOffers, Offer } from "../model/types/offer";

interface UpdateOfferParams {
    body: Partial<Offer>;
}

interface CreateOfferResponse {
    id: string;
}

export const offerApi = createApi({
    reducerPath: "offerApi",
    baseQuery,
    tagTypes: ["offer", "address"],
    endpoints: (build) => ({
        createOffer: build.mutation<CreateOfferResponse, void>({
            query: (body) => ({
                url: "/vacancy",
                method: "POST",
                body,
            }),
            invalidatesTags: ["offer"],
        }),
        getAddressAutoComplete: build.query<AddressAutoComplete, void>({
            query: () => ({
                url: "/address-autocomplet",
                method: "GET",
            }),
            providesTags: ["address"],
        }),
        getMyOffers: build.query<MyOffers, void>({
            query: () => ({
                url: "/vacancy/my",
                method: "GET",
            }),
            providesTags: ["offer"],
        }),
        updateStatus: build.mutation<CreateOfferResponse, UpdateOfferParams>({
            query: (data) => ({
                url: `/vacancy/${data.body.id}/status`,
                method: "PUT",
                body: { status: data.body.status },
            }),
            invalidatesTags: ["offer"],
        }),
        updateWhere: build.mutation<CreateOfferResponse, UpdateOfferParams>({
            query: (data) => ({
                url: `/vacancy/${data.body.id}/where`,
                method: "PUT",
                body: data.body.where,
            }),
            invalidatesTags: ["offer"],
        }),
        updateWhen: build.mutation<CreateOfferResponse, UpdateOfferParams>({
            query: (data) => ({
                url: `/vacancy/${data.body.id}/when`,
                method: "PUT",
                body: data.body.when,
            }),
            invalidatesTags: ["offer"],
        }),
        updateWhoNeeds: build.mutation<CreateOfferResponse, UpdateOfferParams>({
            query: (data) => ({
                url: `/vacancy/${data.body.id}/how-needs`,
                method: "PUT",
                // toDo: Change body typing for backend
                body: data.body.whoNeeds,
            }),
            invalidatesTags: ["offer"],
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
        updateWhatToDo: build.mutation<CreateOfferResponse, UpdateOfferParams>({
            query: (data) => ({
                url: `/vacancy/${data.body.id}/what-to-do`,
                method: "PUT",
                body: data.body.whatToDo,
            }),
            invalidatesTags: ["offer"],
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
                        housingIds: [conditions?.housingIds],
                        foodIds: [conditions?.foodIds],
                        paidTravelIds: [conditions?.paidTravelIds],
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
                    additionalConditionsIds: [
                        0,
                    ],
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
    useUpdateStatusMutation,
    useUpdateWhereMutation,
    useGetMyOffersQuery,
    useUpdateWhenMutation,
    useUpdateWhoNeedsMutation,
    useUpdateDescriptionMutation,
    useUpdateWhatToDoMutation,
    useUpdateConditionsMutation,
    useUpdateFinishingTouchesMutation,
} = offerApi;
