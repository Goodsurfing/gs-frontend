"use client";

import { activeMembership, useSession } from "@/components/session/SessionProvider";

import type { CtaOption } from "./MembershipCta";

export interface CompactHeroLabels {
    title: string;
    /** «990 ₽» — уже с ценой */
    volunteerPrice: string;
    hostPrice: string;
    perYear: string;
    /** «На двоих — 1 490 ₽ в год» — уже с ценой; null, если «на двоих» выключен */
    duo: string | null;
    benefits: [string, string, string];
    hostBenefits: [string, string, string];
    button: string;
    note: string;
    /** «Членство уже есть» — для тех, у кого оно действует */
    member: string;
    /** «Членство активно до {{date}}» — дату подставляет браузер */
    memberUntil: string;
    memberLink: string;
    more: string;
}

/**
 * Первый экран «Членства» на телефоне (GS-333): цена за год (и «на двоих»),
 * три главные выгоды и одна зелёная «Оформить». Остальное — ниже, в блоках
 * «Подробнее». Организатору — его тариф и его выгоды, без «на двоих».
 * На компьютере не показывается — там прежняя шапка.
 */
export function MembershipCompactHero({ id, locale, volunteer, host, duoHref, labels }: {
    id: string;
    locale: string;
    volunteer: CtaOption;
    host: CtaOption;
    duoHref: string;
    labels: CompactHeroLabels;
}) {
    const session = useSession();
    const isHost = !!(session.profile as { hostId?: string | null } | null)?.hostId;
    const membership = session.status === "user" ? activeMembership(session.memberships, "REGULAR") : undefined;
    const isMember = !!membership;
    const until = membership?.endDate ? new Date(membership.endDate).toLocaleDateString(locale === "ru" ? "ru-RU" : locale) : "";
    const option = isHost ? host : volunteer;
    const benefits = isHost ? labels.hostBenefits : labels.benefits;

    return (
        <section id={id} aria-labelledby={`${id}-title`} className="hidden bg-white px-5 pt-6 pb-7 down-md:block">
            <h1 id={`${id}-title`} className="mb-4 w-fit bg-[#eea52d] px-2.5 text-[1.375rem] leading-[1.35] font-bold text-white">{labels.title}</h1>
            {/* Членство уже есть — первым крупно «активно до», а не цена (сдача клуба 27.11) */}
            {isMember ? (
                <p role="status" className="mb-1 flex items-center gap-2.5 rounded-[10px] bg-[#e6f9f4] px-4 py-3 text-[1.25rem] leading-[1.3] font-bold text-[#212121]">
                    {/* eslint-disable-next-line @next/next/no-img-element -- иконка */}
                    <img src="/web/images/membership/check.svg" alt="" aria-hidden width={24} height={24} className="shrink-0" />
                    <span>{until ? labels.memberUntil.replace("{{date}}", until) : labels.member}</span>
                </p>
            ) : (
                <p className="mb-1 flex items-baseline gap-2 text-[#212121]">
                    <span className="text-[2rem] leading-[1.2] font-bold whitespace-nowrap">{isHost ? labels.hostPrice : labels.volunteerPrice}</span>
                    <span className="text-[1rem]">{labels.perYear}</span>
                </p>
            )}
            {!isHost && !isMember && labels.duo && (
                <p className="mb-1 text-[0.9375rem] leading-[1.4] text-[#424242]">
                    <a href={duoHref} className="text-primary underline">{labels.duo}</a>
                </p>
            )}
            <ul className="mt-4 mb-5 flex list-none flex-col gap-2.5">
                {benefits.map((benefit) => (
                    <li key={benefit} className="flex items-start gap-2.5 text-[1rem] leading-[1.45] text-[#424242]">
                        {/* eslint-disable-next-line @next/next/no-img-element -- иконка */}
                        <img src="/web/images/membership/check.svg" alt="" aria-hidden width={20} height={20} className="mt-0.5 shrink-0" />
                        <span>{benefit}</span>
                    </li>
                ))}
            </ul>
            {isMember ? (
                <>
                    <p className="mb-3 text-[0.9375rem] leading-[1.4] text-[#424242]">{labels.member}</p>
                    <a href="#tariffs" className="flex w-full items-center justify-center rounded-[10px] border border-cta bg-cta px-6 py-3.5 text-[1.0625rem] font-semibold text-white no-underline">{labels.memberLink}</a>
                </>
            ) : (
                <>
                    <a href={option.href} className="flex w-full items-center justify-center rounded-[10px] border border-cta bg-cta px-6 py-3.5 text-[1.0625rem] font-semibold text-white no-underline">{labels.button}</a>
                    <p className="mt-2 text-center text-[0.875rem] leading-[1.4] text-caption">{labels.note}</p>
                </>
            )}
            <a href="#membership-details" className="mt-5 block text-center text-[0.9375rem] font-semibold text-primary no-underline">{labels.more} ↓</a>
        </section>
    );
}
