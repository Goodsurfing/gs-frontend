"use client";

import { useState } from "react";

import { Avatar } from "@/components/ui/Avatar";
import type { Locale } from "@/i18n/config";
import { type ChatApplication, formatDateRange, statusChip } from "@/lib/messenger";

import { type StatusLabels, StatusBadge } from "./StatusBadge";

export interface ChatHeaderLabels {
    back: string;
    info: string;
    statuses: StatusLabels;
    decisionPrompt: string;
    accept: string;
    decline: string;
}

/**
 * Шапка переписки (как в Worldpackers): собеседник, вакансия с датами и
 * статус заявки — видно, о чём разговор, не листая вверх. Организатору у
 * новой заявки — полоса «Принять / Отклонить» под шапкой.
 */
export function ChatHeader({ locale, name, avatar, profileHref, application, viewerIsVolunteer, offerHref, infoOpen, onInfo, onBack, onDecision, labels }: {
    locale: Locale;
    name: string;
    avatar?: string;
    profileHref?: string;
    application: ChatApplication | null;
    viewerIsVolunteer: boolean;
    offerHref?: string;
    infoOpen: boolean;
    onInfo?: () => void;
    onBack: () => void;
    onDecision?: (status: "accepted" | "canceled") => Promise<boolean>;
    labels: ChatHeaderLabels;
}) {
    const [busy, setBusy] = useState(false);
    const chip = statusChip(application?.status, viewerIsVolunteer);
    const dates = formatDateRange(locale, application?.startDate, application?.endDate);
    const canDecide = !!onDecision && !viewerIsVolunteer && application?.status === "new";

    const decide = async (status: "accepted" | "canceled") => {
        if (!onDecision) return;
        setBusy(true);
        await onDecision(status);
        setBusy(false);
    };

    const nameNode = <span className="truncate text-[16px] font-semibold text-ink">{name}</span>;
    return (
        <div className="shrink-0 border-b border-accent-bg bg-white">
            <div className="flex items-center gap-3 px-4 py-3">
                <button type="button" aria-label={labels.back} onClick={onBack} className="-ml-1 hidden h-9 w-9 shrink-0 cursor-pointer items-center justify-center rounded-full border-0 bg-transparent p-0 hover:bg-field down-lg:flex">
                    {/* eslint-disable-next-line @next/next/no-img-element -- стрелка назад */}
                    <img src="/web/icons/messenger/arrow.svg" alt="" className="h-5 w-5" />
                </button>
                {profileHref ? <a href={profileHref} aria-hidden tabIndex={-1}><Avatar src={avatar} name={name} size={40} /></a> : <Avatar src={avatar} name={name} size={40} />}
                <div className="flex min-w-0 flex-1 flex-col gap-0.5">
                    {profileHref ? <a href={profileHref} className="flex min-w-0 text-inherit no-underline hover:underline">{nameNode}</a> : nameNode}
                    {(chip || application?.vacancyTitle) && (
                        <div className="flex min-w-0 items-center gap-2 text-[12px] text-caption">
                            {chip && <StatusBadge chip={chip} labels={labels.statuses} />}
                            {application?.vacancyTitle && (offerHref
                                ? <a href={offerHref} className="min-w-0 truncate text-caption no-underline hover:text-primary hover:underline">{application.vacancyTitle}</a>
                                : <span className="min-w-0 truncate">{application.vacancyTitle}</span>)}
                            {dates && <span className="shrink-0 down-sm:hidden">· {dates}</span>}
                        </div>
                    )}
                </div>
                {onInfo && (
                    <button
                        type="button"
                        aria-label={labels.info}
                        aria-expanded={infoOpen}
                        onClick={onInfo}
                        className={`flex h-9 w-9 shrink-0 cursor-pointer items-center justify-center rounded-full border-0 p-0 transition-colors ${infoOpen ? "bg-primary text-white" : "bg-transparent text-caption hover:bg-field"}`}
                    >
                        <svg viewBox="0 0 24 24" aria-hidden className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="9.5" /><path d="M12 11v6M12 7.5v.01" /></svg>
                    </button>
                )}
            </div>
            {canDecide && (
                <div className="flex items-center gap-3 border-t border-field bg-status-new/10 px-4 py-2.5 down-sm:flex-col down-sm:items-stretch">
                    <span className="min-w-0 flex-1 text-[13px] text-ink-secondary">
                        {labels.decisionPrompt}
                        {dates && <span className="hidden text-caption down-sm:inline"> · {dates}</span>}
                    </span>
                    <div className="flex gap-2">
                        <button type="button" disabled={busy} onClick={() => void decide("canceled")} className="h-9 flex-1 cursor-pointer rounded-full border border-accent-bg bg-white px-4 text-[14px] font-medium text-ink-tertiary transition-colors hover:border-error hover:text-error disabled:opacity-60">{labels.decline}</button>
                        <button type="button" disabled={busy} onClick={() => void decide("accepted")} className="h-9 flex-1 cursor-pointer rounded-full border-0 bg-cta px-5 text-[14px] font-semibold text-white transition-colors hover:bg-cta-hover disabled:opacity-60">{labels.accept}</button>
                    </div>
                </div>
            )}
        </div>
    );
}
