"use client";

import { useState } from "react";

/**
 * Значки членства рядом с именем (MembershipVerifiedBadge + MembershipBadge
 * старого фронта): зелёная галочка с подсказкой «Верифицированный
 * пользователь…» (по наведению и по тапу) и плашка «Партнёр Гудсёрфинга» /
 * «Член сообщества».
 */
export function MembershipBadges({ badge, labels, membershipHref, only }: {
    badge: string;
    labels: { verified: string; howTo: string };
    membershipHref: string;
    /** У волонтёра галочка и плашка стоят в разных строках */
    only?: "verified" | "badge";
}) {
    const [open, setOpen] = useState(false);
    return (
        <>
            {only !== "badge" && <span className="relative inline-flex shrink-0" onMouseEnter={() => setOpen(true)} onMouseLeave={() => setOpen(false)}>
                <button type="button" aria-expanded={open} aria-label={labels.verified} onClick={() => setOpen((value) => !value)} className="ml-2 inline-flex cursor-pointer align-middle">
                    {/* eslint-disable-next-line @next/next/no-img-element -- иконка */}
                    <img src="/web/icons/offer/select-check.svg" alt="member" className="h-8 w-8 shrink-0" />
                </button>
                {open && (
                    <span role="tooltip" className="absolute top-full left-1/2 z-20 mt-1 w-[300px] -translate-x-1/2 rounded-[4px] bg-[rgba(97,97,97,0.92)] px-2 py-1 text-[11px] leading-[1.4em] font-medium text-white">
                        {labels.verified}{" "}
                        <a href={membershipHref} className="text-inherit underline">{labels.howTo}</a>
                    </span>
                )}
            </span>}
            {only !== "verified" && <span className="ml-2 inline-flex shrink-0 items-center rounded-[8px] bg-cta px-2 py-0.5 align-middle text-[11px] font-semibold whitespace-nowrap text-white">{badge}</span>}
        </>
    );
}

/** Участник Международного клуба — синяя плашка рядом с «Член сообщества» (как в старом фронте) */
export function InternationalBadge({ label }: { label: string }) {
    return <span className="ml-2 inline-flex shrink-0 items-center rounded-[8px] bg-primary px-2 py-0.5 align-middle text-[11px] font-semibold whitespace-nowrap text-white">{label}</span>;
}
