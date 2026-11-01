import "server-only";

import type { Locale } from "@/i18n/config";

import { serverApi } from "./api";
import { type DonationsFilters, donationsApiQuery } from "./donationsFilters";
import { mediaUrl } from "./media";

export interface DonationListItem {
    id: string;
    title: string;
    organization: string;
    description: string;
    image?: string;
    percent: number;
    daysLeft: number | null;
    success: boolean;
}

/** Страница списка сборов по фильтрам; сбой API — null */
export async function getDonationsPage(locale: Locale, filters: DonationsFilters): Promise<{ items: DonationListItem[]; total: number } | null> {
    try {
        const { data } = await serverApi(locale).GET("/api/v1/fundraise", {
            params: { query: donationsApiQuery(filters) },
            signal: AbortSignal.timeout(5000),
        });
        if (!data) return null;
        const list = (data as { data?: unknown[]; pagination?: { total?: number } });
        return {
            total: list.pagination?.total ?? 0,
            items: (list.data ?? []).map((raw) => {
                const item = raw as {
                    id: string; name?: string | null; shortDescription?: string | null; organization?: { name?: string | null } | null;
                    image?: { contentUrl?: string | null; thumbnails?: unknown } | null; percentAmountCollect?: number; daysLeft?: number | null; isSuccess?: boolean;
                };
                return {
                    id: item.id,
                    title: item.name ?? "",
                    organization: item.organization?.name ?? "",
                    description: item.shortDescription ?? "",
                    image: mediaUrl(item.image, "medium"),
                    percent: item.percentAmountCollect ?? 0,
                    daysLeft: item.daysLeft ?? null,
                    success: !!item.isSuccess,
                };
            }),
        };
    } catch {
        return null;
    }
}
