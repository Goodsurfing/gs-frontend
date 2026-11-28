import "server-only";

import { OPTIONAL_BLOCK_TIMEOUT_MS } from "@/lib/api";
import { findYandex, type OAuthProvider } from "@/lib/yandexId";

/** Как часто страница входа перепроверяет, включён ли вход через Яндекс (ключи на сервере) */
export const OAUTH_PROVIDERS_REVALIDATE = 300;

/**
 * Включён ли Яндекс ID — при рендере страницы (кэш страницы, 5 минут): кнопка
 * сразу в HTML или её сразу нет, без прыжка вёрстки после загрузки.
 * provider — включён, null — выключен (пустой список или у бэкенда нет такого
 * пути), undefined — API не ответил: браузер спросит сам, место под кнопку
 * зарезервировано.
 */
export async function yandexProviderHint(): Promise<OAuthProvider | null | undefined> {
    const base = process.env.API_INTERNAL_URL || process.env.NEXT_PUBLIC_API_URL || "https://api-staging.goodsurfing.org";
    try {
        const response = await fetch(`${base}/api/v1/oauth/providers`, {
            next: { revalidate: OAUTH_PROVIDERS_REVALIDATE },
            signal: AbortSignal.timeout(OPTIONAL_BLOCK_TIMEOUT_MS),
        });
        if (response.status >= 500) return undefined;
        if (!response.ok) return null;
        const data = await response.json() as { providers?: OAuthProvider[] };
        return findYandex(data?.providers);
    } catch {
        return undefined;
    }
}
