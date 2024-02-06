import { createApi } from "@reduxjs/toolkit/dist/query/react";
import { baseQuery } from "@/shared/api/baseQuery/baseQuery";
import { Offer } from "../model/types/offer";

interface UpdateOfferParams {
    body: Partial<Offer>;
}

interface CreateOfferResponse {
    id: string;
}

export const offerApi = createApi({
    reducerPath: "offerApi",
    baseQuery,
    tagTypes: ["offer"],
    endpoints: (build) => ({
        createOffer: build.mutation<CreateOfferResponse, void>({
            query: (body) => ({
                url: "/vacansy",
                method: "POST",
                body,
            }),
            invalidatesTags: ["offer"],
        }),
        updateWhere: build.mutation<unknown, UpdateOfferParams>({
            query: (data) => ({
                url: `/vacansy/${data.body.id}/where`,
                method: "PATCH",
                body: data.body.where,
            }),
            invalidatesTags: ["offer"],
        }),
        updateWhen: build.mutation<unknown, UpdateOfferParams>({
            query: (data) => ({
                url: `/vacansy/${data.body.id}/when`,
                method: "PATCH",
                body: data.body.when,
            }),
            invalidatesTags: ["offer"],
        }),
        updateWhoNeeds: build.mutation<unknown, UpdateOfferParams>({
            query: (data) => ({
                url: `/vacansy/${data.body.id}/how-needs`,
                method: "PATCH",
                body: data.body.whoNeeds,
            }),
            invalidatesTags: ["offer"],
        }),
        updateDescription: build.mutation<unknown, UpdateOfferParams>({
            query: (data) => ({
                url: `/vacansy/${data.body.id}/description`,
                method: "PATCH",
                body: data.body.description,
            }),
            invalidatesTags: ["offer"],
        }),
        updateWhatToDo: build.mutation<unknown, UpdateOfferParams>({
            query: (data) => ({
                url: `/vacansy/${data.body.id}/what-to-do`,
                method: "PATCH",
                body: data.body.whatToDo,
            }),
            invalidatesTags: ["offer"],
        }),
    }),
});

export const {
    useCreateOfferMutation,
    useUpdateWhereMutation,
} = offerApi;
