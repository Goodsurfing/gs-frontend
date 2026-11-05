"use client";

import { useState } from "react";

import { DateField } from "@/components/offer-wizard/DateField";
import { type OfferListCardLabels, OfferListCard } from "@/components/offers-map/OfferListCard";
import type { Locale } from "@/i18n/config";
import { formatDateRange, formatDay, setArrival, setDeparture, type Terms } from "@/lib/messenger";
import type { CatalogOffer } from "@/lib/offersCatalog";
import { today } from "@/lib/offerWizard";

export interface ApplicationLabels {
    applied: string;
    chooseDates: string;
    chooseDatesLine: string;
    arrival: string;
    departure: string;
    notSet: string;
    submit: string;
    accept: string;
    decline: string;
    card: OfferListCardLabels;
}

/**
 * Заявка на вакансию в переписке (OfferApplication и TermsApplication старого
 * фронта): карточка вакансии и даты участия. Волонтёр при отклике выбирает
 * «Прибытие» и «Отъезд» (не в прошлом) и отправляет галочкой; если у
 * вакансии один период, даты уже подставлены. Отправленная заявка — даты
 * текстом; организатору у новой заявки — «Принять» и «Отклонить».
 */
export function ApplicationBlock({ locale, offer, offerHref, terms, onTerms, sent, username, fixedDates, onSubmit, busy, onDecision, labels }: {
    locale: Locale;
    offer: CatalogOffer;
    offerHref: string;
    terms: Terms;
    onTerms?: (terms: Terms) => void;
    /** Заявка уже отправлена: даты — текстом */
    sent: boolean;
    username: string;
    fixedDates?: boolean;
    onSubmit?: () => void;
    busy?: boolean;
    /** Организатор отвечает на новую заявку */
    onDecision?: (status: "accepted" | "canceled") => void;
    labels: ApplicationLabels;
}) {
    const [decided, setDecided] = useState(false);
    const now = today();
    const line = "flex w-full justify-center text-center text-[0.875rem] font-medium text-primary";

    const decide = (status: "accepted" | "canceled") => {
        setDecided(true);
        onDecision?.(status);
    };

    return (
        <div className="mb-[15px] w-full">
            {sent && <span className={`${line} my-4`}>{username} {labels.applied}</span>}
            {!sent && !fixedDates && <span className={`${line} my-4`}>{labels.chooseDates}</span>}
            <OfferListCard offer={offer} href={offerHref} wide={false} labels={labels.card} showImage={false} />
            {!sent && !fixedDates && <span className={`${line} mt-5`}>{labels.chooseDatesLine}</span>}
            <div className="mt-5 flex flex-wrap items-center gap-5 rounded-[10px] bg-accent-bg px-[30px] py-4 down-xs:p-4">
                <div>
                    <span className="mb-2 flex text-[0.75rem] text-caption">{labels.arrival}</span>
                    {sent
                        ? <p>{terms.start ? formatDay(locale, terms.start) : ""}</p>
                        : <DateField value={terms.start} min={now} onChange={(day) => onTerms?.(setArrival(terms, day))} label={labels.arrival} placeholder={labels.notSet} locale={locale} calendarClass="bottom-full top-auto!" />}
                </div>
                <div>
                    <span className="mb-2 flex text-[0.75rem] text-caption">{labels.departure}</span>
                    <div className="flex items-center gap-5">
                        {sent
                            ? <p>{terms.end ? formatDay(locale, terms.end) : ""}</p>
                            : <DateField value={terms.end} min={terms.start ?? now} onChange={(day) => onTerms?.(setDeparture(terms, day, now))} label={labels.departure} placeholder={labels.notSet} locale={locale} calendarClass="bottom-full top-auto!" />}
                        {!sent && (
                            <button
                                type="button"
                                aria-label={labels.submit}
                                disabled={!terms.start || !terms.end || busy}
                                onClick={onSubmit}
                                className="flex h-11 w-11 cursor-pointer items-center justify-center rounded-full border border-caption bg-white disabled:cursor-default disabled:opacity-60"
                            >
                                <span aria-hidden className="h-5 w-5 bg-caption" style={{ maskImage: "url(/web/icons/messenger/success.svg)", WebkitMaskImage: "url(/web/icons/messenger/success.svg)", maskSize: "contain", maskRepeat: "no-repeat" }} />
                            </button>
                        )}
                    </div>
                </div>
            </div>
            {onDecision && !decided && (
                <div className="mt-5 flex w-full justify-center gap-2.5 down-xs:flex-col">
                    <button type="button" onClick={() => decide("accepted")} className="cursor-pointer rounded-[10px] border border-primary bg-primary px-[30px] py-2 text-[14px] text-white transition-all duration-300 hover:bg-white hover:text-primary">{labels.accept}</button>
                    <button type="button" onClick={() => decide("canceled")} className="cursor-pointer rounded-[10px] border border-caption bg-transparent px-[30px] py-2 text-[14px] text-caption transition-all duration-300 hover:bg-caption hover:text-white">{labels.decline}</button>
                </div>
            )}
        </div>
    );
}

/**
 * Отправленная заявка в переписке — событие посередине ленты (как в
 * Worldpackers): кто подал, на какую вакансию и на какие даты. Решение
 * организатора — в полосе под шапкой, не здесь.
 */
export function ApplicationEvent({ locale, title, offerHref, terms, username, labels }: {
    locale: Locale;
    title: string;
    offerHref: string;
    terms: Terms;
    username: string;
    labels: Pick<ApplicationLabels, "applied" | "card">;
}) {
    const dates = formatDateRange(locale, terms.start, terms.end);
    return (
        <div className="mx-auto my-3 flex w-full max-w-[420px] flex-col items-center gap-0.5 rounded-[14px] border border-accent-bg bg-white px-4 py-3 text-center">
            <span className="text-[12px] text-caption">{username} {labels.applied}</span>
            <a href={offerHref} className="max-w-full truncate text-[15px] font-semibold text-ink no-underline hover:text-primary">{title || labels.card.noTitle}</a>
            {dates && <span className="text-[13px] text-ink-tertiary">{dates}</span>}
        </div>
    );
}
