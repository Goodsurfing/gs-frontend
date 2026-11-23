"use client";

import { useEffect, useState } from "react";

import { browserApi } from "@/lib/browserApi";

export interface VacancyAssistantLabels {
    title: string;
    hint: string;
    placeholder: string;
    write: string;
    writing: string;
    applied: string;
    whatToDo: string;
    hello: string;
    missing: string;
    copy: string;
    copied: string;
    nextSteps: string;
    limit: string;
    failed: string;
}

interface Suggestion { shortDescription: string; description: string; whatToDo: string; helloText: string; missing: string }

/**
 * Помощник вакансии (GS-256): организатор пишет пару слов о проекте — помощник
 * заполняет короткое описание и описание проекта, а «что делать» и приветствие
 * показывает для следующих шагов мастера (скопировать). Тексты — черновик,
 * организатор правит и сохраняет сам. Блока нет, если помощники выключены.
 */
export function VacancyAssistant({ token, title, onApply, labels }: {
    token: string | undefined;
    title: string;
    onApply: (texts: { shortDescription: string; fullDescription: string }) => void;
    labels: VacancyAssistantLabels;
}) {
    const [enabled, setEnabled] = useState(false);
    const [keywords, setKeywords] = useState("");
    const [busy, setBusy] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [result, setResult] = useState<Suggestion | null>(null);
    const [copied, setCopied] = useState<string | null>(null);

    useEffect(() => {
        let cancelled = false;
        void browserApi(token).GET("/api/v1/assistant/status")
            .then(({ data }) => !cancelled && setEnabled(!!(data as { enabled?: boolean } | undefined)?.enabled))
            .catch(() => undefined);
        return () => {
            cancelled = true;
        };
    }, [token]);

    if (!enabled) return null;

    const write = async () => {
        setBusy(true);
        setError(null);
        const response = await browserApi(token).POST("/api/v1/assistant/vacancy-text", { body: { keywords, title, lang: document.documentElement.lang || "ru" } as never }).catch(() => null);
        setBusy(false);
        const data = response?.data as Suggestion | undefined;
        if (!data?.description) {
            setError(response?.response.status === 429 ? labels.limit : labels.failed);
            return;
        }
        setResult(data);
        onApply({ shortDescription: data.shortDescription, fullDescription: data.description });
    };

    const copy = (key: string, text: string) => {
        void navigator.clipboard?.writeText(text).then(() => {
            setCopied(key);
            window.setTimeout(() => setCopied(null), 2000);
        });
    };

    const extra = (key: string, heading: string, text: string) => text && (
        <div className="flex flex-col gap-1">
            <div className="flex items-center justify-between gap-2">
                <span className="text-[12px] font-semibold text-ink-tertiary">{heading}</span>
                <button type="button" onClick={() => copy(key, text)} className="cursor-pointer border-0 bg-transparent p-0 text-[12px] text-primary">{copied === key ? labels.copied : labels.copy}</button>
            </div>
            <p className="m-0 text-[13px] whitespace-pre-line text-ink-secondary">{text}</p>
        </div>
    );

    return (
        <section aria-label={labels.title} className="flex max-w-[624px] flex-col gap-3 rounded-[12px] border border-primary/40 bg-status-new/10 p-4">
            <div className="flex flex-col gap-0.5">
                <span className="text-[15px] font-semibold text-ink">{labels.title}</span>
                <span className="text-[13px] text-caption">{labels.hint}</span>
            </div>
            <textarea
                rows={2}
                value={keywords}
                maxLength={600}
                aria-label={labels.title}
                placeholder={labels.placeholder}
                onChange={(event) => setKeywords(event.target.value)}
                className="w-full resize-y rounded-[8px] border border-accent-bg bg-white p-2.5 text-[14px] outline-none focus:border-primary"
            />
            <div className="flex flex-wrap items-center gap-3">
                <button
                    type="button"
                    disabled={busy || keywords.trim().length < 3}
                    onClick={() => void write()}
                    className="h-9 cursor-pointer rounded-full border-0 bg-primary px-4 text-[14px] font-semibold text-white hover:bg-primary-hover disabled:cursor-default disabled:opacity-60"
                >
                    {busy ? labels.writing : labels.write}
                </button>
                {result && !busy && <span className="text-[12px] text-caption">{labels.applied}</span>}
                {error && <span role="alert" className="text-[12px] text-error">{error}</span>}
            </div>
            {result && (
                <div className="flex flex-col gap-3 border-t border-accent-bg pt-3">
                    {(result.whatToDo || result.helloText) && <span className="text-[12px] text-caption">{labels.nextSteps}</span>}
                    {extra("todo", labels.whatToDo, result.whatToDo)}
                    {extra("hello", labels.hello, result.helloText)}
                    {result.missing && <p className="m-0 text-[12px] text-ink-tertiary"><b>{labels.missing}</b> {result.missing}</p>}
                </div>
            )}
        </section>
    );
}
