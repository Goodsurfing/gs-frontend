"use client";

import { useRef, useState } from "react";

import { OfferListCard, type OfferListCardLabels } from "@/components/offers-map/OfferListCard";
import { browserApi } from "@/lib/browserApi";
import type { CatalogOffer } from "@/lib/offersCatalog";
import { toParticipatedOffer } from "@/lib/volunteerLists";

const PER_PAGE = 15;

/**
 * «Вакансии», в которых участвовал волонтёр (VolunteerOffersCard старого
 * фронта): первые 15 — с сервера; больше трёх — окно до 560 px, следующие
 * 15 догружаются при прокрутке на 70 %.
 */
export function VolunteerOffers({ ids, initial, offerHref, categories, labels }: {
    /** Номера всех вакансий из профиля */
    ids: string[];
    initial: CatalogOffer[];
    offerHref: string;
    categories: Record<string, string>;
    labels: { empty: string; card: OfferListCardLabels };
}) {
    const [items, setItems] = useState(initial);
    const loaded = useRef(PER_PAGE);
    const loading = useRef(false);

    const more = async () => {
        if (loading.current || loaded.current >= ids.length) return;
        loading.current = true;
        const next = ids.slice(loaded.current, loaded.current + PER_PAGE);
        loaded.current += PER_PAGE;
        const offers = await Promise.all(next.map((id) => browserApi()
            .GET("/api/v1/vacancy/{id}", { params: { path: { id: Number(id) } } })
            .then(({ data }) => (data ? toParticipatedOffer(data, (name) => (name ? categories[name.trim()] ?? name.trim() : undefined)) : null))
            .catch(() => null)));
        setItems((prev) => [...prev, ...offers.filter((offer) => offer !== null)]);
        loading.current = false;
    };

    const cards = items.map((offer) => (
        <OfferListCard key={offer.id} offer={offer} href={offerHref.replace("{id}", String(offer.id))} wide={false} labels={labels.card} />
    ));

    return (
        <div className="mt-5">
            {items.length === 0 ? <div>{labels.empty}</div> : (
                <div
                    className="mt-5 max-h-[560px] overflow-auto [&::-webkit-scrollbar]:w-[5px] [&::-webkit-scrollbar-thumb]:rounded-[10px] [&::-webkit-scrollbar-thumb]:bg-primary [&::-webkit-scrollbar-track]:bg-white"
                    onScroll={(event) => {
                        const node = event.currentTarget;
                        if (node.scrollTop + node.clientHeight >= node.scrollHeight * 0.7) void more();
                    }}
                >
                    {/* До трёх — ещё отступ 20 px, как в старом фронте */}
                    {items.length <= 3 ? <div className="mt-5">{cards}</div> : cards}
                </div>
            )}
        </div>
    );
}
