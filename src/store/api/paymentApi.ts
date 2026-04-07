import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQuery } from "@/shared/api/baseQuery/baseQuery";
import { API_BASE_URL } from "@/shared/constants/api";

export interface CreatePaymentRequest {
    amount: string;
    currency?: string;
    description: string;
}

export interface CreatePaymentResponse {
    payment_id: string;
    payment_url: string;
    order_id: string;
}

export interface PaymentStatus {
    id: string;
    status: "PENDING" | "PROCESSING" | "SUCCESS" | "CANCELLED" | "FAILED";
    amount: string;
    currency: string;
    paidAt: string | null;
}

export interface MembershipStatus {
    hasMembership: boolean;
    paidAt: string | null;
}

export const paymentApi = createApi({
    reducerPath: "paymentApi",
    baseQuery,
    tagTypes: ["payment", "membership"],
    endpoints: (build) => ({
        createPayment: build.mutation<CreatePaymentResponse, CreatePaymentRequest>({
            query: (data) => ({
                url: `${API_BASE_URL}payments`,
                method: "POST",
                body: data,
            }),
            invalidatesTags: ["membership"],
        }),
        getPaymentStatus: build.query<PaymentStatus, string>({
            query: (paymentId) => ({
                url: `${API_BASE_URL}payments/${paymentId}`,
                method: "GET",
            }),
            providesTags: ["payment"],
        }),
        getMembershipStatus: build.query<MembershipStatus, void>({
            query: () => ({
                url: `${API_BASE_URL}payments/membership/status`,
                method: "GET",
            }),
            providesTags: ["membership"],
        }),
    }),
});

export const {
    useCreatePaymentMutation,
    useGetPaymentStatusQuery,
    useGetMembershipStatusQuery,
} = paymentApi;
