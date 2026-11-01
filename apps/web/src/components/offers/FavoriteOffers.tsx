"use client";

import { useEffect, useState } from "react";

import { OfferListCard, type OfferListCardLabels } from "@/components/offers-map/OfferListCard";
import { useSession } from "@/components/session/SessionProvider";
import { Spinner } from "@/components/ui/Spinner";
import { browserApi } from "@/lib/browserApi";
import { mediaUrl } from "@/lib/media";
import type { CatalogOffer } from "@/lib/offersCatalog";

import { useFavoriteOffers } from "./useFavoriteOffers";

/** Сервер отдаёт не больше 100 за раз; больше в избранном пока ни у кого нет */
const FAVORITES_LIMIT = 100;

/**
 * Избранные вакансии (FavoriteOffers старого фронта): карточки в две колонки
 * (уже 992 px — в одну) с сердечком; убранная из избранного пропадает из
 * списка. Пусто — приглашение на карту вакансий и большое пустое сердце.
 */
export function FavoriteOffers({ hrefs, categories, labels }: {
    hrefs: { offer: string; offersMap: string };
    categories: Record<string, string>;
    labels: { empty: string; viewOffers: string; add: string; remove: string; card: OfferListCardLabels };
}) {
    const session = useSession();
    // Пока номера избранного не пришли, карточки списка считаются избранными
    const favorites = useFavoriteOffers({ assumeFavorite: true });
    const [offers, setOffers] = useState<CatalogOffer[] | null>(null);

    useEffect(() => {
        if (session.status !== "user") return;
        let cancelled = false;
        void browserApi(session.token)
            .GET("/api/v1/favorites/vacancies", { params: { query: { limit: FAVORITES_LIMIT } } })
            .catch(() => ({ data: undefined }))
            .then(({ data }) => {
                if (cancelled) return;
                setOffers((data?.data ?? []).map((offer) => {
                    const name = offer.categories[0]?.name?.trim();
                    return {
                        id: offer.id,
                        title: offer.title,
                        description: offer.shortDescription,
                        image: mediaUrl(offer.image, "medium"),
                        address: offer.address,
                        category: name ? categories[name] ?? name : undefined,
                        rating: Number(offer.averageRating) || 0,
                        reviews: offer.reviewsCount,
                        went: offer.acceptedApplicationsCount,
                        active: String(offer.status) === "active",
                        // Отметки «нет на карте» в избранном старого фронта не было
                        onMap: true,
                    };
                }));
            });
        return () => {
            cancelled = true;
        };
    }, [session.status, session.token, categories]);

    if (!offers) return <Spinner />;

    if (offers.length === 0) {
        return (
            <div className="flex flex-col gap-5">
                <p>{labels.empty}</p>
                <a href={hrefs.offersMap} className="flex max-w-[350px] items-center justify-center rounded-[10px] border border-primary px-[50px] py-2.5 text-center text-label text-primary no-underline transition-all duration-300 hover:bg-primary hover:text-white">
                    {labels.viewOffers}
                </a>
                <div>
                    {/* eslint-disable-next-line @next/next/no-img-element -- иллюстрация */}
                    <img src="/web/icons/ui/empty-favorite-heart.svg" alt="" className="inline h-[500px] w-full" />
                </div>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-2 down-lg:grid-cols-1">
            {offers.map((offer) => (
                <OfferListCard
                    key={offer.id}
                    offer={offer}
                    href={hrefs.offer.replace("{id}", String(offer.id))}
                    wide={false}
                    labels={labels.card}
                    favorite={favorites.enabled ? {
                        active: favorites.isFavorite(offer.id),
                        busy: favorites.isBusy(offer.id),
                        labels: { add: labels.add, remove: labels.remove },
                        onToggle: () => {
                            const removing = favorites.isFavorite(offer.id);
                            void favorites.toggleFavorite(offer.id).then((ok) => {
                                // Как в старом фронте: после снятия список перечитывается и карточка пропадает
                                if (ok && removing) setOffers((prev) => prev?.filter((item) => item.id !== offer.id) ?? prev);
                            });
                        },
                    } : undefined}
                />
            ))}
        </div>
    );
}
