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
                url: "/vacanсy",
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
                url: "/vacanсy/my",
                method: "GET",
            }),
            providesTags: ["offer"],
        }),
        updateStatus: build.mutation<CreateOfferResponse, UpdateOfferParams>({
            query: (data) => ({
                url: `/vacanсy/${data.body.id}/status`,
                method: "PUT",
                body: { status: data.body.status },
            }),
            invalidatesTags: ["offer"],
        }),
        updateWhere: build.mutation<CreateOfferResponse, UpdateOfferParams>({
            query: (data) => ({
                url: `/vacanсy/${data.body.id}/where`,
                method: "PUT",
                body: data.body.where,
            }),
            invalidatesTags: ["offer"],
        }),
        updateWhen: build.mutation<CreateOfferResponse, UpdateOfferParams>({
            query: (data) => ({
                url: `/vacanсy/${data.body.id}/when`,
                method: "PUT",
                body: data.body.when,
            }),
            invalidatesTags: ["offer"],
        }),
        updateWhoNeeds: build.mutation<CreateOfferResponse, UpdateOfferParams>({
            query: (data) => ({
                url: `/vacanсy/${data.body.id}/how-needs`,
                method: "PUT",
                // toDo: Change body typing for backend
                body: {
                    genders: [data.body.whoNeeds?.genders],
                    ageMax: data.body.whoNeeds?.age?.maxAge,
                    ageMin: data.body.whoNeeds?.age?.minAge,
                    volunteerPlaces: data.body.whoNeeds?.volunteerPlaces,
                    receptionPlace: data.body.whoNeeds?.receptionPlace,
                    additionalInfo: data.body.whoNeeds?.additionalInfo,
                    needAllLanguages: data.body.whoNeeds?.needAllLanguages,
                    languages: data.body.whoNeeds?.languages,
                },
            }),
            invalidatesTags: ["offer"],
        }),
        updateDescription: build.mutation<CreateOfferResponse, UpdateOfferParams>({
            query: (data) => ({
                url: `/vacanсy/${data.body.id}/description`,
                method: "PUT",
                // toDo: Change body typing for backend
                body: {
                    title: data.body.description?.title,
                    categoryIds: data.body.description?.category,
                    shortDescription: data.body.description?.shortDescription,
                    description: data.body.description?.longDescription,
                    imageId: data.body.description?.titleImage,
                    galleryIds: data.body.description?.images,
                },
            }),
            invalidatesTags: ["offer"],
        }),
        updateWhatToDo: build.mutation<CreateOfferResponse, UpdateOfferParams>({
            query: (data) => ({
                url: `/vacanсy/${data.body.id}/what-to-do`,
                method: "PUT",
                // toDo: Change body typing for backend
                body: {
                    hours: data.body.whatToDo?.workingHours.hours,
                    timeType: data.body.whatToDo?.workingHours.timeType,
                    dayOff: data.body.whatToDo?.workingHours.dayOff,
                    skillIds: data.body.whatToDo?.skills,
                    additionalSkills: data.body.whatToDo?.additionalSkills,
                    externalInfo: data.body.whatToDo?.extraInfo,
                },
            }),
            invalidatesTags: ["offer"],
        }),
        updateConditions: build.mutation<CreateOfferResponse, UpdateOfferParams>({
            query: (data) => ({
                url: `/vacanсy/${data.body.id}/conditions`,
                method: "PUT",
                // toDo: Change body typing for backend
                body: {
                    housingIds: [data.body.conditions?.housing],
                    foodIds: [data.body.conditions?.nutrition],
                    paidTravelIds: [data.body.conditions?.travel],
                    conveniencesIds: data.body.conditions?.facilities,
                    additionalFeaturesIds: data.body.conditions?.extraFeatures,
                    volunteerContributions: data.body.conditions?.payment.contribution,
                    volunteerRemuneration: data.body.conditions?.payment.reward,
                    currency: data.body.conditions?.payment.currency,
                    additionalConditions: data.body.conditions?.extraConditions,
                },
            }),
            invalidatesTags: ["offer"],
        }),
    }),
});

export const {
    useCreateOfferMutation,
    useUpdateWhereMutation,
    useGetMyOffersQuery,
    useUpdateWhenMutation,
} = offerApi;
