"use client";

import { useEffect, useState } from "react";

import { activeMembership, useSession } from "@/components/session/SessionProvider";

/** Что оплачивать: волонтёру — его тариф, организатору — тариф организатора */
export interface CtaOption {
    href: string;
    /** «Оформить за 990 ₽» — уже с ценой */
    button: string;
    /** Подпись полосы внизу экрана — уже с ценой */
    stickyTitle: string;
}

const useCta = (volunteer: CtaOption, host: CtaOption) => {
    const session = useSession();
    const isHost = !!(session.profile as { hostId?: string | null } | null)?.hostId;
    const isMember = session.status === "user" && !!activeMembership(session.memberships, "REGULAR");
    return { option: isHost ? host : volunteer, isMember };
};

const greenButton = "inline-flex items-center justify-center rounded-lg border border-cta bg-cta px-7 py-3 text-[1rem] font-semibold text-white no-underline transition-all duration-300 hover:bg-white hover:text-cta";

/**
 * Главная кнопка шапки «Членства»: сразу к оплате и с ценой — раньше это был
 * якорь к тарифам, и с телефона до оплаты доходил 1 из 35 (05.11.2026).
 * Гостю /payment сам предложит войти и вернёт к тарифу. С действующим членством —
 * как раньше, к тарифам (продлить или посмотреть).
 */
export function MembershipHeroCta({ volunteer, host, fallback, note }: {
    volunteer: CtaOption;
    host: CtaOption;
    /** «Получить членство» — для тех, у кого членство уже есть */
    fallback: string;
    /** Одна строка под кнопкой: что будет после оплаты */
    note: string;
}) {
    const { option, isMember } = useCta(volunteer, host);
    if (isMember) return <a href="#tariffs" className={`${greenButton} down-sm:text-center`}>{fallback}</a>;
    return (
        <div className="flex flex-col gap-2 down-sm:items-stretch">
            <a href={option.href} className={`${greenButton} down-sm:text-center`}>{option.button}</a>
            <p className="max-w-[340px] text-[0.875rem] leading-[1.4] text-white/85 down-sm:max-w-none down-sm:text-center">{note}</p>
        </div>
    );
}

/**
 * Полоса «Членство · 990 ₽/год — Оформить» внизу экрана на телефоне (до 768 px).
 * Появляется, когда тарифы уехали вверх: после них ещё ~10 экранов, и кто
 * дочитывал, к кнопке оплаты уже не возвращался. С членством — не показываем.
 */
export function MembershipStickyBar({ volunteer, host, button, afterId }: {
    volunteer: CtaOption;
    host: CtaOption;
    /** «Оформить» */
    button: string;
    /** id блока тарифов, после которого появляется полоса */
    afterId: string;
}) {
    const { option, isMember } = useCta(volunteer, host);
    const [shown, setShown] = useState(false);
    useEffect(() => {
        const update = () => {
            const block = document.getElementById(afterId);
            setShown(!!block && block.getBoundingClientRect().bottom < 0);
        };
        update();
        window.addEventListener("scroll", update, { passive: true });
        return () => window.removeEventListener("scroll", update);
    }, [afterId]);
    if (isMember) return null;
    return (
        <div
            aria-hidden={!shown}
            className={`fixed inset-x-0 bottom-0 z-40 hidden items-center gap-3 border-t border-accent-bg bg-white/95 px-4 pt-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] shadow-[0_-4px_16px_rgba(0,0,0,0.08)] transition-transform duration-300 down-md:flex ${shown ? "translate-y-0" : "translate-y-full"}`}
        >
            <p className="min-w-0 flex-1 text-[0.9375rem] leading-[1.3] font-semibold text-[#212121]">{option.stickyTitle}</p>
            <a href={option.href} tabIndex={shown ? 0 : -1} className="inline-flex shrink-0 items-center justify-center rounded-[10px] border border-cta bg-cta px-6 py-3 text-[1rem] leading-[120%] text-white no-underline">{button}</a>
        </div>
    );
}

/** Длинный текст на телефоне — 3 строки и «Читать дальше»; на компьютере целиком */
export function ReadMore({ more, children }: { more: string; children: React.ReactNode }) {
    const [open, setOpen] = useState(false);
    return (
        <>
            <div className={open ? "" : "down-md:line-clamp-3"}>{children}</div>
            {!open && (
                <button type="button" onClick={() => setOpen(true)} className="mb-4 hidden cursor-pointer text-[1rem] font-semibold text-primary underline down-md:block">
                    {more}
                </button>
            )}
        </>
    );
}
