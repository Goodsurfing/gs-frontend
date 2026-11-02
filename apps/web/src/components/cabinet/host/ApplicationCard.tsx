"use client";

import type { components } from "@goodsurfing/api";

import { Avatar } from "@/components/ui/Avatar";
import { mediaUrl } from "@/lib/media";

export type Application = components["schemas"]["ListOfOrganizationResult"];
export type ApplicationStatus = "new" | "accepted" | "canceled";

export interface ApplicationCardLabels {
    statuses: Record<ApplicationStatus, string>;
    accept: string;
    reject: string;
    message: string;
    writeReview: string;
    noAddress: string;
    received: string;
    anonymous: string;
    member: string;
    international: string;
}

const BADGE: Record<string, string> = { new: "bg-primary", accepted: "bg-host", canceled: "bg-status-rejected" };
const button = "flex w-full cursor-pointer items-center justify-center rounded-[10px] border p-[7px] text-center text-label transition-all duration-300";

/**
 * Карточка заявки (RequestCard старого фронта): бейдж статуса, волонтёр,
 * даты, вакансия, кнопки по статусу. Новая — «Принять»/«Отклонить»; принятая
 * — «Сообщение» (если есть чат), «Написать отзыв» (если отзыва нет),
 * «Отклонить»; отклонённая — «Принять».
 */
export function ApplicationCard({ application, routes, onStatus, onReview, labels }: {
    application: Application;
    /** Адреса с {id}: волонтёр, вакансия, чат */
    routes: { volunteer: string; offer: string; chat: string };
    onStatus: (status: ApplicationStatus) => void;
    onReview: () => void;
    labels: ApplicationCardLabels;
}) {
    const { volunteer, vacancy } = application;
    const status = application.status as ApplicationStatus;
    const name = `${volunteer.firstName ?? ""} ${volunteer.lastName ?? ""}`.trim() || labels.anonymous;
    const place = volunteer.country && volunteer.city ? `${volunteer.country}, ${volunteer.city}` : volunteer.country || volunteer.city || labels.noAddress;
    const volunteerHref = routes.volunteer.replace("{id}", volunteer.id);
    const link = "inline-block rounded-[10px] whitespace-nowrap text-inherit no-underline transition-all duration-300 ease-in-out";
    return (
        <div className="border border-accent-bg bg-white p-3.5 transition-all duration-300 hover:border-caption">
            <div className="relative flex">
                {labels.statuses[status] && <div className={`absolute top-0 right-0 px-1.5 py-0.5 text-[10px] text-white ${BADGE[status] ?? "bg-primary"}`}>{labels.statuses[status]}</div>}
                <a href={volunteerHref} className={link} aria-hidden tabIndex={-1}>
                    <Avatar src={mediaUrl(volunteer.image, "small")} name={name} size={56} className="bg-accent-bg" />
                </a>
                <a href={volunteerHref} className={link}>
                    <div className="ml-2 flex flex-col">
                        <span className="text-[14px] font-medium text-ink-secondary">
                            {name}
                            {volunteer.isMember && <Badge text={labels.member} />}
                            {volunteer.isInternationalMember && <Badge text={labels.international} international />}
                        </span>
                        <span className="mt-2 text-[12px] text-caption">{place}</span>
                        <span className="mt-2 text-[12px] text-ink-secondary">{application.startDate} - {application.endDate}</span>
                    </div>
                </a>
            </div>
            <div className="mt-2.5 flex flex-col gap-0.5">
                <a href={routes.offer.replace("{id}", String(vacancy.id))} className="text-primary no-underline">{vacancy.title}</a>
                {application.createdAt && <span className="text-[0.75rem] text-primary">{labels.received} {application.createdAt}</span>}
            </div>
            {/* Первый ряд в старом выводился всегда, даже пустой — его 10 px отступа есть у каждой карточки */}
            <div className="mt-2.5 flex gap-2.5 max-[500px]:flex-col">
                {status === "accepted" && !!application.chatId && (
                    <a href={routes.chat.replace("{id}", String(application.chatId))} className={`${button} border-primary text-primary no-underline hover:bg-primary hover:text-white`}>{labels.message}</a>
                )}
                {status === "accepted" && !application.isHasReview && (
                    <button type="button" onClick={onReview} className={`${button} border-primary bg-transparent text-primary hover:bg-primary hover:text-white`}>{labels.writeReview}</button>
                )}
            </div>
            <div className="mt-2.5 flex gap-2.5 max-[500px]:flex-col">
                {(status === "new" || status === "canceled") && (
                    <button type="button" onClick={() => onStatus("accepted")} className={`${button} border-cta bg-cta text-white hover:bg-white hover:text-cta`}>{labels.accept}</button>
                )}
                {(status === "new" || status === "accepted") && (
                    <button type="button" onClick={() => onStatus("canceled")} className={`${button} border-error bg-error text-white hover:bg-white hover:text-error`}>{labels.reject}</button>
                )}
            </div>
        </div>
    );
}

/** Значок членства (MembershipBadge старого фронта) */
function Badge({ text, international = false }: { text: string; international?: boolean }) {
    return <span className={`ml-2 inline-flex items-center rounded-[8px] px-2 py-0.5 align-middle text-[11px] font-semibold whitespace-nowrap text-white ${international ? "bg-primary" : "bg-cta"}`}>{text}</span>;
}
