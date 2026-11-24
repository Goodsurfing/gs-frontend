"use client";

import { type OfferListCardLabels } from "@/components/offers-map/OfferListCard";
import type { Locale } from "@/i18n/config";
import { formatDateRange, type Terms } from "@/lib/messenger";

/** Заявка в переписке: событие в ленте и кнопки решения организатора (форма отклика — ApplyForm) */
export interface ApplicationLabels {
    applied: string;
    accept: string;
    decline: string;
    card: OfferListCardLabels;
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
