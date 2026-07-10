import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQuery } from "@/shared/api/baseQuery/baseQuery";
import { API_BASE_URL } from "@/shared/constants/api";

export type TariffForRole = "VOLUNTEER" | "HOST" | "BOTH";

export type TariffCategory = "REGULAR" | "INTERNATIONAL";

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
    category: TariffCategory;
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

export type PaymentStatusValue =
    | "PENDING"
    | "PROCESSING"
    | "SUCCESS"
    | "CANCELLED"
    | "FAILED"
    | "REFUNDED";

export interface PaymentStatusResponse {
    id: string;
    status: PaymentStatusValue;
    amount: string;
    currency: string;
    paidAt: string | null;
    // Однозначная привязка к тарифу ЭТОГО конкретного платежа. С тех пор как
    // у юзера может быть больше одного активного членства одновременно
    // (REGULAR + INTERNATIONAL), "текущее активное членство" уже не
    // однозначно говорит, что именно только что купили — а этот платёж
    // всегда про один конкретный тариф.
    tariffCode: string | null;
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
        // Все активные членства сразу — может быть и REGULAR, и
        // INTERNATIONAL одновременно. getCurrentMembership выше схлопывает
        // до одного и оставлен только ради обратной совместимости.
        getCurrentAllMemberships: build.query<CurrentMembership[], void>({
            query: () => ({
                url: `${API_BASE_URL}membership/current-all`,
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
        getPaymentStatus: build.query<PaymentStatusResponse, string>({
            query: (id) => ({
                url: `${API_BASE_URL}payments/${id}`,
                method: "GET",
            }),
        }),
    }),
});

export const {
    useGetTariffsQuery,
    useGetCurrentMembershipQuery,
    useGetCurrentAllMembershipsQuery,
    useCheckoutMembershipMutation,
    useGetPaymentStatusQuery,
} = membershipApi;
