import "server-only";

import type { components } from "@goodsurfing/api";

import type { Locale } from "@/i18n/config";

import { OPTIONAL_BLOCK_TIMEOUT_MS, serverApi } from "./api";

export type TeamMember = components["schemas"]["ListResult21"];
export type Ambassador = components["schemas"]["ListResult20"];

/** Команда (основатели или остальные) — 30 человек, как в старом фронте. API недоступен — пусто. */
export async function getTeam(locale: Locale, isFounder: boolean): Promise<TeamMember[]> {
    try {
        const { data } = await serverApi(locale).GET("/api/v1/our-team/", {
            params: { query: { isFounder, limit: 30, page: 1 } },
            signal: AbortSignal.timeout(OPTIONAL_BLOCK_TIMEOUT_MS),
        });
        return data?.data ?? [];
    } catch {
        return [];
    }
}

/** Амбассадоры — 50 человек, как в старом фронте. */
export async function getAmbassadors(locale: Locale): Promise<Ambassador[]> {
    try {
        const { data } = await serverApi(locale).GET("/api/v1/leader/", {
            params: { query: { limit: 50, page: 1 } },
            signal: AbortSignal.timeout(OPTIONAL_BLOCK_TIMEOUT_MS),
        });
        return data?.data ?? [];
    } catch {
        return [];
    }
}
