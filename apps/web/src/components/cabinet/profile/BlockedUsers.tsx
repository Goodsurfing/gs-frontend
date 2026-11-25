"use client";

import { useState } from "react";

import { useBlocks } from "@/components/report/useBlocks";
import { Avatar } from "@/components/ui/Avatar";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { Toast } from "@/components/ui/Toast";
import type { ReportLabels } from "@/lib/report";

/**
 * «Заблокированные» в настройках профиля (GS-282): кого вошедший заблокировал в переписке,
 * с кнопкой «Разблокировать». Загрузка — заглушки строк, ошибка — «Повторить», пусто — одна строка.
 */
export function BlockedUsers({ volunteerHref, labels }: {
    /** Шаблон адреса профиля с {id} */
    volunteerHref: string;
    labels: Pick<ReportLabels, "blockedTitle" | "blockedHint" | "blockedEmpty" | "blockedError" | "retry" | "blockedSince" | "unblock" | "unblockConfirm" | "unblocked" | "blockError" | "cancel">;
}) {
    const blocks = useBlocks();
    const [confirm, setConfirm] = useState<{ id: string; name: string } | null>(null);
    const [busy, setBusy] = useState(false);
    const [toast, setToast] = useState<{ text: string; ok: boolean } | null>(null);

    const unblock = async () => {
        if (!confirm) return;
        setBusy(true);
        const ok = await blocks.unblock(confirm.id);
        setBusy(false);
        setConfirm(null);
        setToast(ok ? { text: labels.unblocked, ok: true } : { text: labels.blockError, ok: false });
    };

    return (
        <section aria-labelledby="blocked-users-title" className="mt-10 flex max-w-[640px] flex-col gap-3">
            <h3 id="blocked-users-title" className="text-[20px] font-normal">{labels.blockedTitle}</h3>
            <p className="text-[14px] text-caption">{labels.blockedHint}</p>
            {blocks.failed ? (
                <p role="alert" className="flex items-center gap-3 text-[14px]">
                    {labels.blockedError}
                    <button type="button" onClick={blocks.retry} className="cursor-pointer border-0 bg-transparent p-0 text-primary underline">{labels.retry}</button>
                </p>
            ) : blocks.items === null ? (
                <ul aria-busy className="flex flex-col gap-2">
                    {[0, 1].map((i) => <li key={i} aria-hidden className="h-[56px] animate-pulse rounded-[10px] bg-field" />)}
                </ul>
            ) : blocks.items.length === 0 ? (
                <p className="text-[15px]">{labels.blockedEmpty}</p>
            ) : (
                <ul className="flex flex-col gap-2">
                    {blocks.items.map((user) => {
                        const name = `${user.firstName} ${user.lastName}`.trim() || "—";
                        return (
                            <li key={user.id} className="flex items-center gap-3 rounded-[10px] bg-field px-3 py-2">
                                <Avatar src={user.avatar ?? undefined} name={name} size={40} />
                                <div className="flex min-w-0 flex-1 flex-col">
                                    <a href={volunteerHref.replace("{id}", user.id)} className="truncate text-[15px] text-ink-secondary no-underline hover:text-primary">{name}</a>
                                    <span className="text-[12px] text-caption">{labels.blockedSince.replace("{{date}}", user.blockedAt)}</span>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => setConfirm({ id: user.id, name })}
                                    aria-label={`${labels.unblock}: ${name}`}
                                    className="shrink-0 cursor-pointer rounded-[10px] border border-primary bg-white px-4 py-2 text-[14px] text-primary transition-all hover:bg-primary hover:text-white"
                                >
                                    {labels.unblock}
                                </button>
                            </li>
                        );
                    })}
                </ul>
            )}
            <ConfirmDialog
                open={confirm !== null}
                text={labels.unblockConfirm}
                confirm={labels.unblock}
                cancel={labels.cancel}
                busy={busy}
                onConfirm={() => void unblock()}
                onClose={() => setConfirm(null)}
            />
            <Toast text={toast?.text ?? null} ok={toast?.ok} onClose={() => setToast(null)} />
        </section>
    );
}
