"use client";

import { useRef, useState } from "react";

import { OfferListCard, type OfferListCardLabels } from "@/components/offers-map/OfferListCard";
import { browserApi } from "@/lib/browserApi";
import type { CatalogOffer } from "@/lib/offersCatalog";
import { toOrganizationOffer } from "@/lib/organizationLists";

const PER_PAGE = 10;

/**
 * «Вакансии» организации (HostOffersCard старого фронта): до трёх — просто
 * списком, больше — в окне высотой 560 px, следующие десять догружаются при
 * прокрутке окна на 70 %. Черновики не показываются.
 */
export function OrganizationOffers({ organizationId, initial, offerHref, categories, labels }: {
    organizationId: string;
    initial: { items: CatalogOffer[]; total: number } | null;
    offerHref: string;
    /** Подписи категорий по названию из API */
    categories: Record<string, string>;
    labels: { empty: string; card: OfferListCardLabels };
}) {
    const [items, setItems] = useState(initial?.items ?? []);
    const [hasMore, setHasMore] = useState(!!initial && initial.total > PER_PAGE);
    const page = useRef(1);
    const loading = useRef(false);

    const more = async () => {
        if (loading.current || !hasMore) return;
        loading.current = true;
        try {
            const next = page.current + 1;
            const { data } = await browserApi().GET("/api/v1/vacancy/list/{organizationId}", {
                params: { path: { organizationId }, query: { page: next, limit: PER_PAGE } },
            });
            const offers = (data?.data ?? [])
                .map((offer) => toOrganizationOffer(offer, (name) => (name ? categories[name.trim()] ?? name.trim() : undefined)))
                .filter((offer) => offer !== null);
            setItems((prev) => [...prev, ...offers]);
            page.current = next;
            setHasMore(next * PER_PAGE < (data?.pagination?.total ?? 0));
        } catch {
            setHasMore(false);
        } finally {
            loading.current = false;
        }
    };

    const list = (
        <div>
            {items.map((offer) => (
                <OfferListCard key={offer.id} offer={offer} href={offerHref.replace("{id}", String(offer.id))} wide={false} labels={labels.card} />
            ))}
        </div>
    );

    return (
        <>
            <div className="mt-5">{items.length === 0 && <div>{labels.empty}</div>}</div>
            {items.length > 3 ? (
                <div
                    className="mt-5 h-[560px] overflow-y-auto [&::-webkit-scrollbar]:w-[5px] [&::-webkit-scrollbar-thumb]:rounded-[10px] [&::-webkit-scrollbar-thumb]:bg-primary [&::-webkit-scrollbar-track]:bg-white"
                    onScroll={(event) => {
                        const node = event.currentTarget;
                        if (node.scrollTop + node.clientHeight >= node.scrollHeight * 0.7) void more();
                    }}
                >
                    {list}
                </div>
            ) : list}
        </>
    );
}
