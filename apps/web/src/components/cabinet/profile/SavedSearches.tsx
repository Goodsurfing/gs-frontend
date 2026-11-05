"use client";

import { useEffect, useState } from "react";

import { useSession } from "@/components/session/SessionProvider";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { Spinner } from "@/components/ui/Spinner";
import { Toast } from "@/components/ui/Toast";
import { browserApi } from "@/lib/browserApi";

interface Search {
    id: string;
    name: string;
    siteQuery: string;
    emailFrequency: "weekly" | "daily" | "off";
    pushEnabled: boolean;
}

export interface SavedSearchesLabels {
    intro: string;
    empty: string;
    toMap: string;
    name: string;
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
}

const field = "rounded-[8px] border border-[#e0e0e0] bg-white px-3 py-2 text-[15px] outline-none focus:border-primary";

/** «Мои подписки»: подписки на подборку вакансий — название, как часто на почту, пуши, открыть поиск, удалить */
export function SavedSearches({ mapHref, labels }: { mapHref: string; labels: SavedSearchesLabels }) {
    const session = useSession();
    const [items, setItems] = useState<Search[] | null>(null);
    const [failed, setFailed] = useState(false);
    const [attempt, setAttempt] = useState(0);
    const [toast, setToast] = useState<{ text: string; ok: boolean } | null>(null);
    const [toDelete, setToDelete] = useState<Search | null>(null);

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
        browserApi(session.token).PATCH("/api/v1/saved-searches/{id}", { params: { path: { id: item.id } }, body: body as never })
            .then(({ data, error }) => {
                if (error || !data) throw new Error();
                setItems((list) => list?.map((s) => (s.id === item.id ? (data as Search) : s)) ?? null);
                setToast({ text: labels.saved, ok: true });
            })
            .catch(() => setToast({ text: labels.error, ok: false }));
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
        <div className="mt-4">
            <p className="mb-5 text-[15px] text-[#424242]">{labels.intro}</p>
            {items.length === 0 && (
                <div className="rounded-xl bg-field p-6">
                    <p className="mb-3">{labels.empty}</p>
                    <a href={mapHref} className="text-primary underline">{labels.toMap}</a>
                </div>
            )}
            <ul className="flex flex-col gap-4">
                {items.map((item) => (
                    <li key={item.id} className="flex flex-col gap-3 rounded-xl border border-[#e0e0e0] p-4">
                        <label className="flex flex-col gap-1 text-[13px] text-[#6b7280]">
                            {labels.name}
                            <input
                                className={field}
                                defaultValue={item.name}
                                maxLength={120}
                                onBlur={(e) => {
                                    const name = e.currentTarget.value.trim();
                                    if (name && name !== item.name) patch(item, { name });
                                }}
                            />
                        </label>
                        <div className="flex flex-wrap items-end gap-4">
                            <label className="flex flex-col gap-1 text-[13px] text-[#6b7280]">
                                {labels.email}
                                <select className={field} value={item.emailFrequency} onChange={(e) => patch(item, { emailFrequency: e.currentTarget.value as Search["emailFrequency"] })}>
                                    <option value="weekly">{labels.weekly}</option>
                                    <option value="daily">{labels.daily}</option>
                                    <option value="off">{labels.off}</option>
                                </select>
                            </label>
                            <label className="flex items-center gap-2 pb-2 text-[15px]">
                                <input type="checkbox" checked={item.pushEnabled} onChange={(e) => patch(item, { pushEnabled: e.currentTarget.checked })} className="h-4 w-4" />
                                {labels.push}
                            </label>
                        </div>
                        <div className="flex flex-wrap gap-4 text-[15px]">
                            <a href={item.siteQuery ? `${mapHref}?${item.siteQuery}` : mapHref} className="text-primary underline">{labels.open}</a>
                            <button type="button" className="cursor-pointer text-error underline" onClick={() => setToDelete(item)}>{labels.delete}</button>
                        </div>
                    </li>
                ))}
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
