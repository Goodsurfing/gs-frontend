"use client";

import type { components } from "@goodsurfing/api";
import { useEffect, useState } from "react";

import { useSession } from "@/components/session/SessionProvider";
import { browserApi } from "@/lib/browserApi";
import { isReminderHidden, reviewLinkHref } from "@/lib/reviewLink";

type Reminder = components["schemas"]["ReviewReminderResult"];

export interface ReviewRemindersLabels {
    title: string;
    text: string;
    rate: string;
    hide: string;
    /** Подпись строки, если у вакансии нет названия или у волонтёра — имени */
    fallback: string;
    departure: string;
}

const hiddenKey = (side: Reminder["side"]) => `gs_review_reminder_hidden_${side}`;

/**
 * Плашка «Оцените» на панели кабинета: завершённые за 90 дней участия без
 * отзыва (GET /api/v1/review-reminder, до трёх строк). «Оценить» ведёт на
 * «Отзывы» и сразу открывает окно отзыва (как звезда в письме «Как всё
 * прошло?»), «Скрыть» убирает плашку на 30 дней.
 */
export function ReviewReminders({ side, reviewHref, labels, className = "" }: {
    side: Reminder["side"];
    /** Страница «Отзывы» кабинета */
    reviewHref: string;
    labels: ReviewRemindersLabels;
    className?: string;
}) {
    const session = useSession();
    const [items, setItems] = useState<Reminder[]>([]);

    useEffect(() => {
        if (session.status !== "user") return;
        if (isReminderHidden(window.localStorage.getItem(hiddenKey(side)), Date.now())) return;
        let cancelled = false;
        void browserApi(session.token).GET("/api/v1/review-reminder")
            .then(({ data }) => !cancelled && setItems(Array.isArray(data) ? data.filter((item) => item.side === side) : []))
            .catch(() => undefined);
        return () => {
            cancelled = true;
        };
    }, [session.status, session.token, side]);

    if (items.length === 0) return null;

    const hide = () => {
        window.localStorage.setItem(hiddenKey(side), String(Date.now()));
        setItems([]);
    };

    return (
        <section aria-label={labels.title} className={`w-full bg-white shadow-[0_5px_20px_rgba(14,29,39,0.05)] ${className}`}>
            <div className="flex items-center justify-between border-b border-caption px-5 py-[13px]">
                <h3 className="text-[1.17em] font-bold">{labels.title}</h3>
                <button type="button" onClick={hide} className="cursor-pointer text-primary">{labels.hide}</button>
            </div>
            <div className="px-5 py-4">
                <p className="text-ink-secondary">{labels.text}</p>
                <ul className="mt-3 flex flex-col gap-2.5">
                    {items.map((item) => (
                        <li key={item.applicationId} className="flex items-center justify-between gap-4 down-sm:flex-wrap down-sm:gap-y-2">
                            <span className="flex min-w-0 flex-col">
                                <span className="overflow-hidden font-medium text-ellipsis whitespace-nowrap text-ink">
                                    {(side === "host" ? item.volunteerName : item.vacancyTitle) || labels.fallback}
                                </span>
                                <span className="text-[12px] text-caption">{`${labels.departure}: ${item.endDate}`}</span>
                            </span>
                            <a
                                href={reviewLinkHref(reviewHref, item)}
                                className="inline-flex shrink-0 items-center justify-center rounded-[10px] border border-cta bg-cta px-6 py-2 text-center text-white no-underline transition-all duration-300 hover:bg-white hover:text-cta"
                            >
                                {labels.rate}
                            </a>
                        </li>
                    ))}
                </ul>
            </div>
        </section>
    );
}
