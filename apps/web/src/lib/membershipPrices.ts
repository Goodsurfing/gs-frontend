import type { Locale } from "@/i18n/config";
import { serverApi } from "@/lib/api";

// Коды тарифов и цены на случай, если API недоступен — как shared/constants/membership старого фронта
export const TARIFF = { volunteer: "volunteer_990", host: "host_4990", international: "international_5000" } as const;
const FALLBACK_PRICE: Record<string, number> = { volunteer_990: 990, host_4990: 4990, international_5000: 5000 };

/** Цены тарифов в рублях по коду (на сервере; API недоступен — цены по умолчанию) */
export async function getPrices(locale: Locale): Promise<Record<string, number>> {
    try {
        const { data } = await serverApi(locale).GET("/api/v1/membership/tariffs", {
            params: { query: { forRole: "BOTH" } },
            signal: AbortSignal.timeout(5000),
        });
        const prices = Object.fromEntries((data ?? []).map((tariff) => [tariff.code, (tariff as { priceRub?: number }).priceRub]));
        return Object.fromEntries(Object.entries(FALLBACK_PRICE).map(([code, price]) => [code, prices[code] ?? price]));
    } catch {
        return FALLBACK_PRICE;
    }
}
