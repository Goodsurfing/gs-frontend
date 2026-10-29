"use client";

import { useEffect, useRef, useState } from "react";

import type { CatalogOffer } from "@/lib/offersCatalog";
import { textSlice } from "@/lib/textSlice";

export interface OfferListCardLabels {
    more: string;
    notOnMap: string;
    reviews: string;
    went: string;
    noTitle: string;
    noDescription: string;
}

/**
 * Карточка вакансии в списке (entities/Offer OfferCard старого фронта). В
 * каталоге клик по карточке выбирает вакансию на карте, «Подробнее»
 * открывает её страницу; без onSelect (списки на страницах организации и
 * волонтёра) вся карточка ведёт на вакансию. Выбранная — с синей полосой
 * слева, закрытая — бледнее.
 */
export function OfferListCard({ offer, href, selected = false, onSelect, wide, labels }: {
    offer: CatalogOffer;
    href: string;
    selected?: boolean;
    onSelect?: (id: number) => void;
    /** Карта свёрнута — карточки в две колонки */
    wide: boolean;
    labels: OfferListCardLabels;
}) {
    const [imageFailed, setImageFailed] = useState(false);
    const imageRef = useRef<HTMLImageElement>(null);

    // Картинка могла не загрузиться ещё до того, как React подключил onError
    useEffect(() => {
        const image = imageRef.current;
        if (image?.complete && image.naturalWidth === 0) setImageFailed(true);
    }, []);

    return (
        <div className={`relative border-b border-accent-bg ${offer.active ? "" : "opacity-45"} ${wide ? "w-1/2 border-l down-2xl:w-full" : `w-full ${onSelect ? "min-w-[520px]" : ""}`}`}>
            {/* В каталоге отступы 10 px (OffersList старого фронта), в остальных списках — базовые 14/20 */}
            <div
                role={onSelect ? "button" : "link"}
                tabIndex={0}
                aria-pressed={onSelect ? selected : undefined}
                onClick={() => (onSelect ? onSelect(offer.id) : window.location.assign(href))}
                onKeyDown={(event) => {
                    if (event.key === "Enter" || (onSelect && event.key === " ")) {
                        event.preventDefault();
                        if (onSelect) onSelect(offer.id);
                        else window.location.assign(href);
                    }
                }}
                className={`flex h-full cursor-pointer items-start gap-3.5 border-l-[3px] ${onSelect ? "p-2.5" : "px-5 py-3.5"} shadow-[0_5px_20px_0_#2121210d] transition-colors duration-200 down-xs:flex-wrap down-xs:p-4 ${selected ? "border-l-primary bg-accent-bg" : "border-l-transparent bg-white"}`}
            >
                <div className="relative h-[110px] w-40 shrink-0 bg-accent-bg down-xs:h-[180px] down-xs:w-full">
                    {offer.image && !imageFailed && (
                        // eslint-disable-next-line @next/next/no-img-element -- превью из хранилища
                        <img ref={imageRef} src={offer.image} alt="" loading="lazy" onError={() => setImageFailed(true)} className="block h-full w-full object-cover" />
                    )}
                </div>
                <div className="min-w-0 flex-1">
                    <p className="line-clamp-2 text-[1rem] leading-5 font-medium text-ink-secondary">{textSlice(offer.title, 50, labels.noTitle)}</p>
                    <div className="mt-1.5 text-[14px] leading-[18px] font-medium text-caption down-xs:flex down-xs:flex-col">
                        <span className="block max-w-full truncate">{offer.address}</span>
                        {!offer.onMap && <span className="mt-0.5 inline-block text-[0.75rem] opacity-70">{labels.notOnMap}</span>}
                        <br />
                        <span>{offer.category}</span>
                    </div>
                    <div className="mt-2 flex flex-wrap gap-6 down-xs:gap-2">
                        {offer.rating > 0 && (
                            <div className="flex items-center">
                                {/* eslint-disable-next-line @next/next/no-img-element -- иконка */}
                                <img src="/web/icons/ui/star.svg" alt="" className="h-[13px] w-[13px]" />
                                <span className="ml-1.5 text-[14px] leading-5 font-black">{offer.rating}</span>
                            </div>
                        )}
                        <div className="flex flex-wrap gap-3 text-[14px] leading-5 font-medium">
                            {offer.reviews > 0 && <span>{labels.reviews}: {offer.reviews}</span>}
                            {offer.went > 0 && <span>{labels.went}: {offer.went}</span>}
                        </div>
                    </div>
                    <p className="mt-1.5 line-clamp-2 max-w-full text-[14px] leading-[17px] font-medium text-caption">
                        {textSlice(offer.description, 110, labels.noDescription)}
                    </p>
                    <a
                        href={href}
                        onClick={(event) => {
                            event.stopPropagation();
                            onSelect?.(offer.id);
                        }}
                        className="mt-1.5 inline-block text-[14px] leading-5 font-bold text-primary hover:underline"
                    >
                        {labels.more}
                    </a>
                </div>
            </div>
        </div>
    );
}
