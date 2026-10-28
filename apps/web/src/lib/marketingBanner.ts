import "server-only";

import type { Locale } from "@/i18n/config";

import { OPTIONAL_BLOCK_TIMEOUT_MS, serverApi } from "./api";

export interface MarketingBanner {
    url: string;
    description: string;
}

/**
 * Баннер под шапкой на всех страницах (задаётся в админке). Необязательный
 * блок: если API недоступен или отвечает дольше 2 с — страница без баннера.
 */
export async function getHeaderBanner(locale: Locale): Promise<MarketingBanner | null> {
    try {
        const { data } = await serverApi(locale).GET("/api/v1/marketing-banner/element/{type}", {
            params: { path: { type: "UNDER_HEADER_ALL_PAGES" } },
            signal: AbortSignal.timeout(OPTIONAL_BLOCK_TIMEOUT_MS),
        });
        return data?.url && data.description ? { url: data.url, description: data.description } : null;
    } catch {
        return null;
    }
}
