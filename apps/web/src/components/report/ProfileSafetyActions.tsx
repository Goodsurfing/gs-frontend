"use client";

import { useState } from "react";

import { useSession } from "@/components/session/SessionProvider";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { Toast } from "@/components/ui/Toast";
import type { ReportTarget } from "@/lib/report";

import { ReportButton } from "./ReportButton";
import { useReportLabels } from "./ReportContext";
import { useBlocks } from "./useBlocks";

/**
 * «Пожаловаться» и «Заблокировать» на странице волонтёра или организации (GS-282). Страница общая
 * для всех (кэш) — строка дорисовывается в браузере, только вошедшему и не на своей странице.
 * userId — кого блокировать (у организации — владелец).
 */
export function ProfileSafetyActions({ target, userId, className = "" }: { target: ReportTarget; userId: string | null | undefined; className?: string }) {
    const labels = useReportLabels();
    const session = useSession();
    const blocks = useBlocks(!!userId);
    const [confirm, setConfirm] = useState(false);
    const [busy, setBusy] = useState(false);
    const [toast, setToast] = useState<{ text: string; ok: boolean } | null>(null);
    if (!labels || session.status !== "user" || !userId || session.profile?.id === userId) return null;
    const blocked = blocks.isBlocked(userId);

    const toggle = async () => {
        setBusy(true);
        const ok = blocked ? await blocks.unblock(userId) : await blocks.block(userId);
        setBusy(false);
        setConfirm(false);
        setToast(ok ? { text: blocked ? labels.unblocked : labels.blocked, ok: true } : { text: labels.blockError, ok: false });
    };

    const link = "cursor-pointer border-0 bg-transparent p-0 text-[13px] text-caption underline decoration-dotted underline-offset-2 hover:text-primary disabled:cursor-default disabled:opacity-60";
    return (
        <div className={`flex flex-wrap items-center gap-x-4 gap-y-1 ${className}`}>
            <ReportButton target={target} authorId={userId} title={labels.reportUser} />
            {/* Пока не знаем, заблокирован ли, — кнопки нет: иначе она сменит подпись после загрузки */}
            {blocks.items !== null && (
                <button type="button" className={link} disabled={busy} onClick={() => setConfirm(true)}>{blocked ? labels.unblock : labels.block}</button>
            )}
            <ConfirmDialog
                open={confirm}
                text={blocked ? labels.unblockConfirm : labels.blockConfirm}
                confirm={blocked ? labels.unblock : labels.block}
                cancel={labels.cancel}
                busy={busy}
                onConfirm={() => void toggle()}
                onClose={() => setConfirm(false)}
            />
            <Toast text={toast?.text ?? null} ok={toast?.ok} onClose={() => setToast(null)} />
        </div>
    );
}
