"use client";

import { useState } from "react";

import type { components } from "@goodsurfing/api";

import { Avatar } from "@/components/ui/Avatar";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { mediaUrl } from "@/lib/media";

export type Application = components["schemas"]["ListOfOrganizationResult"];
export type ApplicationStatus = "new" | "accepted" | "canceled";

export interface ApplicationCardLabels {
    statuses: Record<ApplicationStatus, string>;
    accept: string;
    reject: string;
    /** «Отклонить заявку? Волонтёр получит уведомление» */
    rejectConfirm: string;
    cancel: string;
    /** Главная кнопка новой заявки — открывает переписку, где «Принять / Отклонить» */
    reply: string;
    message: string;
    /** Переписка отклонённой заявки */
    openChat: string;
    writeReview: string;
    received: string;
    anonymous: string;
    member: string;
    international: string;
}

const BADGE: Record<ApplicationStatus, string> = { new: "bg-primary/10 text-primary", accepted: "bg-host/15 text-host", canceled: "bg-status-rejected/15 text-error" };
const BUTTON = "notranslate inline-flex min-h-11 cursor-pointer items-center justify-center rounded-[10px] border px-4 text-center text-[15px] font-medium no-underline transition-colors duration-200 disabled:cursor-default disabled:opacity-50";
/** Главная — заливкой */
const PRIMARY = `${BUTTON} flex-1 border-primary bg-primary text-white hover:bg-primary-hover hover:border-primary-hover`;
/** Второстепенная — контуром */
const SECONDARY = `${BUTTON} border-accent-bg bg-white text-ink-tertiary hover:border-error hover:text-error`;
const OUTLINE = `${BUTTON} flex-1 border-primary bg-white text-primary hover:bg-primary hover:text-white`;

/** Какие кнопки у заявки (GS-331, раздел 4.10): главная — «Ответить», отказ — второстепенный и с подтверждением */
export function applicationCardActions(application: Pick<Application, "status" | "chatId" | "isHasReview">): ("reply" | "accept" | "reject" | "message" | "review" | "openChat")[] {
    const chat = !!application.chatId;
    switch (application.status) {
        case "new":
            // Без переписки (очень старые заявки) ответить негде — решение прямо в карточке
            return chat ? ["reply", "reject"] : ["accept", "reject"];
        case "accepted":
            return [...(chat ? ["message" as const] : []), ...(application.isHasReview ? [] : ["review" as const])];
        case "canceled":
            return chat ? ["openChat"] : ["accept"];
        default:
            return [];
    }
}

/**
 * Карточка заявки у организатора: фото и имя волонтёра, вакансия, даты,
 * начало текста отклика (2 строки), статус. Новая — «Ответить» (в переписку,
 * там «Принять / Отклонить») и «Отклонить» контуром через подтверждение.
 */
export function ApplicationCard({ application, routes, onStatus, onReview, labels, headingLevel = 3 }: {
    application: Application;
    /** Адреса с {id}: волонтёр, вакансия, чат */
    routes: { volunteer: string; offer: string; chat: string };
    onStatus: (status: ApplicationStatus) => Promise<void> | void;
    onReview: () => void;
    labels: ApplicationCardLabels;
    headingLevel?: 2 | 3 | 4;
}) {
    const [confirming, setConfirming] = useState(false);
    const [busy, setBusy] = useState(false);
    const { volunteer, vacancy } = application;
    const status = application.status as ApplicationStatus;
    const name = `${volunteer.firstName ?? ""} ${volunteer.lastName ?? ""}`.trim() || labels.anonymous;
    const volunteerHref = routes.volunteer.replace("{id}", volunteer.id);
    const chatHref = application.chatId ? routes.chat.replace("{id}", String(application.chatId)) : "";
    const actions = applicationCardActions(application);
    const achievements = volunteer.achievements ?? [];
    const Heading = `h${headingLevel}` as const;

    const change = async (next: ApplicationStatus) => {
        setBusy(true);
        try {
            await onStatus(next);
        } finally {
            setBusy(false);
        }
    };

    return (
        <article className="flex flex-col gap-3 rounded-[12px] border border-accent-bg bg-white p-4 shadow-[0_2px_10px_rgba(14,29,39,0.04)]" data-testid="application-card">
            <div className="flex items-start gap-3">
                <a href={volunteerHref} aria-hidden tabIndex={-1} className="shrink-0">
                    <Avatar src={mediaUrl(volunteer.image, "small")} name={name} size={48} className="bg-accent-bg" />
                </a>
                <div className="flex min-w-0 flex-1 flex-col gap-0.5">
                    <div className="flex items-start gap-2">
                        <Heading className="m-0 min-w-0 flex-1 text-[16px] leading-[130%] font-semibold text-ink">
                            <a href={volunteerHref} className="text-inherit no-underline hover:underline">{name}</a>
                            {volunteer.isMember && <Badge text={labels.member} />}
                            {volunteer.isInternationalMember && <Badge text={labels.international} international />}
                        </Heading>
                        {labels.statuses[status] && <span className={`shrink-0 rounded-[6px] px-2 py-0.5 text-[12px] font-medium ${BADGE[status] ?? BADGE.new}`}>{labels.statuses[status]}</span>}
                    </div>
                    {vacancy.title && (
                        <a href={routes.offer.replace("{id}", String(vacancy.id))} className="truncate text-[14px] font-medium text-primary no-underline hover:underline">{vacancy.title}</a>
                    )}
                    <span className="text-[13px] text-ink-secondary">{`${application.startDate ?? ""} – ${application.endDate ?? ""}`}</span>
                </div>
            </div>
            {application.messagePreview && (
                // Первые 2 строки текста отклика — решение не «вслепую»
                <p className="m-0 line-clamp-2 text-[14px] leading-[140%] break-words whitespace-pre-line text-ink-secondary" data-testid="application-preview">
                    {application.messagePreview}
                </p>
            )}
            {(achievements.length > 0 || application.createdAt) && (
                <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                    {application.createdAt && <span className="text-[12px] text-caption">{`${labels.received} ${application.createdAt}`}</span>}
                    {achievements.length > 0 && (
                        <span className="flex flex-wrap gap-1" aria-label={achievements.map((a) => a.name).join(", ")}>
                            {achievements.slice(0, 6).map((achievement) => (
                                // eslint-disable-next-line @next/next/no-img-element -- значок из справочника, 20 px
                                <img key={achievement.id} src={achievement.image} alt="" title={achievement.name} width={20} height={20} loading="lazy" className="h-5 w-5" />
                            ))}
                            {achievements.length > 6 && <span className="text-[11px] text-caption">+{achievements.length - 6}</span>}
                        </span>
                    )}
                </div>
            )}
            {actions.length > 0 && (
                <div className="flex gap-2.5">
                    {actions.map((action) => {
                        switch (action) {
                            case "reply":
                                return <a key={action} href={chatHref} translate="no" className={PRIMARY}>{labels.reply}</a>;
                            case "accept":
                                return <button key={action} type="button" translate="no" disabled={busy} onClick={() => void change("accepted")} className={`${PRIMARY} border-cta bg-cta hover:border-cta-hover hover:bg-cta-hover`}>{labels.accept}</button>;
                            case "reject":
                                return <button key={action} type="button" translate="no" disabled={busy} onClick={() => setConfirming(true)} className={SECONDARY}>{labels.reject}</button>;
                            case "message":
                                return <a key={action} href={chatHref} className={OUTLINE}>{labels.message}</a>;
                            case "openChat":
                                return <a key={action} href={chatHref} className={OUTLINE}>{labels.openChat}</a>;
                            case "review":
                                return <button key={action} type="button" onClick={onReview} className={OUTLINE}>{labels.writeReview}</button>;
                            default:
                                return null;
                        }
                    })}
                </div>
            )}
            <ConfirmDialog
                open={confirming}
                text={labels.rejectConfirm}
                confirm={labels.reject}
                cancel={labels.cancel}
                busy={busy}
                noTranslate
                onConfirm={() => {
                    setConfirming(false);
                    void change("canceled");
                }}
                onClose={() => setConfirming(false)}
            />
        </article>
    );
}

/** Значок членства (MembershipBadge старого фронта) */
function Badge({ text, international = false }: { text: string; international?: boolean }) {
    return <span className={`ml-2 inline-flex items-center rounded-[8px] px-2 py-0.5 align-middle text-[11px] font-semibold whitespace-nowrap text-white ${international ? "bg-primary" : "bg-cta"}`}>{text}</span>;
}
