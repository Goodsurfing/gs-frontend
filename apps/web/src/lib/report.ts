import type { Translate } from "@/i18n/dictionary";

/**
 * «Пожаловаться и заблокировать» (GS-282): подписи (словарь report) и разбор ответов API.
 * Жалоба — POST /api/v1/complaints, блокировка — /api/v1/blocks.
 */

/** violation — «нарушает правила сервиса или закон» (27.11.2026) */
export const REPORT_REASONS = ["spam", "abuse", "fraud", "violation", "other"] as const;
export type ReportReason = (typeof REPORT_REASONS)[number];

/** На что жалоба: сообщение (id — число), пользователь, организация, отзыв (о вакансии или волонтёре) */
export type ReportTarget = { type: "message" | "user" | "organization" | "review"; id: string };

export interface ReportLabels {
    report: string;
    title: string;
    reasonLabel: string;
    reasons: Record<ReportReason, string>;
    comment: string;
    commentPlaceholder: string;
    send: string;
    cancel: string;
    sent: string;
    error: string;
    tooMany: string;
    reportMessage: string;
    reportUser: string;
    reportReview: string;
    block: string;
    unblock: string;
    menu: string;
    blockConfirm: string;
    unblockConfirm: string;
    blocked: string;
    unblocked: string;
    blockError: string;
    recipientBlocked: string;
    recipientBlockedByYou: string;
    blockedTitle: string;
    blockedHint: string;
    blockedEmpty: string;
    blockedError: string;
    retry: string;
    /** «с {{date}}» — дата блокировки в списке */
    blockedSince: string;
}

const KEYS = [
    "report", "title", "reasonLabel", "comment", "commentPlaceholder", "send", "cancel", "sent", "error", "tooMany",
    "reportMessage", "reportUser", "reportReview", "block", "unblock", "menu", "blockConfirm", "unblockConfirm",
    "blocked", "unblocked", "blockError", "recipientBlocked", "recipientBlockedByYou", "blockedTitle", "blockedHint",
    "blockedEmpty", "blockedError", "retry",
] as const;

/** Подписи из словаря report (t = getTranslator(locale, "report")) */
export const reportLabels = (t: Translate): ReportLabels => ({
    ...(Object.fromEntries(KEYS.map((key) => [key, t(key)])) as Record<(typeof KEYS)[number], string>),
    reasons: Object.fromEntries(REPORT_REASONS.map((reason) => [reason, t(`reasons.${reason}`)])) as Record<ReportReason, string>,
    // Подстановка даты — в браузере
    blockedSince: t("blockedSince", { date: "{{date}}" }),
});

export const COMMENT_MAX = 1000;

/** Машинный код ошибки API: errorCode (добавляет бэкенд ко всем ошибкам) или доменный type */
export function errorCode(body: unknown): string | null {
    if (!body || typeof body !== "object") return null;
    const b = body as Record<string, unknown>;
    if (typeof b.errorCode === "string") return b.errorCode;
    if (typeof b.type === "string") return b.type.replace(/^.*\//, "");
    return null;
}

/**
 * Текст ошибки отправки сообщения или отклика, если получатель заблокировал отправителя (или наоборот);
 * null — ошибка другая, показываем общую.
 */
export function blockedSendText(body: unknown, labels: Pick<ReportLabels, "recipientBlocked" | "recipientBlockedByYou">): string | null {
    const code = errorCode(body);
    if (code === "recipient_blocked_by_you") return labels.recipientBlockedByYou;
    if (code === "recipient_blocked") return labels.recipientBlocked;
    return null;
}

/** Текст ошибки жалобы: 429 — свой текст, иначе — что ответил API (по-русски) или общий */
export function complaintErrorText(status: number, body: unknown, labels: Pick<ReportLabels, "error" | "tooMany">): string {
    if (status === 429) return labels.tooMany;
    if (body && typeof body === "object" && typeof (body as { error?: unknown }).error === "string") return (body as { error: string }).error;
    return labels.error;
}
