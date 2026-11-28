"use client";

import { useEffect, useRef } from "react";

export interface ApplyMembershipLabels {
    title: string;
    /** Кончились бесплатные отклики */
    limit: string;
    /** Вакансия только для участников с членством */
    verified: string;
    /** «Заполненное сохранится, после оформления вернём сюда» */
    saved: string;
    cta: string;
    /** Над формой, когда черновик восстановлен */
    restored: string;
}

/**
 * Отклик не ушёл, потому что нужно членство (GS-341): вместо строки ошибки под
 * кнопкой — понятный блок с объяснением и кнопкой «Оформить членство». Раньше
 * человек видел английский текст ошибки, а предложение членства в начале
 * страницы уже закрыл. Без цен — членство это участие в сообществе НКО.
 */
export function ApplyMembershipPanel({ reason, href, onGo, labels }: {
    reason: "limit" | "verified";
    href: string;
    /** Перед уходом: запомнить, к какому отклику вернуть после оплаты */
    onGo: () => void;
    labels: ApplyMembershipLabels;
}) {
    const box = useRef<HTMLElement>(null);
    // Блок появляется у кнопки внизу формы — на телефоне докручиваем, чтобы его было видно целиком
    useEffect(() => {
        box.current?.scrollIntoView?.({ block: "nearest", behavior: "smooth" });
    }, [reason]);
    return (
        <section
            ref={box}
            role="alert"
            aria-label={labels.title}
            className="flex flex-col gap-2.5 rounded-[14px] border border-cta/50 bg-white p-4 text-[15px] leading-[140%] text-ink"
        >
            <h3 className="m-0 text-[17px] font-semibold text-ink">{labels.title}</h3>
            <p className="m-0 text-ink-secondary">{reason === "limit" ? labels.limit : labels.verified}</p>
            <p className="m-0 text-[14px] text-caption">{labels.saved}</p>
            <a
                href={href}
                onClick={onGo}
                className="mt-1 flex min-h-[48px] items-center justify-center rounded-[10px] border border-cta bg-cta px-6 text-center text-[16px] font-semibold text-white no-underline transition-opacity hover:border-cta-hover hover:bg-cta-hover"
            >
                {labels.cta}
            </a>
        </section>
    );
}

/** Над формой: черновик отклика восстановлен — проверить и отправить */
export function ApplyRestoredNote({ text }: { text: string }) {
    return (
        <p role="status" className="m-0 rounded-[10px] bg-m-cta-soft px-4 py-3 text-[14px] leading-[140%] text-ink">
            {text}
        </p>
    );
}
