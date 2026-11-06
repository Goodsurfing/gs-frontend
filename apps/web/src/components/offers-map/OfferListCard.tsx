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
    /** «Организатор давно не заходил» — значок у вакансий «спящих» организаторов (каталог) */
    sleeping?: string;
    /** «Актуальность не подтверждена» (GS-248) */
    stale?: string;
}

/**
 * Карточка вакансии в списке (entities/Offer OfferCard старого фронта). В
 * каталоге клик по карточке выбирает вакансию на карте, «Подробнее»
 * открывает её страницу; без onSelect (списки на страницах организации и
 * волонтёра) вся карточка ведёт на вакансию. Выбранная — с синей полосой
 * слева, закрытая — бледнее. Сердечко — не внутри карточки-ссылки (кнопка
 * в ссылке недоступна читалкам), а поверх неё, в углу картинки.
 */
export function OfferListCard({ offer, href, selected = false, onSelect, wide, compact = false, labels, favorite, showImage = true }: {
    offer: CatalogOffer;
    href: string;
    selected?: boolean;
    onSelect?: (id: number) => void;
    /** Карта свёрнута — карточки в две колонки */
    wide: boolean;
    /** Каталог с картой на десктопе: фото меньше, без описания — на экране больше вакансий */
    compact?: boolean;
    labels: OfferListCardLabels;
    /** Сердечко «в избранное» на картинке — только вошедшим (gs-backend #407) */
    favorite?: { active: boolean; busy?: boolean; onToggle: () => void; labels: { add: string; remove: string } };
    /** Без картинки (isImageShow={false} старого фронта — карточка заявки в сообщениях) */
    showImage?: boolean;
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
                {showImage && (
                    <div className={`relative shrink-0 overflow-hidden bg-accent-bg down-xs:h-[180px] down-xs:w-full ${compact ? "h-[110px] w-40 min-[993px]:h-[84px] min-[993px]:w-28 min-[993px]:rounded-[6px]" : "h-[110px] w-40"}`}>
                        {offer.image && !imageFailed && (
                            // eslint-disable-next-line @next/next/no-img-element -- превью из хранилища
                            <img ref={imageRef} src={offer.image} alt="" loading="lazy" onError={() => setImageFailed(true)} className="block h-full w-full object-cover" />
                        )}
                    </div>
                )}
                <div className="min-w-0 flex-1">
                    <p className="line-clamp-2 text-[1rem] leading-5 font-medium text-ink-secondary">{textSlice(offer.title, 50, labels.noTitle)}</p>
                    {!offer.sleeping && offer.stale && labels.stale && (
                        <span className="mt-1 inline-flex items-center gap-1 rounded-full bg-field px-2 py-0.5 text-[12px] font-medium text-ink-tertiary">
                            <svg aria-hidden viewBox="0 0 24 24" className="h-3.5 w-3.5 text-caption" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 9v4" /><path d="M12 17h.01" /><circle cx="12" cy="12" r="10" /></svg>
                            {labels.stale}
                        </span>
                    )}
                    {offer.sleeping && labels.sleeping && (
                        <span className="mt-1 inline-flex items-center gap-1 rounded-full bg-notice-bg px-2 py-0.5 text-[12px] font-medium text-ink-secondary">
                            <svg aria-hidden viewBox="0 0 24 24" className="h-3.5 w-3.5 text-notice" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><path d="M12 7v5l3 2" /></svg>
                            {labels.sleeping}
                        </span>
                    )}
                    <div className="mt-1.5 text-[14px] leading-[18px] font-medium text-caption down-xs:flex down-xs:flex-col">
                        <span className="block max-w-full truncate">{offer.address}</span>
                        {!offer.onMap && <span className="mt-0.5 inline-block text-[0.75rem] opacity-70">{labels.notOnMap}</span>}
                        <br className={compact ? "min-[993px]:hidden" : undefined} />
                        <span className={compact ? "min-[993px]:block" : undefined}>{offer.category}</span>
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
                    <p className={`mt-1.5 line-clamp-2 max-w-full text-[14px] leading-[17px] font-medium text-caption ${compact ? "min-[993px]:hidden" : ""}`}>
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
            {favorite && (
                <button
                    type="button"
                    aria-label={favorite.active ? favorite.labels.remove : favorite.labels.add}
                    aria-pressed={favorite.active}
                    aria-busy={favorite.busy || undefined}
                    aria-disabled={favorite.busy || undefined}
                    onClick={favorite.onToggle}
                    // Угол картинки: рамка 3 px + отступ карточки + 10 px (top-2.5 left-2.5 внутри картинки)
                    className={`absolute cursor-pointer p-[5px] transition-transform duration-300 hover:scale-120 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary motion-reduce:transition-none motion-reduce:animate-none aria-busy:cursor-wait down-xs:top-[26px] down-xs:left-[29px] ${onSelect ? "top-5 left-[23px]" : "top-6 left-[33px]"} ${favorite.active ? "animate-heart-pulse" : ""}`}
                >
                    {/* Белое, в избранном — розовое с «пульсом» (heart-icon старого фронта) */}
                    <svg aria-hidden width="24" height="20" viewBox="0 0 24 20" className={`block transition-[fill] duration-300 ${favorite.active ? "fill-status-rejected" : "fill-white"}`}>
                        <path fillRule="evenodd" clipRule="evenodd" d="M12.1459 20C10.7363 18.6083 -2.99853 11.4923 1.02846 3.44676C4.91013 -4.30845 12.1459 3.44676 12.1459 3.44676M12.1459 20C13.5555 18.6083 27.2903 11.4923 23.2633 3.44676C19.3817 -4.30845 12.1459 3.44676 12.1459 3.44676" />
                    </svg>
                </button>
            )}
        </div>
    );
}
