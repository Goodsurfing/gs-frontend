import "server-only";

import type { Locale } from "@/i18n/config";

import { serverApi } from "./api";

/** Содержимое «О проекте» из админки. Основной блок страницы: таймаут дольше, чем у необязательных. */
export async function getAboutProject(locale: Locale) {
    try {
        const { data } = await serverApi(locale).GET("/api/v1/about-project/element", { signal: AbortSignal.timeout(5000) });
        return data ?? null;
    } catch {
        return null;
    }
}
