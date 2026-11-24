"use client";

import { useState } from "react";

import { ConfirmDialog } from "@/components/ui/ConfirmDialog";

/** Решение организатора по заявке (PATCH application_forms/{id}/status) */
export type Decision = "accepted" | "canceled";

export interface DecisionLabels {
    accept: string;
    decline: string;
    /** «Отклонить заявку? Волонтёр получит уведомление» */
    declineConfirm: string;
    cancel: string;
}

/**
 * Что делать по нажатию: отказ — только после подтверждения (24.11.2026 организатор
 * нажала «Отклонить» вместо «Принять» и не смогла вернуть), принятие — сразу.
 */
export function decisionStep(decision: Decision): "confirm" | "send" {
    return decision === "canceled" ? "confirm" : "send";
}

/**
 * Кнопки решения по заявке — везде одинаково: «Принять» первой и главной
 * (зелёная cta), «Отклонить» второй и второстепенной (рамкой). Отказ — через
 * окно подтверждения. current — нынешнее решение: его кнопка неактивна.
 * Подписи не трогает переводчик браузера (translate="no", notranslate — для
 * Google): перевод путал «Принять» и «Отклонить».
 */
export function DecisionButtons({ current, busy = false, onDecision, labels, className = "" }: {
    current?: Decision;
    busy?: boolean;
    onDecision: (decision: Decision) => void;
    labels: DecisionLabels;
    className?: string;
}) {
    const [confirming, setConfirming] = useState(false);
    const press = (decision: Decision) => {
        if (decisionStep(decision) === "confirm") setConfirming(true);
        else onDecision(decision);
    };
    return (
        <>
            <div className={`flex gap-2 ${className}`} data-testid="decision-buttons">
                <button
                    type="button"
                    translate="no"
                    disabled={busy || current === "accepted"}
                    onClick={() => press("accepted")}
                    className="notranslate h-9 flex-1 cursor-pointer rounded-full border-0 bg-cta px-5 text-[14px] font-semibold whitespace-nowrap text-white transition-colors hover:bg-cta-hover disabled:cursor-default disabled:opacity-50"
                >
                    {labels.accept}
                </button>
                <button
                    type="button"
                    translate="no"
                    disabled={busy || current === "canceled"}
                    onClick={() => press("canceled")}
                    className="notranslate h-9 flex-1 cursor-pointer rounded-full border border-accent-bg bg-white px-4 text-[14px] font-medium whitespace-nowrap text-ink-tertiary transition-colors hover:border-error hover:text-error disabled:cursor-default disabled:opacity-50"
                >
                    {labels.decline}
                </button>
            </div>
            <ConfirmDialog
                open={confirming}
                text={labels.declineConfirm}
                confirm={labels.decline}
                cancel={labels.cancel}
                busy={busy}
                noTranslate
                onConfirm={() => {
                    setConfirming(false);
                    onDecision("canceled");
                }}
                onClose={() => setConfirming(false)}
            />
        </>
    );
}
