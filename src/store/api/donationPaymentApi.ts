import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQuery } from "@/shared/api/baseQuery/baseQuery";
import { API_BASE_URL } from "@/shared/constants/api";

export interface CreateDonationPaymentRequest {
    fundraiseId: string;
    amount: number;
    isAnonymous: boolean;
}

export interface CreateDonationPaymentResponse {
    donationId: string;
    paymentUrl: string;
    status: string;
}

export interface DonationListItem {
    id: string;
    amount: number;
    isAnonymous: boolean;
    donorName: string | null;
    createdAt: string;
}

export interface DonationListResponse {
    data: DonationListItem[];
    collectedAmount: number;
    donationCount: number;
    pagination: {
        total: number;
        page: number;
        limit: number;
    };
}

export interface DonationRatingItem {
    userId: string;
    userName: string;
    totalAmount: number;
    donationCount: number;
}

export interface HostDonationItem {
    id: string;
    donorName: string;
    fundraiseName: string;
    amount: number;
    createdAt: string;
}

export interface HostDonationsResponse {
    data: HostDonationItem[];
    pagination: {
        total: number;
        page: number;
        limit: number;
    };
}

export const donationPaymentApi = createApi({
    reducerPath: "donationPaymentApi",
    baseQuery,
    tagTypes: ["donationList"],
    endpoints: (build) => ({
        createDonationPayment: build.mutation<CreateDonationPaymentResponse, CreateDonationPaymentRequest>({
            query: (data) => ({
                url: `${API_BASE_URL}donations`,
                method: "POST",
                body: data,
            }),
            invalidatesTags: ["donationList"],
        }),
        getDonationsByFundraise: build.query<DonationListResponse, { fundraiseId: string; page?: number; limit?: number }>({
            query: ({ fundraiseId, page = 1, limit = 20 }) => ({
                url: `${API_BASE_URL}donations/fundraise/${fundraiseId}?page=${page}&limit=${limit}`,
                method: "GET",
            }),
            providesTags: ["donationList"],
        }),
        getDonationRating: build.query<DonationRatingItem[], { limit?: number }>({
            query: ({ limit = 50 }) => ({
                url: `${API_BASE_URL}donations/rating?limit=${limit}`,
                method: "GET",
            }),
        }),
        getHostDonations: build.query<HostDonationsResponse, { page?: number; limit?: number; sort?: string }>({
            query: ({ page = 1, limit = 20, sort }) => ({
                url: `${API_BASE_URL}donations/host?page=${page}&limit=${limit}${sort ? `&sort=${sort}` : ""}`,
                method: "GET",
            }),
            providesTags: ["donationList"],
        }),
    }),
});

export const {
    useCreateDonationPaymentMutation,
    useGetDonationsByFundraiseQuery,
    useGetDonationRatingQuery,
    useGetHostDonationsQuery,
} = donationPaymentApi;
