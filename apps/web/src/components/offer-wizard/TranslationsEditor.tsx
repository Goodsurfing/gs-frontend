"use client";

import { useEffect, useState } from "react";

import { TextField } from "@/components/form/fields";
import { useSession } from "@/components/session/SessionProvider";
import { Toast } from "@/components/ui/Toast";
import { browserApi } from "@/lib/browserApi";

import { WizardTextarea } from "./WizardTextarea";

type Locale = "en" | "es";
type Texts = { title: string; shortDescription: string; description: string };
type Translation = Texts & { locale: Locale; source: "auto" | "host"; outdated: boolean };

export interface TranslationsEditorLabels {
    heading: string;
    intro: string;
    tabs: Record<Locale, string>;
    auto: string;
    host: string;
    outdated: string;
    pending: string;
    title: string;
    short: string;
    full: string;
    save: string;
    saved: string;
    error: string;
}

const EMPTY: Texts = { title: "", shortDescription: "", description: "" };

/**
 * Переводы вакансии на английский и испанский в мастере (GS-227): автоматический перевод
 * (Яндекс, раз в час после сохранения русского текста) можно поправить — правку организатора
 * автоперевод больше не перезаписывает, а если русский текст потом поменялся — помечаем «устарел».
 */
export function TranslationsEditor({ id, labels }: { id: string; labels: TranslationsEditorLabels }) {
    const session = useSession();
    const [locale, setLocale] = useState<Locale>("en");
    const [translations, setTranslations] = useState<Partial<Record<Locale, Translation>> | null>(null);
    const [draft, setDraft] = useState<Partial<Record<Locale, Texts>>>({});
    const [busy, setBusy] = useState(false);
    const [toast, setToast] = useState<{ text: string; ok: boolean } | null>(null);

    useEffect(() => {
        if (session.status !== "user") return;
        let cancelled = false;
        browserApi(session.token)
            .GET("/api/v1/vacancy/{id}/translations", { params: { path: { id } } })
            .then(({ data }) => {
                if (cancelled) return;
                const byLocale: Partial<Record<Locale, Translation>> = {};
                for (const item of (data ?? []) as Translation[]) byLocale[item.locale] = item;
                setTranslations(byLocale);
            })
            .catch(() => !cancelled && setTranslations({}));
        return () => {
            cancelled = true;
        };
    }, [id, session.status, session.token]);

    if (translations === null) return null;
    const current = translations[locale];
    const values = draft[locale] ?? (current ? { title: current.title, shortDescription: current.shortDescription, description: current.description } : EMPTY);
    const set = (patch: Partial<Texts>) => setDraft((all) => ({ ...all, [locale]: { ...values, ...patch } }));

    const save = async () => {
        if (!values.title.trim()) return;
        setBusy(true);
        try {
            const { data, response } = await browserApi(session.token).PATCH("/api/v1/vacancy/{id}/translations/{locale}", {
                params: { path: { id, locale } },
                body: values,
            });
            if (!response.ok || !data) throw new Error();
            setTranslations((all) => ({ ...all, [locale]: data as Translation }));
            setDraft((all) => ({ ...all, [locale]: undefined }));
            setToast({ text: labels.saved, ok: true });
        } catch {
            setToast({ text: labels.error, ok: false });
        } finally {
            setBusy(false);
        }
    };

    return (
        <section className="mt-[60px] max-w-[624px] border-t border-accent-bg pt-8" aria-labelledby="translations-heading">
            <h2 id="translations-heading" className="text-[1.25rem] font-medium text-ink-secondary">{labels.heading}</h2>
            <p className="mt-1 text-[14px] leading-[140%] text-caption">{labels.intro}</p>
            <div role="tablist" className="mt-4 inline-flex rounded-[10px] bg-field p-1">
                {(["en", "es"] as const).map((code) => (
                    <button
                        key={code}
                        type="button"
                        role="tab"
                        aria-selected={locale === code}
                        onClick={() => setLocale(code)}
                        className={`cursor-pointer rounded-[8px] px-4 py-1.5 text-[14px] ${locale === code ? "bg-white font-semibold text-ink-secondary shadow-sm" : "text-caption hover:text-ink"}`}
                    >
                        {labels.tabs[code]}
                    </button>
                ))}
            </div>
            <p className="mt-3 text-[13px] text-caption">
                {current ? (current.source === "host" ? labels.host : labels.auto) : labels.pending}
                {current?.outdated && <span className="ml-2 rounded-full bg-notice-bg px-2 py-0.5 text-ink-secondary">{labels.outdated}</span>}
            </p>
            <div className="mt-4 flex flex-col gap-5">
                <TextField label={labels.title} value={values.title} onChange={(event) => set({ title: event.target.value })} maxLength={300} />
                <WizardTextarea label={labels.short} maxLength={1500} value={values.shortDescription} onChange={(event) => set({ shortDescription: event.target.value })} />
                <WizardTextarea label={labels.full} maxLength={15000} textareaClass="h-[11.375rem]" value={values.description} onChange={(event) => set({ description: event.target.value })} />
            </div>
            <button
                type="button"
                onClick={() => void save()}
                disabled={busy || !values.title.trim() || !draft[locale]}
                className="mt-5 cursor-pointer rounded-[10px] border border-primary bg-primary px-6 py-2.5 text-[15px] text-white transition-colors hover:bg-white hover:text-primary disabled:cursor-default disabled:opacity-50"
            >
                {labels.save}
            </button>
            <Toast text={toast?.text ?? null} ok={toast?.ok} onClose={() => setToast(null)} />
        </section>
    );
}
