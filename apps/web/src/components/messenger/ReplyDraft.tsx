"use client";

import { useEffect, useState } from "react";

import { browserApi } from "@/lib/browserApi";

export interface ReplyDraftLabels {
    suggest: string;
    writing: string;
    hint: string;
    limit: string;
    failed: string;
}

/** Включены ли помощники — один запрос на страницу */
let statusRequest: Promise<boolean> | null = null;
const assistantEnabled = (token: string | undefined): Promise<boolean> => {
    statusRequest ??= browserApi(token).GET("/api/v1/assistant/status")
        .then(({ data }) => !!(data as { enabled?: boolean } | undefined)?.enabled)
        .catch(() => false);
    return statusRequest;
};

/**
 * «Предложить ответ» для хоста в переписке по заявке (GS-256): помощник пишет
 * черновик по вакансии, профилю волонтёра и переписке, черновик встаёт в поле
 * ввода — хост правит и отправляет сам. Кнопки нет, если помощники выключены.
 */
export function ReplyDraft({ token, applicationId, onDraft, onError, labels }: {
    token: string | undefined;
    applicationId: number;
    onDraft: (text: string) => void;
    onError: (text: string) => void;
    labels: ReplyDraftLabels;
}) {
    const [enabled, setEnabled] = useState(false);
    const [busy, setBusy] = useState(false);
    const [used, setUsed] = useState(false);

    useEffect(() => {
        let cancelled = false;
        void assistantEnabled(token).then((value) => !cancelled && setEnabled(value));
        return () => {
            cancelled = true;
        };
    }, [token]);

    if (!enabled) return null;

    const suggest = async () => {
        setBusy(true);
        const result = await browserApi(token).POST("/api/v1/assistant/application-reply", { body: { application: applicationId } }).catch(() => null);
        setBusy(false);
        const text = (result?.data as { text?: string } | undefined)?.text;
        if (text) {
            onDraft(text);
            setUsed(true);
            return;
        }
        onError(result?.response.status === 429 ? labels.limit : labels.failed);
    };

    return (
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 px-4 pt-2">
            <button
                type="button"
                disabled={busy}
                onClick={() => void suggest()}
                className="inline-flex h-8 cursor-pointer items-center gap-1.5 rounded-full border border-primary bg-white px-3 text-[13px] font-medium text-primary transition-colors hover:bg-primary hover:text-white disabled:cursor-default disabled:opacity-70"
            >
                <svg aria-hidden viewBox="0 0 24 24" className={`h-4 w-4 ${busy ? "animate-pulse" : ""}`} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3v3M12 18v3M3 12h3M18 12h3M5.6 5.6l2.1 2.1M16.3 16.3l2.1 2.1M5.6 18.4l2.1-2.1M16.3 7.7l2.1-2.1" /></svg>
                {busy ? labels.writing : labels.suggest}
            </button>
            {used && <span className="text-[12px] text-caption">{labels.hint}</span>}
        </div>
    );
}
