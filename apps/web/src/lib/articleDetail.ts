import "server-only";

import type { Locale } from "@/i18n/config";

import { serverApi } from "./api";
import type { ArticleKind } from "./articleActions";

/**
 * Материал по id или slug (старые ссылки — по id, новые — по slug). Нет —
 * null. Новости и статьи блога отдаются на языке страницы.
 */
export async function getArticle(kind: ArticleKind, locale: Locale, idOrSlug: string) {
    const api = serverApi(locale);
    const options = { params: { path: { id: idOrSlug }, query: { lang: locale } }, signal: AbortSignal.timeout(5000) } as never;
    try {
        if (kind === "news") return (await api.GET("/api/v1/news/{id}", options)).data ?? null;
        if (kind === "blog") return (await api.GET("/api/v1/blog/{id}", options)).data ?? null;
        if (kind === "journal") return (await api.GET("/api/v1/journal/{id}", options)).data ?? null;
        return (await api.GET("/api/v1/video/{id}", options)).data ?? null;
    } catch {
        return null;
    }
}

/** «Журнал на Calameo» — адрес встраивания, если ссылка на Calameo */
export function calameoEmbed(url: string | null | undefined): string | null {
    if (!url) return null;
    const match = url.match(/calameo\.com\/books\/([a-zA-Z0-9]+)/);
    if (match?.[1]) return `https://v.calameo.com/?bkcode=${match[1]}`;
    return url.includes("v.calameo.com") ? url : null;
}
