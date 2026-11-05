import "server-only";

import type { components } from "@goodsurfing/api";

import type { Locale } from "@/i18n/config";

import { OPTIONAL_BLOCK_TIMEOUT_MS, serverApi } from "./api";

export type Badge = components["schemas"]["BadgeResult"];

/** Все значки — страница «Все достижения». API недоступен — пустой список (страница с заглушкой). */
export async function getAchievementCatalog(locale: Locale): Promise<Badge[] | null> {
    try {
        const { data } = await serverApi(locale).GET("/api/v1/achievement/catalog", {
            params: { query: { lang: locale } },
            signal: AbortSignal.timeout(OPTIONAL_BLOCK_TIMEOUT_MS * 2),
        });
        return data ?? null;
    } catch {
        return null;
    }
}

/** Значки организации — необязательный блок: не ответило API — без значков. */
export async function getOrganizationBadges(locale: Locale, organizationId: string): Promise<Badge[]> {
    try {
        const { data } = await serverApi(locale).GET("/api/v1/achievement/organization/{id}", {
            params: { path: { id: organizationId }, query: { lang: locale } },
            signal: AbortSignal.timeout(OPTIONAL_BLOCK_TIMEOUT_MS),
        });
        return data ?? [];
    } catch {
        return [];
    }
}
