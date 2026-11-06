"use client";

import { useEffect, useState } from "react";

import { useSession } from "@/components/session/SessionProvider";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { Spinner } from "@/components/ui/Spinner";
import { Toast } from "@/components/ui/Toast";
import { browserApi } from "@/lib/browserApi";
import { savedSearchSummary, type SummaryLabels } from "@/lib/savedSearchSummary";

interface Search {
    id: string;
    name: string;
    siteQuery: string;
    emailFrequency: "weekly" | "daily" | "off";
    pushEnabled: boolean;
}

export interface SavedSearchesLabels {
    intro: string;
    count: string;
    empty: string;
    toMap: string;
    rename: string;
    save: string;
    email: string;
    weekly: string;
    daily: string;
    off: string;
    push: string;
    open: string;
    delete: string;
    deleteConfirm: string;
    cancel: string;
    saved: string;
    error: string;
    loadError: string;
    retry: string;
    summary: SummaryLabels;
}

/** Не больше подписок на человека — как SavedSearchService::LIMIT на бэкенде */
const LIMIT = 5;
const FREQUENCIES = ["daily", "weekly", "off"] as const;

/**
 * «Мои подписки»: подписки на подборку вакансий. Карточка — название (переименовать по карандашу),
 * о чём подписка (направления, даты и т. д. метками), как часто письма (три кнопки), уведомления
 * (переключатель), «Открыть подборку» и удалить. Переделано по замечанию владельца 06.11.2026:
 * раньше — голое поле названия, системный выпадающий список и мелкие ссылки.
 */
export function SavedSearches({ mapHref, categoryNames, labels }: { mapHref: string; categoryNames: Record<number, string>; labels: SavedSearchesLabels }) {
    const session = useSession();
    const [items, setItems] = useState<Search[] | null>(null);
    const [failed, setFailed] = useState(false);
    const [attempt, setAttempt] = useState(0);
    const [toast, setToast] = useState<{ text: string; ok: boolean } | null>(null);
    const [toDelete, setToDelete] = useState<Search | null>(null);
    const [editing, setEditing] = useState<{ id: string; name: string } | null>(null);

    useEffect(() => {
        if (session.status !== "user") return;
        let cancelled = false;
        browserApi(session.token).GET("/api/v1/saved-searches")
            .then(({ data, error }) => {
                if (cancelled) return;
                if (error || !data) setFailed(true);
                else {
                    setFailed(false);
                    setItems(data as Search[]);
                }
            })
            .catch(() => !cancelled && setFailed(true));
        return () => {
            cancelled = true;
        };
    }, [session.status, session.token, attempt]);

    const patch = (item: Search, body: Partial<Pick<Search, "name" | "emailFrequency" | "pushEnabled">>) => {
        if (session.status !== "user") return;
        // Сразу показываем выбор, при ошибке — вернём как было
        setItems((list) => list?.map((s) => (s.id === item.id ? { ...s, ...body } : s)) ?? null);
        browserApi(session.token).PATCH("/api/v1/saved-searches/{id}", { params: { path: { id: item.id } }, body: body as never })
            .then(({ data, error }) => {
                if (error || !data) throw new Error();
                setItems((list) => list?.map((s) => (s.id === item.id ? (data as Search) : s)) ?? null);
                setToast({ text: labels.saved, ok: true });
            })
            .catch(() => {
                setItems((list) => list?.map((s) => (s.id === item.id ? item : s)) ?? null);
                setToast({ text: labels.error, ok: false });
            });
    };

    const remove = (item: Search) => {
        if (session.status !== "user") return;
        browserApi(session.token).DELETE("/api/v1/saved-searches/{id}", { params: { path: { id: item.id } } })
            .then(({ response }) => {
                if (!response.ok) throw new Error();
                setItems((list) => list?.filter((s) => s.id !== item.id) ?? null);
            })
            .catch(() => setToast({ text: labels.error, ok: false }))
            .finally(() => setToDelete(null));
    };

    const saveName = (item: Search) => {
        const name = editing?.name.trim() ?? "";
        setEditing(null);
        if (name && name !== item.name) patch(item, { name });
    };

    if (failed) {
        return (
            <div className="py-6">
                <p className="mb-3 text-error">{labels.loadError}</p>
                <button type="button" className="cursor-pointer text-primary underline" onClick={() => setAttempt((n) => n + 1)}>{labels.retry}</button>
            </div>
        );
    }
    if (items === null) return <div className="flex justify-center py-10"><Spinner /></div>;

    return (
        <div className="mt-2 max-w-[760px]">
            <p className="text-[15px] leading-[140%] text-ink-tertiary">{labels.intro}</p>
            {items.length > 0 && <p className="mt-1 text-[14px] text-caption">{labels.count.replace("{{count}}", String(items.length)).replace("{{limit}}", String(LIMIT))}</p>}

            {items.length === 0 && (
                <div className="mt-6 flex flex-col items-center gap-4 rounded-[14px] bg-field px-6 py-10 text-center">
                    <span aria-hidden className="flex h-12 w-12 items-center justify-center rounded-full bg-white text-primary">
                        <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M6 8a6 6 0 1 1 12 0c0 7 3 8 3 8H3s3-1 3-8" /><path d="M10.3 20a1.9 1.9 0 0 0 3.4 0" /></svg>
                    </span>
                    <p className="max-w-[440px] text-[15px] leading-[140%]">{labels.empty}</p>
                    <a href={mapHref} className="rounded-[10px] border border-primary bg-primary px-6 py-2.5 text-[15px] text-white no-underline transition-colors hover:bg-white hover:text-primary">{labels.toMap}</a>
                </div>
            )}

            <ul className="mt-5 flex flex-col gap-4">
                {items.map((item) => {
                    // «Все вакансии» под названием «Все вакансии» — повтор, не показываем
                    const chips = savedSearchSummary(item.siteQuery, categoryNames, labels.summary).filter((chip) => chip !== item.name);
                    const isEditing = editing?.id === item.id;
                    return (
                        <li key={item.id} className="rounded-[14px] border border-accent-bg bg-white p-5 shadow-[0_5px_20px_0_rgba(14,29,39,0.05)] down-sm:p-4">
                            <div className="flex flex-wrap items-start justify-between gap-3">
                                <div className="min-w-0 flex-1">
                                    {isEditing ? (
                                        <form className="flex flex-wrap items-center gap-2" onSubmit={(event) => { event.preventDefault(); saveName(item); }}>
                                            <input
                                                autoFocus
                                                aria-label={labels.rename}
                                                value={editing.name}
                                                maxLength={120}
                                                onChange={(event) => setEditing({ id: item.id, name: event.target.value })}
                                                onKeyDown={(event) => event.key === "Escape" && setEditing(null)}
                                                className="min-w-0 flex-1 rounded-[8px] border border-primary px-3 py-1.5 text-[17px] font-semibold outline-none"
                                            />
                                            <button type="submit" className="cursor-pointer rounded-[8px] bg-primary px-3 py-1.5 text-[14px] text-white">{labels.save}</button>
                                            <button type="button" onClick={() => setEditing(null)} className="cursor-pointer px-2 py-1.5 text-[14px] text-caption hover:text-ink">{labels.cancel}</button>
                                        </form>
                                    ) : (
                                        <h3 className="flex items-center gap-2 text-[18px] font-semibold text-ink-secondary">
                                            <span className="truncate">{item.name}</span>
                                            <button type="button" aria-label={labels.rename} title={labels.rename} onClick={() => setEditing({ id: item.id, name: item.name })} className="shrink-0 cursor-pointer rounded-full p-1.5 text-caption transition-colors hover:bg-field hover:text-primary">
                                                <svg aria-hidden viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9" /><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z" /></svg>
                                            </button>
                                        </h3>
                                    )}
                                    {chips.length > 0 && <ul aria-label={item.name} className="mt-2 flex flex-wrap gap-1.5">
                                        {chips.map((chip) => <li key={chip} className="rounded-full bg-field px-2.5 py-1 text-[13px] text-ink-tertiary">{chip}</li>)}
                                    </ul>}
                                </div>
                                <a href={item.siteQuery ? `${mapHref}?${item.siteQuery}` : mapHref} className="shrink-0 rounded-[10px] border border-primary px-4 py-2 text-[14px] font-medium whitespace-nowrap text-primary no-underline transition-colors hover:bg-primary hover:text-white down-sm:w-full down-sm:text-center">
                                    {labels.open}&nbsp;→
                                </a>
                            </div>

                            <div className="mt-4 flex flex-wrap items-center gap-x-8 gap-y-3 border-t border-accent-bg pt-4">
                                <div className="flex flex-wrap items-center gap-3 down-sm:w-full">
                                    <span id={`email-${item.id}`} className="text-[14px] text-caption">{labels.email}</span>
                                    <div role="group" aria-labelledby={`email-${item.id}`} className="inline-flex rounded-[10px] bg-field p-1 down-sm:flex down-sm:w-full">
                                        {FREQUENCIES.map((value) => (
                                            <button
                                                key={value}
                                                type="button"
                                                aria-pressed={item.emailFrequency === value}
                                                onClick={() => item.emailFrequency !== value && patch(item, { emailFrequency: value })}
                                                className={`cursor-pointer rounded-[8px] px-3 py-1.5 text-[14px] whitespace-nowrap transition-colors down-sm:flex-1 down-sm:px-1.5 down-sm:text-[13px] ${item.emailFrequency === value ? "bg-white font-semibold text-ink-secondary shadow-sm" : "text-caption hover:text-ink"}`}
                                            >
                                                {labels[value]}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                                <button
                                    type="button"
                                    role="switch"
                                    aria-checked={item.pushEnabled}
                                    onClick={() => patch(item, { pushEnabled: !item.pushEnabled })}
                                    className="flex cursor-pointer items-center gap-2.5 text-[14px] text-ink-tertiary"
                                >
                                    <span aria-hidden className={`relative h-5 w-9 shrink-0 rounded-full transition-colors ${item.pushEnabled ? "bg-cta" : "bg-caption/50"}`}>
                                        <span className={`absolute top-0.5 h-4 w-4 rounded-full bg-white shadow transition-[left] ${item.pushEnabled ? "left-[18px]" : "left-0.5"}`} />
                                    </span>
                                    {labels.push}
                                </button>
                                <button type="button" onClick={() => setToDelete(item)} className="ml-auto flex cursor-pointer items-center gap-1.5 text-[14px] text-caption transition-colors hover:text-error down-sm:ml-0">
                                    <svg aria-hidden viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18" /><path d="M8 6V4h8v2" /><path d="M6 6l1 14h10l1-14" /></svg>
                                    {labels.delete}
                                </button>
                            </div>
                        </li>
                    );
                })}
            </ul>
            <ConfirmDialog
                open={toDelete !== null}
                text={labels.deleteConfirm.replace("{{name}}", toDelete?.name ?? "")}
                confirm={labels.delete}
                cancel={labels.cancel}
                onConfirm={() => toDelete && remove(toDelete)}
                onClose={() => setToDelete(null)}
            />
            <Toast text={toast?.text ?? null} ok={toast?.ok} onClose={() => setToast(null)} />
        </div>
    );
}
