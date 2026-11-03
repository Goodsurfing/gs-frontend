"use client";

import { type ParticipateLabels, participateText } from "@/lib/offerText";

import { useOfferViewer } from "./OfferViewer";

export interface OfferActionsLabels extends ParticipateLabels {
    edit: string;
    /** Бесплатные отклики кончились: заголовок, цена членства, кнопка */
    upsell: { title: string; text: string; button: string };
}

export interface OfferActionsHrefs {
    signIn: string;
    profileRole: string;
    messenger: string;
    edit: string;
    membership: string;
}

const button = "flex items-center justify-center rounded-[10px] border border-primary px-[50px] py-2.5 text-center text-[16px] leading-[120%] transition-all duration-300";

/**
 * «Участвовать» и «Редактировать» (PersonalCard и OfferSubmenu старого
 * фронта). Гость — на вход с возвратом к вакансии; вошёл без роли
 * волонтёра — на выбор роли; волонтёр — в сообщения, отклик. На закрытую
 * вакансию откликнуться нельзя (GS-230).
 */
export function OfferActions({ offerId, status, variant, hrefs, labels }: {
    offerId: number;
    status: string;
    /** hero — в карточке (светлый текст подсказки), menu — в меню разделов */
    variant: "hero" | "menu";
    hrefs: OfferActionsHrefs;
    labels: OfferActionsLabels;
}) {
    const viewer = useOfferViewer();
    const closed = status !== "active";
    const disabled = closed || (viewer.signedIn && !viewer.needVolunteerRole && !viewer.canParticipate);
    let href = `${hrefs.signIn}?next=offer&nextId=${offerId}`;
    if (viewer.needVolunteerRole) href = `${hrefs.profileRole}?next=${offerId}`;
    else if (viewer.signedIn) href = `${hrefs.messenger}/create/${offerId}`;
    const text = participateText({ closed, needVolunteerRole: viewer.needVolunteerRole, textParticipate: viewer.textParticipate }, labels);

    return (
        <>
            {disabled ? (
                <span aria-disabled className={`${button} bg-primary text-white opacity-70`}>{text}</span>
            ) : (
                <a href={href} className={`${button} bg-primary text-white hover:bg-white hover:text-primary`}>{text}</a>
            )}
            {viewer.requiresMembership && (
                // Бесплатные отклики на год кончились — сразу предложение членства с ценой
                <div role="note" aria-label={labels.upsell.title} className={`flex max-w-[260px] flex-col gap-2 rounded-[10px] p-3.5 text-[13px] leading-[1.3] ${variant === "hero" ? "bg-white/15 text-white" : "bg-accent-bg text-ink"}`}>
                    <p className="font-semibold">{labels.upsell.title}</p>
                    <p>{labels.upsell.text}</p>
                    <a href={hrefs.membership} className="flex items-center justify-center rounded-[10px] border border-cta bg-cta px-4 py-2 text-center text-[14px] text-white no-underline transition-all duration-300 hover:bg-white hover:text-cta">{labels.upsell.button}</a>
                </div>
            )}
            {viewer.canEdit && (
                <a
                    href={hrefs.edit}
                    className={variant === "hero"
                        ? `${button} bg-primary text-white hover:bg-white hover:text-primary`
                        : `${button} w-full max-w-[150px] text-primary hover:bg-primary hover:text-white`}
                >
                    {labels.edit}
                </a>
            )}
        </>
    );
}
