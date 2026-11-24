"use client";

import { useState } from "react";

import { Avatar } from "@/components/ui/Avatar";
import type { Locale } from "@/i18n/config";
import { type ChatApplication, formatDateRange, statusChip } from "@/lib/messenger";

import { type Decision, DecisionButtons, type DecisionLabels } from "./Decision";
import { type StatusLabels, StatusBadge } from "./StatusBadge";

export interface ChatHeaderLabels extends DecisionLabels {
    back: string;
    info: string;
    statuses: StatusLabels;
    decisionPrompt: string;
    /** «Изменить решение» у принятой или отклонённой заявки */
    change: string;
    changePrompt: string;
}

/**
 * Шапка переписки (как в Worldpackers): собеседник, вакансия с датами и
 * статус заявки — видно, о чём разговор, не листая вверх. Организатору у
 * новой заявки — полоса «Принять / Отклонить» под шапкой; у принятой или
 * отклонённой — «Изменить решение» рядом со статусом, открывает ту же полосу.
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
    onDecision?: (status: Decision) => Promise<boolean>;
    labels: ChatHeaderLabels;
}) {
    const [busy, setBusy] = useState(false);
    const [changing, setChanging] = useState(false);
    // Другая переписка — выбор «Изменить решение» закрыт
    const [shownFor, setShownFor] = useState(application?.id);
    if (shownFor !== application?.id) {
        setShownFor(application?.id);
        setChanging(false);
    }
    const chip = statusChip(application?.status, viewerIsVolunteer);
    const dates = formatDateRange(locale, application?.startDate, application?.endDate);
    const host = !!onDecision && !viewerIsVolunteer;
    const status = application?.status;
    const decided: Decision | undefined = status === "accepted" || status === "canceled" ? status : undefined;
    const canDecide = host && status === "new";
    const canChange = host && !!decided;
    const showBar = canDecide || (canChange && changing);

    const decide = async (next: Decision) => {
        if (!onDecision) return;
        setBusy(true);
        const ok = await onDecision(next);
        setBusy(false);
        if (ok) setChanging(false);
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
                            {canChange && (
                                <button
                                    type="button"
                                    translate="no"
                                    aria-expanded={changing}
                                    onClick={() => setChanging((value) => !value)}
                                    className="notranslate shrink-0 cursor-pointer border-0 bg-transparent p-0 text-[12px] whitespace-nowrap text-primary underline decoration-dotted underline-offset-2 hover:text-primary-hover"
                                >
                                    {labels.change}
                                </button>
                            )}
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
            {showBar && (
                <div className={`flex items-center gap-3 border-t border-field px-4 py-2.5 down-sm:flex-col down-sm:items-stretch ${canDecide ? "bg-status-new/10" : "bg-field"}`}>
                    <span className="min-w-0 flex-1 text-[13px] text-ink-secondary">
                        {canDecide ? labels.decisionPrompt : labels.changePrompt}
                        {dates && <span className="hidden text-caption down-sm:inline"> · {dates}</span>}
                    </span>
                    <DecisionButtons current={decided} busy={busy} onDecision={(next) => void decide(next)} labels={labels} />
                </div>
            )}
        </div>
    );
}
