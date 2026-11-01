"use client";

import { type ReactNode, useEffect, useState } from "react";

import { OffersCarousel } from "@/components/offers/OffersCarousel";

import { OfferCard } from "@/components/offers/OfferCard";
import { useOptionalSession } from "@/components/session/SessionProvider";
import { browserApi } from "@/lib/browserApi";
import type { OfferCardData } from "@/lib/offers";

/**
 * «Интересные вакансии» для вошедшего: если на дашборде выбраны любимые
 * направления — вакансии этих направлений по рекомендации (GS-90), иначе
 * остаётся подборка, отрисованная сервером.
 */
export function PersonalOffers({ children, offerHref, categories, labels }: {
    /** Карточки подборки с сервера (для гостя и пока профиль не загружен) */
    children: ReactNode;
    labels: { prev: string; next: string };
    offerHref: string;
    categories: Record<string, string>;
}) {
    const session = useOptionalSession();
    const favorite = session?.profile?.favoriteCategories ?? [];
    const key = favorite.join(",");
    const [offers, setOffers] = useState<OfferCardData[] | null>(null);

    useEffect(() => {
        if (!key) return;
        let cancelled = false;
        void browserApi(session?.token)
            .GET("/api/v1/vacancy", { params: { query: { "categoryIds[]": key.split(",").map(Number), sort: "recommendation", fields: "card", limit: 10 } } })
            .then(({ data }) => !cancelled && (data?.data ?? []).length > 0 && setOffers((data?.data ?? []).slice(0, 10)))
            .catch(() => undefined);
        return () => {
            cancelled = true;
        };
    }, [key, session?.token]);

    return (
        <OffersCarousel prevLabel={labels.prev} nextLabel={labels.next}>
            {offers ? offers.map((offer) => {
                const name = offer.categories[0]?.name?.trim();
                return <OfferCard key={offer.id} offer={offer} href={offerHref.replace("{id}", String(offer.id))} category={name ? categories[name] ?? name : undefined} />;
            }) : children}
        </OffersCarousel>
    );
}
