import "server-only";

import type { components } from "@goodsurfing/api";

import type { Locale } from "@/i18n/config";

import { serverApi } from "./api";

const TIMEOUT_MS = 5000;

// В схеме OpenAPI нет части полей, которые бэкенд отдаёт (статус, дата старта, процент) — дописаны здесь
export type FundraiseDetail = Omit<components["schemas"]["ElementResult3"], "latitude" | "longitude" | "daysLeft" | "amount" | "description"> & {
    status: "active" | "close" | "draft";
    startDate: string | null;
    percentAmountCollect: number;
    daysLeft: number | null;
    amount: number | null;
    description: string | null;
    latitude: number | null;
    longitude: number | null;
};

/** Сбор (данные анонимные; что может вошедший — дозапрашивает браузер). Нет — notFound, сбой API — error. */
export async function getFundraise(locale: Locale, id: string): Promise<{ kind: "ok"; fundraise: FundraiseDetail } | { kind: "notFound" | "error" }> {
    try {
        const { data, response } = await serverApi(locale).GET("/api/v1/fundraise/{id}", {
            params: { path: { id }, query: { lang: locale } },
            signal: AbortSignal.timeout(TIMEOUT_MS),
        });
        if (data) return { kind: "ok", fundraise: data as unknown as FundraiseDetail };
        return { kind: response.status === 404 || response.status === 400 ? "notFound" : "error" };
    } catch {
        return { kind: "error" };
    }
}

export interface Donor { id: string; name: string | null; anonymous: boolean; date: string; amount: number }

/** Десять последних пожертвований и итог (DonationDonorsCard старого фронта). Сбой — null. */
export async function getDonors(locale: Locale, fundraiseId: string) {
    try {
        const { data } = await serverApi(locale).GET("/api/v1/donation/fundraise/{fundraiseId}/list", {
            params: { path: { fundraiseId }, query: { page: 1, limit: 10 } },
            signal: AbortSignal.timeout(TIMEOUT_MS),
        } as never);
        const result = data as { data?: { id: string; fullName?: string | null; isAnonymous?: boolean; createdAt?: string; amount: number }[]; collectedAmount?: number; donationCount?: number } | undefined;
        if (!result) return null;
        return {
            count: result.donationCount ?? 0,
            collected: result.collectedAmount ?? 0,
            items: (result.data ?? []).map((item): Donor => ({
                id: item.id,
                name: item.fullName ?? null,
                anonymous: !!item.isAnonymous,
                date: item.createdAt ?? "",
                amount: item.amount,
            })),
        };
    } catch {
        return null;
    }
}
