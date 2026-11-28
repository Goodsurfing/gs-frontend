"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { useId, useState } from "react";

import { useSession } from "@/components/session/SessionProvider";
import { API_URL } from "@/lib/browserApi";
import { COMMENT_MAX, complaintErrorText, REPORT_REASONS, type ReportLabels, type ReportReason, type ReportTarget } from "@/lib/report";

/** Отправить жалобу; ok — принята, иначе текст ошибки */
export async function sendComplaint(token: string | undefined, target: ReportTarget, reason: ReportReason, comment: string, labels: Pick<ReportLabels, "error" | "tooMany">): Promise<{ ok: true } | { ok: false; error: string }> {
    try {
        const response = await fetch(`${API_URL}/api/v1/complaints`, {
            method: "POST",
            credentials: "include",
            headers: { "Content-Type": "application/json", Accept: "application/json", ...(token ? { Authorization: `Bearer ${token}` } : {}) },
            body: JSON.stringify({ targetType: target.type, targetId: target.id, reason, comment: comment.trim() || null }),
            signal: AbortSignal.timeout(20_000),
        });
        if (response.ok) return { ok: true };
        const body: unknown = await response.json().catch(() => null);
        return { ok: false, error: complaintErrorText(response.status, body, labels) };
    } catch {
        return { ok: false, error: labels.error };
    }
}

/**
 * Окно «Пожаловаться» (GS-282): причина (спам, оскорбления, мошенничество, другое) и комментарий.
 * target = null — окно закрыто. onSent — жалоба принята (страница показывает «Жалоба отправлена…»).
 */
export function ReportDialog({ target, title, labels, onClose, onSent }: {
    target: ReportTarget | null;
    /** Заголовок: «Пожаловаться на сообщение» и т. п.; по умолчанию — «Пожаловаться» */
    title?: string;
    labels: ReportLabels;
    onClose: () => void;
    onSent: () => void;
}) {
    const session = useSession();
    const [reason, setReason] = useState<ReportReason | null>(null);
    const [comment, setComment] = useState("");
    const [busy, setBusy] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const commentId = useId();
    const errorId = useId();

    const close = () => {
        if (busy) return;
        setReason(null);
        setComment("");
        setError(null);
        onClose();
    };

    const submit = async () => {
        if (!target || !reason || busy) return;
        setBusy(true);
        setError(null);
        const result = await sendComplaint(session.token, target, reason, comment, labels);
        setBusy(false);
        if (!result.ok) {
            setError(result.error);
            return;
        }
        setReason(null);
        setComment("");
        onSent();
    };

    return (
        <Dialog.Root open={target !== null} onOpenChange={(value) => !value && close()}>
            <Dialog.Portal>
                <Dialog.Overlay className="fixed inset-0 z-[999] flex animate-fade-in items-center justify-center overflow-y-auto bg-black/50 p-4">
                    <Dialog.Content aria-describedby={undefined} className="flex w-full max-w-[460px] flex-col gap-4 rounded-[10px] bg-white px-5 py-6">
                        <Dialog.Title className="text-[18px] font-medium">{title ?? labels.title}</Dialog.Title>
                        <form
                            className="flex flex-col gap-4"
                            onSubmit={(event) => {
                                event.preventDefault();
                                void submit();
                            }}
                        >
                            <fieldset className="flex flex-col gap-2">
                                <legend className="mb-2 text-[14px] text-caption">{labels.reasonLabel}</legend>
                                {REPORT_REASONS.map((value) => (
                                    <label key={value} className="flex cursor-pointer items-center gap-3 rounded-[8px] border border-accent-bg px-3 py-2.5 text-[15px] has-[:checked]:border-primary">
                                        <input type="radio" name="reason" value={value} checked={reason === value} onChange={() => setReason(value)} className="h-4 w-4 accent-primary" />
                                        {labels.reasons[value]}
                                    </label>
                                ))}
                            </fieldset>
                            <div className="flex flex-col gap-1.5">
                                <label htmlFor={commentId} className="text-[14px] text-caption">{labels.comment}</label>
                                <textarea
                                    id={commentId}
                                    value={comment}
                                    maxLength={COMMENT_MAX}
                                    onChange={(event) => setComment(event.target.value)}
                                    placeholder={labels.commentPlaceholder}
                                    aria-describedby={error ? errorId : undefined}
                                    className="h-[96px] w-full resize-none rounded-[10px] border border-[#82949F] p-3 text-[15px] outline-none focus:border-primary"
                                />
                            </div>
                            {error && <p id={errorId} role="alert" className="text-[14px] text-error">{error}</p>}
                            <div className="flex flex-wrap justify-end gap-3">
                                <button type="button" onClick={close} disabled={busy} className="cursor-pointer rounded-[10px] border border-primary px-6 py-2.5 text-[15px] text-primary transition-all hover:bg-primary hover:text-white disabled:opacity-70">
                                    {labels.cancel}
                                </button>
                                <button type="submit" disabled={!reason || busy} className="cursor-pointer rounded-[10px] border border-primary bg-primary px-6 py-2.5 text-[15px] text-white transition-all hover:bg-white hover:text-primary disabled:cursor-default disabled:opacity-60 disabled:hover:bg-primary disabled:hover:text-white">
                                    {labels.send}
                                </button>
                            </div>
                        </form>
                    </Dialog.Content>
                </Dialog.Overlay>
            </Dialog.Portal>
        </Dialog.Root>
    );
}
