"use client";

import type { paths } from "@goodsurfing/api";
import { type FormEvent, useCallback, useEffect, useState } from "react";

import { type CategoryOption, type DescriptionLabels, DescriptionEditor } from "@/components/offer-wizard/DescriptionForm";
import { DateField } from "@/components/offer-wizard/DateField";
import { FieldError, OldInput, OldTextarea, PlusButton } from "@/components/offer-wizard/FinishParts";
import { LabeledSwitch } from "@/components/offer-wizard/LabeledSwitch";
import { toUploadedImage } from "@/components/offer-wizard/media";
import { apiErrorText } from "@/components/offer-wizard/useVacancy";
import { savedAddress, type WhereLabels, WhereEditor } from "@/components/offer-wizard/WhereForm";
import { useSession } from "@/components/session/SessionProvider";
import { Loading } from "@/components/ui/Loading";
import { Toast } from "@/components/ui/Toast";
import type { Locale } from "@/i18n/config";
import { browserApi } from "@/lib/browserApi";
import { type Day, dayFromApi } from "@/lib/offerWizard";
import { routes } from "@/lib/routes";

type Json<P extends keyof paths, M extends "get"> = paths[P][M] extends { responses: { 200: { content: { "application/json": infer R } } } } ? R : never;

type AddressData = Json<"/api/v1/fundraise/address/{id}", "get">;
type WhenData = Json<"/api/v1/fundraise/when/{id}", "get">;
type HowManyData = Json<"/api/v1/fundraise/how-many/{id}", "get">;
type DescriptionData = Json<"/api/v1/fundraise/description/{id}", "get">;
type MessagesData = Json<"/api/v1/fundraise/automatic-messages/{id}", "get"> & { status?: Status };

type Status = "draft" | "active" | "close";
type Loaded<T> = { status: "loading" } | { status: "missing" } | { status: "ready"; data: T };
type ToastState = { text: string; ok: boolean } | null;

export interface CommonLabels {
    save: string;
    next: string;
    error: string;
    loading: string;
    missing: string;
}

/**
 * Шаг сбора в браузере с токеном вошедшего: GET при открытии, сохранение —
 * PATCH того же адреса (FundraiseStepPage старого фронта). Сохранение вернёт
 * текст ошибки или null.
 */
function useFundraiseStep<T>(path: "/api/v1/fundraise/address/{id}" | "/api/v1/fundraise/when/{id}" | "/api/v1/fundraise/how-many/{id}" | "/api/v1/fundraise/description/{id}" | "/api/v1/fundraise/automatic-messages/{id}", id: string) {
    const session = useSession();
    const [state, setState] = useState<Loaded<T>>({ status: "loading" });

    useEffect(() => {
        if (session.status !== "user") return;
        let cancelled = false;
        void browserApi(session.token)
            .GET(path, { params: { path: { id } } })
            .then(({ data }) => {
                if (!cancelled) setState(data ? { status: "ready", data: data as T } : { status: "missing" });
            })
            .catch(() => {
                if (!cancelled) setState({ status: "missing" });
            });
        return () => {
            cancelled = true;
        };
    }, [path, id, session.status, session.token]);

    const save = useCallback(async (body: unknown, fallback: string): Promise<string | null> => {
        const result = await browserApi(session.token)
            .PATCH(path, { params: { path: { id } }, body: body as never })
            .catch(() => null);
        if (!result) return fallback;
        if (!result.response.ok) return apiErrorText((result as { error?: unknown }).error, fallback);
        return null;
    }, [path, id, session.token]);

    return { state, save, token: session.token };
}

const Missing = ({ text }: { text: string }) => <p className="mt-10 text-[18px] text-ink-tertiary">{text}</p>;

/** Две кнопки шага: «Сохранить» и «Дальше» (сохраняет и переходит), как в старом мастере сбора */
function StepButtons({ busy, labels, onSave, onNext }: { busy: boolean; labels: CommonLabels; onSave: () => void; onNext: () => void }) {
    const base = "min-w-[260px] cursor-pointer rounded-[10px] border border-primary px-[30px] py-3 text-center text-[16px] leading-[120%] transition-all duration-300 disabled:cursor-default disabled:opacity-70 down-lg:w-full";
    return (
        <div className="mt-7 flex gap-3 down-lg:flex-col">
            <button type="button" disabled={busy} onClick={onSave} className={`${base} bg-primary text-white hover:bg-white hover:text-primary`}>{labels.save}</button>
            <button type="button" disabled={busy} onClick={onNext} className={`${base} bg-transparent text-primary hover:bg-primary hover:text-white`}>{labels.next}</button>
        </div>
    );
}

export function FundraiseWhere({ id, locale, labels }: { id: string; locale: Locale; labels: WhereLabels }) {
    const { state, save } = useFundraiseStep<AddressData>("/api/v1/fundraise/address/{id}", id);
    if (state.status === "missing") return <Missing text={labels.missing} />;
    if (state.status === "loading") return <Loading label={labels.loading} className="min-h-[200px]" />;
    return (
        <WhereEditor
            id={id}
            locale={locale}
            nextHref={routes.fundraiseStep(locale, "when", id)}
            labels={labels}
            saved={savedAddress(state.data)}
            draftStep="fundraise-where"
            onSave={(where) => save(where, labels.error)}
        />
    );
}

export interface WhenLabels extends CommonLabels {
    date: string;
    notSet: string;
    untilAmount: string;
    saved: string;
}

export function FundraiseWhen({ id, locale, labels }: { id: string; locale: Locale; labels: WhenLabels }) {
    const { state, save } = useFundraiseStep<WhenData>("/api/v1/fundraise/when/{id}", id);
    if (state.status === "missing") return <Missing text={labels.missing} />;
    if (state.status === "loading") return <Loading label={labels.loading} className="min-h-[200px]" />;
    return <WhenEditor id={id} locale={locale} labels={labels} saved={state.data} save={save} />;
}

function WhenEditor({ id, locale, labels, saved, save }: {
    id: string;
    locale: Locale;
    labels: WhenLabels;
    saved: WhenData;
    save: (body: unknown, fallback: string) => Promise<string | null>;
}) {
    const [endDate, setEndDate] = useState<Day | null>(() => dayFromApi(saved.endDate));
    const [untilAmount, setUntilAmount] = useState(() => Boolean(saved.isUntilAmountCollected));
    const [busy, setBusy] = useState(false);
    const [toast, setToast] = useState<ToastState>(null);

    const submit = async (next: boolean) => {
        setBusy(true);
        setToast(null);
        const error = await save({ endDate: untilAmount ? null : endDate, isUntilAmountCollected: untilAmount }, labels.error);
        setBusy(false);
        if (error) {
            setToast({ text: error, ok: false });
            return;
        }
        setToast({ text: labels.saved, ok: true });
        if (next) window.location.assign(routes.fundraiseStep(locale, "amount", id));
    };

    return (
        <div className="mt-6 max-w-[980px]">
            <Toast text={toast?.text ?? null} ok={toast?.ok} onClose={() => setToast(null)} />
            <p className="text-[14px] text-black">{labels.date}</p>
            <div className="mt-2 flex flex-wrap items-center gap-x-10 gap-y-5">
                <DateField value={endDate} onChange={(day) => setEndDate(day)} disabled={untilAmount} label={labels.date} placeholder={labels.notSet} locale={locale} />
                <div className="max-w-[560px]">
                    <LabeledSwitch checked={untilAmount} onChange={() => setUntilAmount((value) => !value)} label={labels.untilAmount} />
                </div>
            </div>
            <StepButtons busy={busy} labels={labels} onSave={() => void submit(false)} onNext={() => void submit(true)} />
        </div>
    );
}

export interface AmountLabels extends CommonLabels {
    amount: string;
    minAmount: string;
    hint: string;
    saved: string;
}

const digits = (value: string) => value.replace(/[^\d]/g, "");

export function FundraiseAmount({ id, locale, labels }: { id: string; locale: Locale; labels: AmountLabels }) {
    const { state, save } = useFundraiseStep<HowManyData>("/api/v1/fundraise/how-many/{id}", id);
    if (state.status === "missing") return <Missing text={labels.missing} />;
    if (state.status === "loading") return <Loading label={labels.loading} className="min-h-[200px]" />;
    return <AmountEditor id={id} locale={locale} labels={labels} saved={state.data} save={save} />;
}

function AmountEditor({ id, locale, labels, saved, save }: {
    id: string;
    locale: Locale;
    labels: AmountLabels;
    saved: HowManyData;
    save: (body: unknown, fallback: string) => Promise<string | null>;
}) {
    const [amount, setAmount] = useState(() => (saved.amount ? String(saved.amount) : ""));
    const [minAmount, setMinAmount] = useState(() => (saved.minAmount ? String(saved.minAmount) : ""));
    const [busy, setBusy] = useState(false);
    const [toast, setToast] = useState<ToastState>(null);

    const submit = async (next: boolean) => {
        setBusy(true);
        setToast(null);
        const error = await save({ amount: Number(amount || 0), minAmount: Number(minAmount || 0) }, labels.error);
        setBusy(false);
        if (error) {
            setToast({ text: error, ok: false });
            return;
        }
        setToast({ text: labels.saved, ok: true });
        if (next) window.location.assign(routes.fundraiseStep(locale, "description", id));
    };

    return (
        <div className="mt-6 max-w-[820px]">
            <Toast text={toast?.text ?? null} ok={toast?.ok} onClose={() => setToast(null)} />
            <OldInput label={labels.amount} value={amount} inputMode="numeric" disabled={busy} onChange={(event) => setAmount(digits(event.target.value))} />
            <OldInput className="mt-[18px]" label={labels.minAmount} value={minAmount} inputMode="numeric" disabled={busy} onChange={(event) => setMinAmount(digits(event.target.value))} />
            <p className="mt-3 text-[0.75rem] leading-[1.4] text-[#82949F]">{labels.hint}</p>
            <StepButtons busy={busy} labels={labels} onSave={() => void submit(false)} onNext={() => void submit(true)} />
        </div>
    );
}

export function FundraiseDescription({ id, locale, categories, labels }: { id: string; locale: Locale; categories: CategoryOption[]; labels: DescriptionLabels }) {
    const { state, save } = useFundraiseStep<DescriptionData>("/api/v1/fundraise/description/{id}", id);
    if (state.status === "missing") return <Missing text={labels.missing} />;
    if (state.status === "loading") return <Loading label={labels.loading} className="min-h-[200px]" />;
    const data = state.data;
    return (
        <DescriptionEditor
            id={id}
            nextHref={routes.fundraiseStep(locale, "auto-messages", id)}
            categories={categories}
            labels={labels}
            draftStep="fundraise-description"
            saved={{
                form: {
                    title: data.name ?? "",
                    categoryIds: (data.categoryIds ?? []).filter((category) => Number.isInteger(category)),
                    shortDescription: data.shortDescription ?? "",
                    fullDescription: data.description ?? "",
                },
                cover: toUploadedImage(data.image),
            }}
            savedGallery={data.galleryImages ?? []}
            // Фото сбора сохраняются вместе с описанием, как в старом фронте
            onSave={({ form, cover, gallery }) => save({
                name: form.title,
                shortDescription: form.shortDescription,
                description: form.fullDescription,
                imageId: cover.id,
                galleryImageIds: gallery.map((image) => image.id),
                categoryIds: form.categoryIds,
            }, labels.error)}
        />
    );
}

export interface MessagesLabels {
    wordsTitle: string;
    wordsDescription: string;
    max: string;
    required: string;
    addLinkTitle: string;
    addLinkDescription: string;
    addLink: string;
    removeLink: string;
    publish: string;
    saveChanges: string;
    saveDraft: string;
    published: string;
    savedDraft: string;
    error: string;
    loading: string;
    missing: string;
}

const WORDS_MAX = 1000;

export function FundraiseAutoMessages({ id, labels }: { id: string; labels: MessagesLabels }) {
    const { state, save, token } = useFundraiseStep<MessagesData>("/api/v1/fundraise/automatic-messages/{id}", id);
    if (state.status === "missing") return <Missing text={labels.missing} />;
    if (state.status === "loading") return <Loading label={labels.loading} className="min-h-[200px]" />;
    return <MessagesEditor id={id} labels={labels} saved={state.data} save={save} token={token} />;
}

function MessagesEditor({ id, labels, saved, save, token }: {
    id: string;
    labels: MessagesLabels;
    saved: MessagesData;
    save: (body: unknown, fallback: string) => Promise<string | null>;
    token: string | undefined;
}) {
    const [words, setWords] = useState(() => saved.wordsGratitude ?? "");
    const [wordsError, setWordsError] = useState(false);
    const [links, setLinks] = useState<string[]>(() => (saved.urlProgressWork?.length ? saved.urlProgressWork : [""]));
    const [status, setStatus] = useState<Status>(() => saved.status ?? "draft");
    const [busy, setBusy] = useState(false);
    const [toast, setToast] = useState<ToastState>(null);

    const submit = async (next: Status) => {
        setToast(null);
        if (!words.trim()) {
            setWordsError(true);
            return;
        }
        setWordsError(false);
        setBusy(true);
        const error = await save({ wordsGratitude: words, urlProgressWork: links.map((link) => link.trim()).filter(Boolean), status: next }, labels.error)
            ?? await browserApi(token)
                .PATCH("/api/v1/fundraise/{id}/toggle-status", { params: { path: { id } }, body: { status: next } })
                .then((result) => (result.response.ok ? null : apiErrorText((result as { error?: unknown }).error, labels.error)))
                .catch(() => labels.error);
        setBusy(false);
        if (error) {
            setToast({ text: error, ok: false });
            return;
        }
        setStatus(next);
        setToast({ text: next === "active" ? labels.published : labels.savedDraft, ok: true });
    };

    const submitForm = (event: FormEvent) => {
        event.preventDefault();
        void submit("active");
    };

    const button = "cursor-pointer rounded-[10px] border border-primary px-[30px] py-3 text-center text-[16px] leading-[120%] transition-all duration-300 disabled:cursor-default disabled:opacity-70 down-lg:w-full";

    return (
        <form onSubmit={submitForm} noValidate className="mt-6 max-w-[880px]">
            <Toast text={toast?.text ?? null} ok={toast?.ok} onClose={() => setToast(null)} />
            <p className="mb-2 text-[16px] text-caption">{labels.wordsTitle}</p>
            <OldTextarea
                label={labels.wordsDescription}
                description={labels.max}
                value={words}
                maxLength={WORDS_MAX}
                aria-invalid={wordsError}
                onChange={(event) => {
                    setWords(event.target.value);
                    if (event.target.value.trim()) setWordsError(false);
                }}
            />
            {wordsError && <FieldError text={labels.required} />}
            <p className="mt-6 mb-2 text-[16px] text-caption">{labels.addLinkTitle}</p>
            <p className="mb-3 text-[0.875rem] text-[#82949F]">{labels.addLinkDescription}</p>
            <div className="flex flex-col gap-3">
                {links.map((link, index) => (
                    // Строки ссылок без своих id: ключ — позиция, удаление пересобирает список
                    <div key={index} className="flex items-center gap-2.5">
                        <OldInput
                            className="flex-1"
                            labelHidden={`${labels.addLinkTitle} ${index + 1}`}
                            value={link}
                            disabled={busy}
                            onChange={(event) => setLinks((current) => current.map((value, i) => (i === index ? event.target.value : value)))}
                        />
                        <button
                            type="button"
                            aria-label={labels.removeLink}
                            onClick={() => setLinks((current) => {
                                const rest = current.filter((_, i) => i !== index);
                                return rest.length ? rest : [""];
                            })}
                            className="flex h-6 w-6 cursor-pointer items-center justify-center border-0 bg-transparent text-[20px] leading-none text-[#82949F] hover:text-black"
                        >
                            ×
                        </button>
                    </div>
                ))}
            </div>
            <div className="mt-3.5">
                <PlusButton text={labels.addLink} disabled={busy} onClick={() => setLinks((current) => [...current, ""])} />
            </div>
            <div className="mt-10 flex gap-2.5 down-lg:flex-col">
                <button type="submit" disabled={busy} className={`${button} bg-primary text-white hover:bg-white hover:text-primary`}>
                    {status === "draft" ? labels.publish : labels.saveChanges}
                </button>
                <button type="button" disabled={busy} onClick={() => void submit("draft")} className={`${button} bg-transparent text-primary hover:bg-primary hover:text-white`}>
                    {labels.saveDraft}
                </button>
            </div>
        </form>
    );
}
