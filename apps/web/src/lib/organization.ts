import "server-only";

import type { components } from "@goodsurfing/api";

import type { Locale } from "@/i18n/config";
import type { Translate } from "@/i18n/dictionary";

import { OPTIONAL_BLOCK_TIMEOUT_MS, serverApi } from "./api";
import { categoryName } from "./categories";
import { type OrganizationOffersPage, type OrganizationReview, toOrganizationOffer } from "./organizationLists";
import type { Page } from "./offerReview";

export type Organization = components["schemas"]["Organization-organization.read_user.member_media_object.read"];

export type OrganizationResult = { kind: "ok"; organization: Organization } | { kind: "notFound" } | { kind: "error" };

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/** Публичная страница организации (HostPersonalPage старого фронта) */
export async function getOrganization(locale: Locale, id: string): Promise<OrganizationResult> {
    if (!UUID.test(id)) return { kind: "notFound" };
    try {
        const { data, response } = await serverApi(locale).GET("/api/v1/organizations/{id}", {
            params: { path: { id } },
            signal: AbortSignal.timeout(8000),
        });
        if (response.status === 404) return { kind: "notFound" };
        return data ? { kind: "ok", organization: data } : { kind: "error" };
    } catch {
        return { kind: "error" };
    }
}

export const ORGANIZATION_OFFERS_PER_PAGE = 10;
export const ORGANIZATION_REVIEWS_PER_PAGE = 5;

/** Первая страница вакансий организации; null — не загрузилась. */
export async function getOrganizationOffers(locale: Locale, id: string, t: Translate): Promise<OrganizationOffersPage | null> {
    try {
        const { data } = await serverApi(locale).GET("/api/v1/vacancy/list/{organizationId}", {
            params: { path: { organizationId: id }, query: { page: 1, limit: ORGANIZATION_OFFERS_PER_PAGE } },
            signal: AbortSignal.timeout(OPTIONAL_BLOCK_TIMEOUT_MS),
        });
        if (!data) return null;
        return {
            items: (data.data ?? []).map((offer) => toOrganizationOffer(offer, (name) => categoryName(name, t))).filter((offer) => offer !== null),
            total: data.pagination?.total ?? 0,
        };
    } catch {
        return null;
    }
}

/** Первая страница отзывов о вакансиях организации */
export async function getOrganizationReviews(locale: Locale, id: string): Promise<Page<OrganizationReview> | null> {
    try {
        const { data } = await serverApi(locale).GET("/api/v1/review-vacancy/list-by-organization/{organizationId}", {
            params: { path: { organizationId: id }, query: { page: 1, limit: ORGANIZATION_REVIEWS_PER_PAGE } },
            signal: AbortSignal.timeout(OPTIONAL_BLOCK_TIMEOUT_MS),
        });
        if (!data) return null;
        return { items: data.data ?? [], total: data.pagination?.total ?? 0 };
    } catch {
        return null;
    }
}
