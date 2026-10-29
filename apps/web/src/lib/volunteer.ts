import "server-only";

import type { components } from "@goodsurfing/api";

import type { Locale } from "@/i18n/config";
import type { Translate } from "@/i18n/dictionary";

import { serverApi } from "./api";
import { categoryName } from "./categories";
import type { CatalogOffer } from "./offersCatalog";
import { toParticipatedOffer } from "./volunteerLists";

export type VolunteerProfile = components["schemas"]["ElementByIdResult"];

export type VolunteerResult = { kind: "ok"; profile: VolunteerProfile } | { kind: "notFound" } | { kind: "error" };

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/** Публичный профиль пользователя (VolunteerPersonalPage старого фронта) */
export async function getVolunteer(locale: Locale, id: string): Promise<VolunteerResult> {
    if (!UUID.test(id)) return { kind: "notFound" };
    try {
        const { data, response } = await serverApi(locale).GET("/api/v1/profile/{id}", {
            params: { path: { id } },
            signal: AbortSignal.timeout(8000),
        });
        if (response.status === 404) return { kind: "notFound" };
        return data ? { kind: "ok", profile: data } : { kind: "error" };
    } catch {
        return { kind: "error" };
    }
}

export const PARTICIPATED_PER_PAGE = 15;

/**
 * Вакансии, в которых волонтёр участвовал: у профиля только их номера, сами
 * вакансии — отдельными запросами (как в старом фронте), первые пятнадцать.
 */
export async function getParticipatedOffers(locale: Locale, ids: string[], t: Translate): Promise<CatalogOffer[]> {
    const results = await Promise.all(ids.slice(0, PARTICIPATED_PER_PAGE).map(async (id) => {
        try {
            const { data } = await serverApi(locale).GET("/api/v1/vacancy/{id}", {
                params: { path: { id: Number(id) } },
                signal: AbortSignal.timeout(5000),
            });
            return data ? toParticipatedOffer(data, (name) => categoryName(name, t)) : null;
        } catch {
            return null;
        }
    }));
    return results.filter((offer) => offer !== null);
}
