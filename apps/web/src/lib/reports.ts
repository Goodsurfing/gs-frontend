import "server-only";

import type { components } from "@goodsurfing/api";

import type { Locale } from "@/i18n/config";

import { OPTIONAL_BLOCK_TIMEOUT_MS, serverApi } from "./api";

export type DonationReport = components["schemas"]["ListResult12"];

/**
 * Отчёты НКО из админки (страницы /npo и /donation-reports). Необязательный
 * блок: API недоступен — страница без него.
 */
export async function getDonationReports(locale: Locale): Promise<DonationReport[]> {
    try {
        const { data } = await serverApi(locale).GET("/api/v1/report", {
            signal: AbortSignal.timeout(OPTIONAL_BLOCK_TIMEOUT_MS),
        });
        return data ?? [];
    } catch {
        return [];
    }
}
