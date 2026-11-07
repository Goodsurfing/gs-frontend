"use client";

import { useEffect, useState } from "react";

import { useSession } from "@/components/session/SessionProvider";
import { Spinner } from "@/components/ui/Spinner";
import { browserApi } from "@/lib/browserApi";

import { atomDate, type DuoLabels, type DuoState, fill, personName } from "./duo";

const button = "inline-flex cursor-pointer items-center justify-center rounded-[10px] border px-5 py-2.5 text-[15px] leading-[120%] transition-all duration-300 disabled:cursor-default disabled:opacity-60";

/**
 * «Членство на двоих» вошедшего: покупатель видит ссылку для второго участника
 * (скопировать, поделиться, письмом, перевыпустить) или кто присоединился;
 * второй участник — кто его пригласил. Нет «на двоих» — ничего не рисуем.
 * Данные личные, поэтому запрашиваются в браузере (страница общая для всех).
 */
export function DuoPanel({ inviteBase, labels, className = "", onRole }: {
    /** Начало пути приглашения с языком: /membership/duo/ или /en/membership/duo/ — сайт подставляется свой (стейдж или прод) */
    inviteBase: string;
    labels: DuoLabels;
    className?: string;
    /** Роль в «на двоих», как только узнали: null — нет членства на двоих */
    onRole?: (role: DuoState["role"]) => void;
}) {
    const session = useSession();
    const [state, setState] = useState<DuoState | null>(null);
    const [failed, setFailed] = useState(false);
    const [email, setEmail] = useState("");
    const [busy, setBusy] = useState(false);
    const [note, setNote] = useState<{ text: string; ok: boolean } | null>(null);

    useEffect(() => {
        if (session.status !== "user") return;
        let cancelled = false;
        browserApi(session.token).GET("/api/v1/membership/duo")
            .then(({ data, error }) => {
                if (cancelled) return;
                if (error || !data) setFailed(true);
                else {
                    setState(data as DuoState);
                    onRole?.((data as DuoState).role);
                }
            })
            .catch(() => !cancelled && setFailed(true));
        return () => {
            cancelled = true;
        };
    }, [session.status, session.token, onRole]);

    if (session.status !== "user") return null;
    if (failed) return <p className={`text-[14px] text-[#86909a] ${className}`}>{labels["panel-error"]}</p>;
    if (state === null) return <div className={`flex justify-center p-4 ${className}`}><Spinner /></div>;
    if (state.role === null) return null;

    const date = atomDate(state.endDate);
    const box = `rounded-xl border-2 border-[#4CAF50] bg-white p-6 text-left shadow-[0_2px_12px_rgba(0,0,0,0.08)] ${className}`;

    if (state.role === "partner") {
        return (
            <div className={box}>
                <h2 className="mb-2 text-[1.25rem] font-semibold text-[#212121]">{labels["panel-title"]}</h2>
                <p className="text-[0.9375rem] leading-[1.5] text-[#424242]">{fill(labels["panel-partner"], { name: personName(state.person), date })}</p>
            </div>
        );
    }
    if (state.person) {
        return (
            <div className={box}>
                <h2 className="mb-2 text-[1.25rem] font-semibold text-[#212121]">{labels["panel-title"]}</h2>
                <p className="text-[0.9375rem] leading-[1.5] text-[#424242]">{fill(labels["panel-joined"], { name: personName(state.person), date })}</p>
            </div>
        );
    }

    const url = `${window.location.origin}${inviteBase}${state.token ?? ""}`;
    const api = browserApi(session.token);
    const act = (run: () => Promise<{ data?: unknown; error?: unknown }>, ok: (next: DuoState) => string) => {
        setBusy(true);
        setNote(null);
        run()
            .then(({ data, error }) => {
                if (error || !data) {
                    const detail = (error as { detail?: string; email?: string } | undefined);
                    setNote({ text: detail?.email ?? detail?.detail ?? labels["invite-error"], ok: false });
                    return;
                }
                const next = data as DuoState;
                setState(next);
                setNote({ text: ok(next), ok: true });
            })
            .catch(() => setNote({ text: labels["invite-error"], ok: false }))
            .finally(() => setBusy(false));
    };
    const copy = () => {
        void navigator.clipboard?.writeText(url)
            .then(() => setNote({ text: labels["panel-copied"], ok: true }))
            .catch(() => setNote({ text: url, ok: true }));
    };
    const canShare = typeof navigator !== "undefined" && typeof navigator.share === "function";

    return (
        <div className={box}>
            <h2 className="mb-2 text-[1.25rem] font-semibold text-[#212121]">{labels["panel-title"]}</h2>
            <p className="mb-4 text-[0.9375rem] leading-[1.5] text-[#424242]">{labels["panel-invite"]}</p>
            <label className="sr-only" htmlFor="duo-invite-url">{labels["panel-copy"]}</label>
            <input id="duo-invite-url" readOnly value={url} onFocus={(e) => e.currentTarget.select()} className="mb-3 w-full rounded-[10px] border border-[#e0e0e0] bg-field px-3 py-2.5 text-[14px] text-[#212121]" />
            <div className="mb-5 flex flex-wrap gap-3">
                <button type="button" className={`${button} border-cta bg-cta text-white hover:bg-white hover:text-cta`} onClick={copy}>{labels["panel-copy"]}</button>
                {canShare && (
                    <button type="button" className={`${button} border-primary text-primary hover:bg-primary hover:text-white`} onClick={() => void navigator.share({ title: labels["panel-share-text"], text: labels["panel-share-text"], url }).catch(() => {})}>
                        {labels["panel-share"]}
                    </button>
                )}
            </div>
            <form
                className="mb-4"
                onSubmit={(e) => {
                    e.preventDefault();
                    const to = email.trim();
                    if (!to) return;
                    act(() => api.POST("/api/v1/membership/duo/send", { body: { email: to } }), () => fill(labels["panel-email-sent"], { email: to }));
                }}
            >
                <label htmlFor="duo-invite-email" className="mb-1.5 block text-[14px] text-[#424242]">{labels["panel-email-label"]}</label>
                <div className="flex gap-2 down-sm:flex-col">
                    <input id="duo-invite-email" type="email" required autoComplete="off" placeholder={labels["panel-email-placeholder"]} value={email} onChange={(e) => setEmail(e.target.value)} className="min-w-0 flex-1 rounded-[10px] border border-[#e0e0e0] px-3 py-2.5 text-[14px]" />
                    <button type="submit" disabled={busy || (state.emailsLeft ?? 0) <= 0} className={`${button} border-primary bg-primary text-white hover:bg-white hover:text-primary`}>{labels["panel-email-send"]}</button>
                </div>
                {state.emailsLeft != null && <p className="mt-1 text-[12px] text-[#86909a]">{fill(labels["panel-email-left"], { count: state.emailsLeft })}</p>}
            </form>
            {note && <p role="status" className={`mb-3 text-[14px] ${note.ok ? "text-cta" : "text-error"}`}>{note.text}</p>}
            <button type="button" disabled={busy} className="cursor-pointer text-[13px] text-[#86909a] underline disabled:opacity-60" title={labels["panel-regenerate-hint"]} onClick={() => act(() => api.POST("/api/v1/membership/duo/regenerate"), () => labels["panel-regenerate-hint"])}>
                {labels["panel-regenerate"]}
            </button>
        </div>
    );
}
