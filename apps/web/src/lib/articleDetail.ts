import "server-only";

import type { Locale } from "@/i18n/config";

import { serverApi } from "./api";
import { ApiUnavailableError, isClientError } from "./apiUnavailable";
import type { ArticleKind } from "./articleActions";

/**
 * Материал по id или slug (старые ссылки — по id, новые — по slug). Нет (API
 * отвечает 400/404) — null. Сбой API — ApiUnavailableError, чтобы в кэш
 * страницы не попало «не найдено». Новости и статьи блога отдаются на языке страницы.
 */
export async function getArticle(kind: ArticleKind, locale: Locale, idOrSlug: string) {
    const api = serverApi(locale);
    const options = { params: { path: { id: idOrSlug }, query: { lang: locale } }, signal: AbortSignal.timeout(5000) } as never;
    const request = kind === "news" ? api.GET("/api/v1/news/{id}", options)
        : kind === "blog" ? api.GET("/api/v1/blog/{id}", options)
            : kind === "journal" ? api.GET("/api/v1/journal/{id}", options)
                : api.GET("/api/v1/video/{id}", options);
    // Ответы разных разделов — разные типы; страница приводит к своему (Loaded в ArticlePage)
    const result: { data?: unknown; response: Response } = await request.catch(() => {
        throw new ApiUnavailableError(`${kind} ${idOrSlug}`);
    });
    if (result.data) return result.data;
    if (isClientError(result.response.status)) return null;
    throw new ApiUnavailableError(`${kind} ${idOrSlug}`);
}

/** «Журнал на Calameo» — адрес встраивания, если ссылка на Calameo */
export function calameoEmbed(url: string | null | undefined): string | null {
    if (!url) return null;
    const match = url.match(/calameo\.com\/books\/([a-zA-Z0-9]+)/);
    if (match?.[1]) return `https://v.calameo.com/?bkcode=${match[1]}`;
    return url.includes("v.calameo.com") ? url : null;
}
