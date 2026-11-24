"use client";

import { useId, useState } from "react";

import { DateField } from "@/components/offer-wizard/DateField";
import { type OfferListCardLabels, OfferListCard } from "@/components/offers-map/OfferListCard";
import type { Locale } from "@/i18n/config";
import { type ApplyDates, APPLY_MESSAGE_MAX, periodIndex, termsForPeriod } from "@/lib/applyDates";
import { formatDateRange, setArrival, setDeparture, type Terms } from "@/lib/messenger";
import type { CatalogOffer } from "@/lib/offersCatalog";
import { today } from "@/lib/offerWizard";

export interface ApplyFormLabels {
    title: string;
    when: string;
    choosePeriod: string;
    windowHint: string;
    freeHint: string;
    arrival: string;
    departure: string;
    notSet: string;
    about: string;
    optional: string;
    aboutPlaceholder: string;
    aboutHint: string;
    submit: string;
    sending: string;
    needPeriod: string;
    loadError: string;
    retry: string;
    card: OfferListCardLabels;
}

/**
 * Отклик на вакансию (GS-290): карточка вакансии, даты, необязательное «Пару
 * слов о себе» и большая кнопка «Отправить отклик» — раньше была маленькая
 * круглая «✓» без подписи, и из 20 открывших форму 12 не отправляли (неделя
 * 29.10–04.11.2026). Даты — из периодов организатора (lib/applyDates).
 */
export function ApplyForm({ locale, offer, offerHref, dates, terms, onTerms, message, onMessage, onSubmit, busy, error, labels }: {
    locale: Locale;
    offer: CatalogOffer;
    offerHref: string;
    dates: ApplyDates;
    terms: Terms;
    onTerms: (terms: Terms) => void;
    message: string;
    onMessage: (text: string) => void;
    onSubmit: () => void;
    busy: boolean;
    /** Ошибка отправки — под кнопкой, рядом с тем, на что нажали */
    error: string | null;
    labels: ApplyFormLabels;
}) {
    const id = useId();
    const now = today();
    const ready = !!terms.start && !!terms.end;
    const selected = dates.kind === "periods" ? periodIndex(dates.periods, terms) : -1;
    const chosen = dates.kind === "periods" ? dates.periods[selected] : undefined;
    // Окно выбранного периода — границы календаря; без периодов — от сегодня
    const bounds = dates.kind === "free" ? { min: now, max: undefined } : chosen?.window ? { min: chosen.start, max: chosen.end } : null;
    const [touched, setTouched] = useState(false);

    return (
        <form
            aria-label={labels.title}
            className="mx-auto flex w-full max-w-[560px] flex-col gap-5"
            onSubmit={(event) => {
                event.preventDefault();
                setTouched(true);
                if (ready && !busy) onSubmit();
            }}
        >
            <OfferListCard offer={offer} href={offerHref} wide={false} labels={labels.card} showImage={false} />

            <fieldset className="m-0 flex flex-col gap-3 rounded-[14px] border border-accent-bg bg-white p-4">
                <legend className="float-left mb-1 w-full p-0 text-[16px] font-semibold text-ink">{labels.when}</legend>
                {dates.kind === "periods" ? (
                    <>
                        {dates.periods.length > 1 && <p className="text-[14px] text-caption">{labels.choosePeriod}</p>}
                        <div role="radiogroup" aria-label={labels.when} className="flex flex-col gap-2">
                            {dates.periods.map((period, index) => {
                                const checked = index === selected;
                                return (
                                    <label
                                        key={`${period.start}|${period.end}`}
                                        className={`flex min-h-[52px] cursor-pointer items-center gap-3 rounded-[10px] border px-4 py-2.5 text-[15px] transition-colors ${checked ? "border-primary bg-primary/10 text-ink" : "border-accent-bg bg-white text-ink-secondary hover:border-primary/60"}`}
                                    >
                                        <input
                                            type="radio"
                                            name={`${id}-period`}
                                            checked={checked}
                                            onChange={() => onTerms(termsForPeriod(period, dates.minDays))}
                                            className="h-5 w-5 shrink-0 accent-primary"
                                        />
                                        <span className="font-medium">{formatDateRange(locale, period.start, period.end)}</span>
                                    </label>
                                );
                            })}
                        </div>
                        {chosen?.window && <p className="text-[13px] text-caption">{labels.windowHint}</p>}
                    </>
                ) : (
                    <p className="text-[13px] text-caption">{labels.freeHint}</p>
                )}
                {bounds && (
                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <span className="mb-1.5 flex text-[12px] text-caption">{labels.arrival}</span>
                            <DateField value={terms.start} min={bounds.min} max={bounds.max} onChange={(day) => onTerms(setArrival(terms, day))} label={labels.arrival} placeholder={labels.notSet} locale={locale} calendarClass="left-0 z-20" />
                        </div>
                        <div>
                            <span className="mb-1.5 flex text-[12px] text-caption">{labels.departure}</span>
                            <DateField value={terms.end} min={terms.start ?? bounds.min} max={bounds.max} onChange={(day) => onTerms(setDeparture(terms, day, bounds.min))} label={labels.departure} placeholder={labels.notSet} locale={locale} calendarClass="right-0 z-20" />
                        </div>
                    </div>
                )}
            </fieldset>

            <div className="flex flex-col gap-1.5">
                <label htmlFor={`${id}-about`} className="text-[16px] font-semibold text-ink">
                    {labels.about} <span className="text-[13px] font-normal text-caption">({labels.optional})</span>
                </label>
                <textarea
                    id={`${id}-about`}
                    value={message}
                    onChange={(event) => onMessage(event.target.value)}
                    maxLength={APPLY_MESSAGE_MAX}
                    rows={4}
                    placeholder={labels.aboutPlaceholder}
                    aria-describedby={`${id}-about-hint`}
                    className="min-h-[112px] w-full resize-y rounded-[10px] border border-[#82949F] bg-white px-3.5 py-3 text-[16px] leading-[140%] text-ink outline-none placeholder:text-[#9aa7af] focus:border-primary"
                />
                <p id={`${id}-about-hint`} className="flex justify-between gap-3 text-[12px] text-caption">
                    <span>{labels.aboutHint}</span>
                    {message.length > APPLY_MESSAGE_MAX * 0.8 && <span aria-hidden>{message.length}/{APPLY_MESSAGE_MAX}</span>}
                </p>
            </div>

            {/* Кнопка прилипает к низу экрана: на телефоне с несколькими периодами форма длиннее экрана,
                а кнопка отклика должна быть видна сразу */}
            <div className="sticky bottom-0 z-10 -mx-4 flex flex-col gap-1.5 bg-field px-4 pt-3 pb-[max(0.5rem,env(safe-area-inset-bottom))] down-xs:-mx-3 down-xs:px-3">
                <button
                    type="submit"
                    aria-disabled={!ready || busy}
                    aria-busy={busy}
                    className={`flex min-h-[54px] w-full items-center justify-center gap-2.5 rounded-[10px] border border-cta bg-cta px-6 text-[17px] font-semibold text-white transition-colors duration-300 ${ready && !busy ? "cursor-pointer hover:border-cta-hover hover:bg-cta-hover" : "cursor-default opacity-60"}`}
                >
                    {busy && <span aria-hidden className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />}
                    {busy ? labels.sending : labels.submit}
                </button>
                <p role="alert" className="min-h-[18px] text-center text-[13px] leading-[130%] text-error">
                    {error ?? (touched && !ready ? labels.needPeriod : "")}
                </p>
            </div>
        </form>
    );
}

/** Форма отклика, пока грузится вакансия: место под карточку, даты и кнопку — без прыжков */
export function ApplyFormSkeleton() {
    return (
        <div aria-hidden className="mx-auto flex w-full max-w-[560px] flex-col gap-5">
            <span className="h-[120px] animate-pulse rounded-[14px] bg-white" />
            <span className="h-[150px] animate-pulse rounded-[14px] bg-white" />
            <span className="h-[112px] animate-pulse rounded-[10px] bg-white" />
            <span className="h-[54px] animate-pulse rounded-[10px] bg-cta/30" />
        </div>
    );
}

/** Вакансия не загрузилась (обрыв сети) — сказать и дать повторить */
export function ApplyFormError({ text, retry, onRetry }: { text: string; retry: string; onRetry?: () => void }) {
    return (
        <div role="alert" className="mx-auto flex w-full max-w-[560px] flex-col items-center gap-3 rounded-[14px] bg-white p-6 text-center text-[15px] text-ink-secondary">
            <p>{text}</p>
            {onRetry && <button type="button" onClick={onRetry} className="cursor-pointer rounded-[10px] border border-primary px-5 py-2 text-[14px] text-primary hover:bg-primary hover:text-white">{retry}</button>}
        </div>
    );
}
