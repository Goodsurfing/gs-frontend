import "server-only";

import { createApiClient } from "@goodsurfing/api";

import type { Locale } from "@/i18n/config";

/**
 * Клиент API для серверного рендера. На стенде ходит в бэкенд по внутренней
 * сети (API_INTERNAL_URL=http://backend:80), локально — в API стейджа.
 */
export const serverApi = (locale: Locale) => createApiClient({
    baseUrl: process.env.API_INTERNAL_URL || process.env.NEXT_PUBLIC_API_URL || "https://api-staging.goodsurfing.org",
    locale,
});

/** Сколько ждать API при рендере необязательных блоков, прежде чем показать страницу без них. */
export const OPTIONAL_BLOCK_TIMEOUT_MS = 2000;
