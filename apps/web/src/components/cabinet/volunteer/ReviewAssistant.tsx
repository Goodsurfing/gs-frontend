"use client";

import { useEffect, useState } from "react";

import { browserApi } from "@/lib/browserApi";

export interface ReviewAssistantLabels {
    title: string;
    write: string;
    writing: string;
    hint: string;
    limit: string;
    failed: string;
    /** Подсказки: сначала хорошее, потом минусы */
    good: string[];
    bad: string[];
}

/**
 * Помощник отзыва (GS-256): волонтёр отмечает подсказки («дружная команда»,
 * «тяжёлая работа») — помощник складывает их и оценку в связный отзыв, текст
 * встаёт в поле, волонтёр правит и отправляет сам. Блока нет, если помощники
 * выключены или оценка ещё не поставлена.
 */
export function ReviewAssistant({ token, vacancyId, rating, onText, labels }: {
    token: string | undefined;
    vacancyId: number;
    rating: number | null;
    onText: (text: string) => void;
    labels: ReviewAssistantLabels;
}) {
    const [enabled, setEnabled] = useState(false);
    const [tags, setTags] = useState<string[]>([]);
    const [busy, setBusy] = useState(false);
    const [message, setMessage] = useState<string | null>(null);

    useEffect(() => {
        let cancelled = false;
        void browserApi(token).GET("/api/v1/assistant/status")
            .then(({ data }) => !cancelled && setEnabled(!!(data as { enabled?: boolean } | undefined)?.enabled))
            .catch(() => undefined);
        return () => {
            cancelled = true;
        };
    }, [token]);

    if (!enabled || !rating) return null;

    const toggle = (tag: string) => setTags((current) => (current.includes(tag) ? current.filter((item) => item !== tag) : [...current, tag]));

    const write = async () => {
        setBusy(true);
        setMessage(null);
        const response = await browserApi(token).POST("/api/v1/assistant/review-text", {
            body: { vacancy: vacancyId, rating, tags, lang: document.documentElement.lang || "ru" } as never,
        }).catch(() => null);
        setBusy(false);
        const text = (response?.data as { text?: string } | undefined)?.text;
        if (text) {
            onText(text);
            setMessage(labels.hint);
            return;
        }
        setMessage(response?.response.status === 429 ? labels.limit : labels.failed);
    };

    const chip = (tag: string, bad: boolean) => {
        const on = tags.includes(tag);
        return (
            <button
                key={tag}
                type="button"
                aria-pressed={on}
                onClick={() => toggle(tag)}
                className={`cursor-pointer rounded-full border px-2.5 py-1 text-[12px] transition-colors ${on ? (bad ? "border-error bg-status-rejected/40 text-error" : "border-primary bg-primary text-white") : "border-accent-bg bg-white text-ink-tertiary hover:border-primary"}`}
            >
                {tag}
            </button>
        );
    };

    return (
        <div className="flex w-full flex-col gap-2 rounded-[10px] bg-field p-3 text-left">
            <span className="text-[13px] font-semibold text-ink-secondary">{labels.title}</span>
            <div className="flex flex-wrap gap-1.5">
                {labels.good.map((tag) => chip(tag, false))}
                {labels.bad.map((tag) => chip(tag, true))}
            </div>
            <div className="flex flex-wrap items-center gap-3">
                <button type="button" disabled={busy} onClick={() => void write()} className="h-8 cursor-pointer rounded-full border border-primary bg-white px-3 text-[13px] font-medium text-primary hover:bg-primary hover:text-white disabled:cursor-default disabled:opacity-60">
                    {busy ? labels.writing : labels.write}
                </button>
                {message && <span className="text-[12px] text-caption">{message}</span>}
            </div>
        </div>
    );
}
