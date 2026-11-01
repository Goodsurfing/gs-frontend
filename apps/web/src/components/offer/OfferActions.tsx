"use client";

import { type ParticipateLabels, participateText } from "@/lib/offerText";

import { useOfferViewer } from "./OfferViewer";

export interface OfferActionsLabels extends ParticipateLabels {
    edit: string;
    noFreeApplications: string;
    getMembership: string;
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
                <p className={`max-w-[220px] text-[13px] leading-[1.3] ${variant === "hero" ? "text-white" : ""}`}>
                    {labels.noFreeApplications}{" "}
                    <a href={hrefs.membership} className={variant === "hero" ? "text-white underline" : "text-primary"}>{labels.getMembership}</a>
                </p>
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
