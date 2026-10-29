import "server-only";

import type { Locale } from "@/i18n/config";

import { OPTIONAL_BLOCK_TIMEOUT_MS, serverApi } from "./api";
import type { ListSort } from "./listParams";

export const ARTICLE_SORT: Record<ListSort, "created:desc" | "likeNews:desc"> = { new: "created:desc", popular: "likeNews:desc" };

/** Категории блога (фильтр на /blog и /news, как в старом фронте). Необязательный блок. */
export async function getBlogCategories(locale: Locale) {
    try {
        const { data } = await serverApi(locale).GET("/api/v1/blog-category", {
            params: { query: { lang: locale } },
            signal: AbortSignal.timeout(OPTIONAL_BLOCK_TIMEOUT_MS),
        });
        return data ?? [];
    } catch {
        return [];
    }
}
