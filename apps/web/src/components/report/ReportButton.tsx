"use client";

import { useState } from "react";

import { useSession } from "@/components/session/SessionProvider";
import { Toast } from "@/components/ui/Toast";
import type { ReportTarget } from "@/lib/report";

import { useReportLabels } from "./ReportContext";
import { ReportDialog } from "./ReportDialog";

/**
 * Ссылка «Пожаловаться» с окном жалобы (GS-282) — у отзывов и на профилях. Только вошедшему и не
 * на своё (authorId — автор отзыва или владелец профиля); страница общая для всех — решается в браузере.
 */
export function ReportButton({ target, authorId, title, className = "" }: {
    target: ReportTarget;
    authorId?: string | null;
    /** Заголовок окна и подпись для чтения с экрана */
    title?: string;
    className?: string;
}) {
    const labels = useReportLabels();
    const session = useSession();
    const [open, setOpen] = useState(false);
    const [toast, setToast] = useState<string | null>(null);
    if (!labels || session.status !== "user" || (authorId && session.profile?.id === authorId)) return null;
    const heading = title ?? (target.type === "review" ? labels.reportReview : target.type === "message" ? labels.reportMessage : labels.reportUser);
    return (
        <>
            <button
                type="button"
                onClick={() => setOpen(true)}
                aria-label={heading}
                className={`cursor-pointer border-0 bg-transparent p-0 text-[13px] text-caption underline decoration-dotted underline-offset-2 hover:text-primary ${className}`}
            >
                {labels.report}
            </button>
            <ReportDialog target={open ? target : null} title={heading} labels={labels} onClose={() => setOpen(false)} onSent={() => {
                setOpen(false);
                setToast(labels.sent);
            }} />
            <Toast text={toast} ok onClose={() => setToast(null)} />
        </>
    );
}
