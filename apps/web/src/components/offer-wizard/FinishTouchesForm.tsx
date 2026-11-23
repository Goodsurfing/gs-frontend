"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { type FormEvent, useCallback, useState } from "react";

import { MemberBanner } from "@/components/content/MemberBanner";
import { useSession } from "@/components/session/SessionProvider";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { Loading } from "@/components/ui/Loading";
import { Toast } from "@/components/ui/Toast";
import type { Locale } from "@/i18n/config";
import { browserApi } from "@/lib/browserApi";
import {
    addQuestion, errorKey, errorMessage, type FinishForm as Form, finishFromApi, finishToApi, isQuestionnaireUrl, isVacancyLimitError, toggleIn,
} from "@/lib/offerWizardFinish";

import { clearDraft, readDraft, writeDraft } from "./draft";
import { FieldError, IconToggle, localIcon, MaskImage, OldInput, OldTextarea, PlusButton } from "./FinishParts";
import { LabeledSwitch } from "./LabeledSwitch";
import { patchVacancy, useVacancyElement, type VacancyElement } from "./useVacancy";

export interface FinishLabels {
    extraConditions: string;
    /** Требования к участнику: id, подпись, значок из /web/icons/offer */
    conditions: { id: string; text: string; icon: string }[];
    onlyVerified: string;
    helloTitle: string;
    helloLabel: string;
    rulesTitle: string;
    rulesLabel: string;
    maxChars: string;
    questionsTitle: string;
    questionnaireLabel: string;
    questionnaireHint: string;
    badUrl: string;
    question: string;
    removeQuestion: string;
    addQuestion: string;
    publish: string;
    saveChanges: string;
    saveDraft: string;
    confirmPublish: string;
    cancel: string;
    limitTitle: string;
    limitButton: string;
    close: string;
    /** Переводы известных ошибок бэкенда: ключ словаря → текст */
    errors: Record<string, string>;
    error: string;
    unsaved: string;
    loading: string;
    missing: string;
}

const isForm = (value: unknown): value is Form => {
    const v = value as Form | null;
    return !!v && Array.isArray(v.additionalConditions) && Array.isArray(v.questions) && typeof v.helloText === "string" && typeof v.onlyVerified === "boolean";
};

// Тот же счётчик, что в components/analytics/YandexMetrika.tsx (общий файл каркаса, отсюда не экспортируется)
const METRIKA_ID = Number(process.env.NEXT_PUBLIC_YANDEX_METRIKA_ID) || 0;

/** Окно «Бесплатно можно опубликовать только 1 вакансию» (Modal + MemberBanner в HostOffersPage старого фронта) */
function LimitDialog({ open, onClose, locale, labels }: { open: boolean; onClose: () => void; locale: Locale; labels: FinishLabels }) {
    return (
        <Dialog.Root open={open} onOpenChange={(value) => !value && onClose()}>
            <Dialog.Portal>
                <Dialog.Overlay className="fixed inset-0 z-[999] flex animate-fade-in items-center justify-center bg-black/50 p-4">
                    <Dialog.Content aria-describedby={undefined} className="relative w-full max-w-[468px]">
                        <Dialog.Title className="sr-only">{labels.limitTitle}</Dialog.Title>
                        <MemberBanner locale={locale} title={labels.limitTitle} button={labels.limitButton} />
                        <Dialog.Close aria-label={labels.close} className="absolute top-2 right-3 cursor-pointer text-[24px] leading-none text-white">×</Dialog.Close>
                    </Dialog.Content>
                </Dialog.Overlay>
            </Dialog.Portal>
        </Dialog.Root>
    );
}

/**
 * Шаг «Последние штрихи» (OfferFinishingTouches старого фронта): требования к
 * участнику, только проверенные, приветствие, правила, анкета и вопросы.
 * Черновик — «Опубликовать» (с подтверждением): PATCH finishingTouches, затем
 * toggle-status active; лимит бесплатных вакансий — окно с призывом к членству.
 * Опубликованная — «Сохранить изменения». После сохранения — к списку вакансий.
 */
export function FinishTouchesForm({ id, locale, myOffersHref, labels }: { id: string; locale: Locale; myOffersHref: string; labels: FinishLabels }) {
    const state = useVacancyElement(id);
    if (state.status === "missing") return <p className="mt-10 text-[18px] text-ink-tertiary">{labels.missing}</p>;
    if (state.status === "loading") return <Loading label={labels.loading} className="min-h-[200px]" />;
    return <FinishEditor id={id} locale={locale} myOffersHref={myOffersHref} labels={labels} vacancy={state.vacancy} />;
}

function FinishEditor({ id, locale, myOffersHref, labels, vacancy }: { id: string; locale: Locale; myOffersHref: string; labels: FinishLabels; vacancy: VacancyElement }) {
    const session = useSession();
    const isDraft = (vacancy.status || "draft") === "draft";
    const [initial] = useState(() => readDraft("finishing-touches", id, isForm));
    const [form, setForm] = useState<Form>(() => initial ?? finishFromApi(vacancy.finishingTouche));
    const [unsaved, setUnsaved] = useState(!!initial);
    const [busy, setBusy] = useState(false);
    const [confirm, setConfirm] = useState(false);
    const [limit, setLimit] = useState(false);
    const [toast, setToast] = useState<{ text: string; ok: boolean } | null>(null);

    const update = useCallback((next: Form) => {
        setForm(next);
        setUnsaved(true);
        writeDraft("finishing-touches", id, next);
    }, [id]);

    const urlError = !isQuestionnaireUrl(form.questionnaireUrl);
    const errorText = (error: unknown) => {
        const message = errorMessage(error);
        if (!message) return labels.error;
        const key = errorKey(message);
        return (key && labels.errors[key]) || message;
    };

    /** Сохранить и, если нужно, опубликовать; успех — к списку вакансий, как в старом фронте */
    const save = async (publish: boolean) => {
        setBusy(true);
        setToast(null);
        const api = browserApi(session.token);
        const saved = await patchVacancy(session.token, id, { finishingTouches: finishToApi(form) });
        if (!saved || saved.error || !saved.response.ok) {
            setBusy(false);
            setToast({ text: errorText(saved?.error), ok: false });
            return;
        }
        clearDraft("finishing-touches", id);
        setUnsaved(false);
        // После публикации «Мои вакансии» сразу предложат поделиться вакансией
        const target = publish ? `${myOffersHref}?published=${encodeURIComponent(id)}` : myOffersHref;
        if (publish) {
            const toggled = await api
                .PATCH("/api/v1/vacancy/{id}/toggle-status", { params: { path: { id: Number(id) } }, body: { status: "active" } })
                .catch(() => null);
            if (!toggled || toggled.error || !toggled.response.ok) {
                setBusy(false);
                if (isVacancyLimitError(toggled?.error)) setLimit(true);
                else setToast({ text: errorText(toggled?.error), ok: false });
                return;
            }
            if (METRIKA_ID && window.ym) {
                // Уйти со страницы после отправки цели, иначе запрос Метрики может оборваться; не дольше секунды
                const leave = () => window.location.assign(target);
                const timer = window.setTimeout(leave, 1000);
                window.ym(METRIKA_ID, "reachGoal", "vacancy_published", { from: "wizard" }, () => {
                    window.clearTimeout(timer);
                    leave();
                });
                return;
            }
        }
        window.location.assign(target);
    };

    const submit = (event: FormEvent) => {
        event.preventDefault();
        if (urlError) return;
        if (isDraft) setConfirm(true);
        else void save(false);
    };

    const button = "flex cursor-pointer items-center justify-center rounded-[10px] border border-primary px-[100px] py-3 text-center text-[16px] leading-[120%] transition-all duration-300 down-lg:w-full down-lg:px-[15px] disabled:cursor-default disabled:opacity-70";

    return (
        <form onSubmit={submit} noValidate className="mt-10 max-w-[880px]">
            <Toast text={toast?.text ?? null} ok={toast?.ok} onClose={() => setToast(null)} />
            <div className="flex flex-col gap-10">
                <div className="flex flex-col gap-5">
                    <p className="text-[16px] text-caption">{labels.extraConditions}</p>
                    <div className="grid grid-cols-[repeat(auto-fill,minmax(200px,1fr))] gap-[30px]">
                        {labels.conditions.map((item) => (
                            <IconToggle
                                key={item.id}
                                checked={form.additionalConditions.includes(item.id)}
                                onToggle={() => update({ ...form, additionalConditions: toggleIn(form.additionalConditions, item.id) })}
                                text={item.text}
                                icon={<MaskImage src={localIcon(item.icon)} className="h-5 w-5" />}
                            />
                        ))}
                    </div>
                </div>
                <div className="flex flex-col gap-2">
                    <LabeledSwitch labelStyle="body" checked={form.onlyVerified} onChange={() => update({ ...form, onlyVerified: !form.onlyVerified })} label={labels.onlyVerified} />
                </div>
                <div className="flex flex-col gap-2">
                    <p className="text-[16px] text-caption">{labels.helloTitle}</p>
                    <OldTextarea label={labels.helloLabel} description={labels.maxChars} maxLength={1000} value={form.helloText} onChange={(event) => update({ ...form, helloText: event.target.value })} />
                </div>
                <div className="flex flex-col gap-2">
                    <p className="text-[16px] text-caption">{labels.rulesTitle}</p>
                    <OldTextarea label={labels.rulesLabel} description={labels.maxChars} maxLength={1000} value={form.roles} onChange={(event) => update({ ...form, roles: event.target.value })} />
                </div>
                <div className="flex flex-col gap-2">
                    <p className="text-[16px] text-caption">{labels.questionsTitle}</p>
                    <div>
                        <OldInput label={labels.questionnaireLabel} description={labels.questionnaireHint} value={form.questionnaireUrl} onChange={(event) => update({ ...form, questionnaireUrl: event.target.value })} aria-invalid={urlError} />
                        {urlError && <FieldError text={labels.badUrl} />}
                    </div>
                </div>
                <div>
                    {form.questions.map((question, index) => (
                        <div key={index} className="mb-2.5 flex gap-2.5">
                            <OldInput
                                labelHidden={`${labels.question} ${index + 1}`}
                                value={question}
                                onChange={(event) => update({ ...form, questions: form.questions.map((item, i) => (i === index ? event.target.value : item)) })}
                                className="w-full"
                            />
                            <button
                                type="button"
                                aria-label={labels.removeQuestion}
                                onClick={() => update({ ...form, questions: form.questions.filter((_, i) => i !== index) })}
                                className="inline-flex cursor-pointer items-center justify-center rounded-[2px] px-2.5 py-1.5 font-[sans-serif] text-[13.3333px] text-black hover:bg-[rgb(236,233,233)]"
                            >
                                ✖
                            </button>
                        </div>
                    ))}
                    <PlusButton text={labels.addQuestion} onClick={() => update({ ...form, questions: addQuestion(form.questions) })} />
                </div>
            </div>
            <div className="flex flex-col pt-[60px]">
                {unsaved && <p className="my-[15px] text-[0.75rem] text-[#d32f2f]">{labels.unsaved}</p>}
                {/* В старой форме кнопки и на узком экране оставались в строку */}
                <div className="flex gap-2.5">
                    <button type="submit" disabled={busy} className={`${button} bg-primary text-white hover:bg-white hover:text-primary disabled:hover:bg-primary disabled:hover:text-white`}>
                        {isDraft ? labels.publish : labels.saveChanges}
                    </button>
                    <button type="button" disabled={busy || !isDraft} onClick={() => !urlError && void save(false)} className={`${button} bg-transparent text-primary hover:bg-primary hover:text-white disabled:hover:bg-transparent disabled:hover:text-primary`}>
                        {labels.saveDraft}
                    </button>
                </div>
            </div>
            <ConfirmDialog
                open={confirm}
                text={labels.confirmPublish}
                confirm={labels.publish}
                cancel={labels.cancel}
                busy={busy}
                onConfirm={() => {
                    setConfirm(false);
                    void save(true);
                }}
                onClose={() => setConfirm(false)}
            />
            <LimitDialog open={limit} onClose={() => setLimit(false)} locale={locale} labels={labels} />
        </form>
    );
}
