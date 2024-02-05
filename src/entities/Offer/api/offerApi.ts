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

    }),
});

export const {
    useCreateOfferMutation,
    useUpdateWhereMutation,
} = offerApi;
