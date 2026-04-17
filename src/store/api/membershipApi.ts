import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQuery } from "@/shared/api/baseQuery/baseQuery";
import { API_BASE_URL } from "@/shared/constants/api";

export type TariffForRole = "VOLUNTEER" | "HOST" | "BOTH";

export type MembershipStatus =
    | "PENDING"
    | "ACTIVE"
    | "EXPIRED"
    | "CANCELLED"
    | "REFUNDED";

export interface Tariff {
    id: string;
    code: string;
    name: string;
    description: string | null;
    price: number;
    priceRub: number;
    currency: string;
    durationDays: number;
    forRole: TariffForRole;
    active: boolean;
    sort: number;
}

export interface CurrentMembership {
    membershipId: string | null;
    status: MembershipStatus | null;
    isActive: boolean;
    startDate: string | null;
    endDate: string | null;
    tariff: Tariff | null;
}

export interface CheckoutRequest {
    tariffCode: string;
}

export interface CheckoutResponse {
    membershipId: string;
    paymentId: string;
    paymentUrl: string;
    status: MembershipStatus;
    tariffCode: string;
}

export const membershipApi = createApi({
    reducerPath: "membershipApi",
    baseQuery,
    tagTypes: ["membership", "tariffs"],
    endpoints: (build) => ({
        getTariffs: build.query<Tariff[], TariffForRole | void>({
            query: (forRole) => ({
                url: `${API_BASE_URL}membership/tariffs`,
                method: "GET",
                params: forRole ? { forRole } : undefined,
            }),
            providesTags: ["tariffs"],
        }),
        getCurrentMembership: build.query<CurrentMembership, void>({
            query: () => ({
                url: `${API_BASE_URL}membership/current`,
                method: "GET",
            }),
            providesTags: ["membership"],
        }),
        checkoutMembership: build.mutation<CheckoutResponse, CheckoutRequest>({
            query: (data) => ({
                url: `${API_BASE_URL}membership/checkout`,
                method: "POST",
                body: data,
            }),
            invalidatesTags: ["membership"],
        }),
    }),
});

export const {
    useGetTariffsQuery,
    useGetCurrentMembershipQuery,
    useCheckoutMembershipMutation,
} = membershipApi;
