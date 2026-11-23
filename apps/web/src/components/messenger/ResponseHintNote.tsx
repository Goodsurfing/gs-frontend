"use client";

import { useEffect, useState } from "react";

import type { components } from "@goodsurfing/api";

import { browserApi } from "@/lib/browserApi";

type Hint = components["schemas"]["ResponseHint"];

export interface ResponseHintLabels {
    from: string;
    responsive: string;
    period: string;
    hours: string;
    days: string;
    slow: string;
    new: string;
    close: string;
}

/** «за 5 ч» / «за 2 дн.»: до суток — часы, дальше — дни */
export function hintPeriod(hours: number, labels: Pick<ResponseHintLabels, "hours" | "days">): string {
    return hours < 24 ? labels.hours.replace("{{count}}", String(Math.max(1, hours))) : labels.days.replace("{{count}}", String(Math.round(hours / 24)));
}

/** Текст заметки без похожих вакансий */
export function hintText(hint: Hint, labels: ResponseHintLabels): string | null {
    const close = labels.close.replace("{{days}}", String(hint.closeAfterDays));
    if (hint.kind === "new") return `${labels.new} ${close}`;
    if (hint.kind === "slow") return labels.slow;
    if (hint.kind === "responsive") {
        // Срок — только если обычно отвечают в пределах недели: «обычно за 65 дн.» не помогает
        const period = hint.medianReplyHours != null && hint.medianReplyHours <= 7 * 24 ? labels.period.replace("{{period}}", hintPeriod(hint.medianReplyHours, labels)) : "";
        // «за 2 дн.» уже с точкой — вторую не ставим
        const sentence = `${labels.responsive.replace("{{percent}}", String(hint.answeredPercent ?? 0))}${period}`;
        return `${sentence.endsWith(".") ? sentence : `${sentence}.`} ${close}`;
    }
    return null;
}

/**
 * Заметка волонтёру под заявкой (GS-247): как обычно отвечает организатор и что будет без ответа;
 * если отвечает редко — три похожие вакансии. Видит только волонтёр, в переписку не пишется.
 * Не загрузилась — ничего не показываем (это подсказка, не содержание переписки).
 */
export function ResponseHintNote({ applicationId, token, offerHref, labels }: {
    applicationId: string;
    token: string | undefined;
    /** Шаблон ссылки на вакансию с {id} */
    offerHref: string;
    labels: ResponseHintLabels;
}) {
    const [hint, setHint] = useState<Hint | null>(null);

    useEffect(() => {
        let cancelled = false;
        browserApi(token)
            .GET("/api/v1/application/{id}/response-hint", { params: { path: { id: applicationId } } })
            .then(({ data }) => !cancelled && setHint(data ?? null))
            .catch(() => undefined);
        return () => {
            cancelled = true;
        };
    }, [applicationId, token]);

    const text = hint ? hintText(hint, labels) : null;
    if (!hint || !text) return null;
    return (
        <aside aria-label={labels.from} className="mx-auto my-3 w-full max-w-[460px] rounded-[12px] bg-white/80 px-4 py-3 text-center text-[13px] leading-[140%] text-ink-tertiary shadow-[0_1px_2px_rgba(14,29,39,0.06)]">
            <p className="mb-1 text-[12px] font-semibold text-caption">{labels.from}</p>
            <p>{text}</p>
            {hint.kind === "slow" && (
                <>
                    {hint.similar.length > 0 && (
                        <ul className="mt-2 flex flex-col gap-1 text-left">
                            {hint.similar.map((item) => (
                                <li key={item.id}>
                                    <a href={offerHref.replace("{id}", String(item.id))} className="text-primary no-underline hover:underline">{item.title}</a>
                                    {item.place && <span className="text-caption"> · {item.place}</span>}
                                </li>
                            ))}
                        </ul>
                    )}
                    <p className="mt-2">{labels.close.replace("{{days}}", String(hint.closeAfterDays))}</p>
                </>
            )}
        </aside>
    );
}
