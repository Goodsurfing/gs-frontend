"use client";

import { type FormEvent, useCallback, useState } from "react";

import { TextField } from "@/components/form/fields";
import { Loading } from "@/components/ui/Loading";
import { Toast } from "@/components/ui/Toast";
import {
    ADDITIONAL_INFO_MAX, addLanguage, AGE_NO_LIMIT, commitAgeMax, commitAgeMin, type Gender, LANGUAGE_LEVELS, languageChoices,
    MAX_VOLUNTEER_PLACES, type ReceptionPlace, type RequiredLanguage, setAgeMin, toggleNoAgeLimit, type WhoNeedsForm as Form,
    whoNeedsErrors, whoNeedsFromApi, whoNeedsToApi,
} from "@/lib/offerWizard";

import { clearDraft, readDraft, writeDraft } from "./draft";
import { LabeledSwitch } from "./LabeledSwitch";
import { OptionSelect } from "./OptionSelect";
import { useVacancy, type Vacancy } from "./useVacancy";
import { WizardActions } from "./WizardActions";
import { WizardTextarea } from "./WizardTextarea";

export interface WhoNeedsLabels {
    genders: Record<Gender, string>;
    age: string;
    from: string;
    to: string;
    andOlder: string;
    noAgeLimit: string;
    language: string;
    level: string;
    /** Подписи языков и уровней по значению */
    languages: Record<string, string>;
    levels: Record<string, string>;
    oneLanguage: string;
    allLanguages: string;
    addLanguage: string;
    removeLanguage: string;
    places: string;
    receptionTitle: string;
    reception: Record<ReceptionPlace, string>;
    additionalInfo: string;
    additionalHint: string;
    required: string;
    saved: string;
    error: string;
    save: string;
    next: string;
    unsaved: string;
    loading: string;
    missing: string;
}

const isForm = (value: unknown): value is Form => {
    const v = value as Form | null;
    return !!v && Array.isArray(v.gender) && Array.isArray(v.languages) && typeof v.ageMin === "number" && typeof v.ageMax === "number";
};

const EMPTY_LANGUAGE: RequiredLanguage = { language: "not_matter", languageLevel: "not_matter" };
const GENDERS: Gender[] = ["female", "male", "other"];
const RECEPTION: ReceptionPlace[] = ["any", "foreigners", "compatriot"];

/** Красная строка под полем (ErrorText старого фронта) */
const ErrorText = ({ text }: { text: string }) => <p role="alert" className="my-[15px] text-[0.75rem] text-[#d32f2f]">{text}</p>;

/** Число в поле: свободный ввод, в форму — только целое; при уходе из поля применяются правила */
function NumberInput({ value, onChange, onCommit, label, placeholder, className = "" }: {
    value: number;
    onChange: (value: number) => void;
    onCommit?: () => void;
    label: string;
    placeholder?: string;
    className?: string;
}) {
    const [text, setText] = useState<string | null>(null);
    return (
        <div className={`flex w-full ${className}`}>
            <input
                type="number"
                inputMode="numeric"
                aria-label={label}
                placeholder={placeholder}
                value={text ?? String(value)}
                onChange={(event) => {
                    setText(event.target.value);
                    if (/^\d+$/.test(event.target.value)) onChange(Number(event.target.value));
                }}
                onBlur={() => {
                    setText(null);
                    onCommit?.();
                }}
                className="box-border max-h-11 w-full rounded-[0.625rem] border border-[#82949F] bg-white p-3.5 font-[Lato] text-[1rem] font-normal text-black outline-none"
            />
        </div>
    );
}

/** Строка «язык — уровень» (Languages старого фронта): два списка и крестик у добавленных */
function LanguageRow({ value, onChange, onRemove, selected, isDraft, labels }: {
    value: RequiredLanguage;
    onChange: (value: RequiredLanguage) => void;
    onRemove?: () => void;
    selected: RequiredLanguage[];
    isDraft: boolean;
    labels: WhoNeedsLabels;
}) {
    const languages = languageChoices(selected, value.language, isDraft).map((code) => ({ value: code, label: labels.languages[code] ?? code }));
    const levels = LANGUAGE_LEVELS.map(([code]) => ({ value: code, label: labels.levels[code] ?? code }));
    return (
        <div className="mt-[30px] flex w-full items-end gap-6 down-lg:gap-[5px]">
            <OptionSelect
                className="max-w-[300px]"
                label={labels.language}
                value={value.language}
                options={languages}
                onChange={(language) => onChange(language === "not_matter" ? EMPTY_LANGUAGE : { ...value, language })}
            />
            <OptionSelect
                className="max-w-[300px]"
                label={labels.level}
                value={value.languageLevel}
                options={levels}
                onChange={(level) => {
                    // Уровень «неважного» языка не задаётся (Languages старого фронта)
                    if (value.language === "not_matter") return;
                    const found = LANGUAGE_LEVELS.find(([code]) => code === level);
                    if (found) onChange({ ...value, languageLevel: found[0] });
                }}
            />
            {onRemove && (
                <button type="button" aria-label={labels.removeLanguage} onClick={onRemove} className="mb-2 inline-flex min-h-9 min-w-9 shrink-0 cursor-pointer items-center justify-center font-[sans-serif] text-[13.3333px] text-black">
                    ✖
                </button>
            )}
        </div>
    );
}

/**
 * Шаг «Кто нужен» (OfferWhoNeeds старого фронта): пол, возраст, языки с
 * уровнем, сколько мест, откуда принимаются волонтёры, дополнительная
 * информация. Пол и число мест обязательны. «Сохранить» — PATCH howNeeds.
 */
export function WhoNeedsForm({ id, nextHref, labels }: { id: string; nextHref: string; labels: WhoNeedsLabels }) {
    const { state, save } = useVacancy(id);
    if (state.status === "missing") return <p className="mt-10 text-[18px] text-ink-tertiary">{labels.missing}</p>;
    if (state.status === "loading") return <Loading label={labels.loading} className="min-h-[200px]" />;
    return <WhoNeedsEditor id={id} nextHref={nextHref} labels={labels} vacancy={state.vacancy} save={save} />;
}

function WhoNeedsEditor({ id, nextHref, labels, vacancy, save }: {
    id: string;
    nextHref: string;
    labels: WhoNeedsLabels;
    vacancy: Vacancy;
    save: ReturnType<typeof useVacancy>["save"];
}) {
    const [initial] = useState(() => readDraft("who-needs", id, isForm));
    const [form, setForm] = useState<Form>(() => initial ?? whoNeedsFromApi(vacancy.howNeeds));
    const [draftLanguage, setDraftLanguage] = useState<RequiredLanguage>(EMPTY_LANGUAGE);
    const [unsaved, setUnsaved] = useState(!!initial);
    const [submitted, setSubmitted] = useState(false);
    const [busy, setBusy] = useState(false);
    const [toast, setToast] = useState<{ text: string; ok: boolean } | null>(null);

    const set = useCallback((patch: Partial<Form>) => {
        setForm((current) => {
            const next = { ...current, ...patch };
            writeDraft("who-needs", id, next);
            return next;
        });
        setUnsaved(true);
    }, [id]);

    const errors = whoNeedsErrors(form);
    const noLimit = form.ageMax >= AGE_NO_LIMIT;

    const submit = async (event: FormEvent) => {
        event.preventDefault();
        setSubmitted(true);
        if (errors.gender || errors.volunteerPlaces) return;
        setBusy(true);
        setToast(null);
        const error = await save({ howNeeds: whoNeedsToApi(form) }, labels.error);
        setBusy(false);
        if (error) {
            setToast({ text: error, ok: false });
            return;
        }
        clearDraft("who-needs", id);
        setUnsaved(false);
        setToast({ text: labels.saved, ok: true });
    };

    const caption = "font-[Lato] text-[14px] leading-[1.5] font-normal tracking-[0.00938em] text-caption";
    return (
        <form onSubmit={submit} noValidate className="pt-5">
            <Toast text={toast?.text ?? null} ok={toast?.ok} onClose={() => setToast(null)} />
            <div className="flex flex-wrap down-sm:flex-col">
                {GENDERS.map((gender) => (
                    <LabeledSwitch
                        key={gender}
                        labelStyle="lato"
                        label={labels.genders[gender]}
                        checked={form.gender.includes(gender)}
                        onChange={() => set({ gender: form.gender.includes(gender) ? form.gender.filter((item) => item !== gender) : [...form.gender, gender] })}
                    />
                ))}
            </div>
            {submitted && errors.gender && <ErrorText text={labels.required} />}

            <div className="mt-[30px]">
                <p className={caption}>{labels.age}</p>
                <div className="flex items-center gap-3.5 down-lg:gap-[5px]">
                    <NumberInput
                        className="max-w-[150px]"
                        label={`${labels.age}: ${labels.from}`}
                        placeholder={labels.from}
                        value={form.ageMin}
                        onChange={(value) => set(setAgeMin(form, value))}
                        onCommit={() => set(commitAgeMin(form))}
                    />
                    {noLimit ? (
                        <p className="font-[Lato] text-[14px] leading-[1.5] tracking-[0.00938em]">{labels.andOlder}</p>
                    ) : (
                        <NumberInput
                            className="max-w-[150px]"
                            label={`${labels.age}: ${labels.to}`}
                            placeholder={labels.to}
                            value={form.ageMax}
                            onChange={(value) => set({ ageMax: value })}
                            onCommit={() => set(commitAgeMax(form))}
                        />
                    )}
                </div>
                <LabeledSwitch labelStyle="small" label={labels.noAgeLimit} checked={noLimit} onChange={() => set(toggleNoAgeLimit(form))} />
            </div>

            <div className="flex flex-col gap-[30px]">
                <div className="flex flex-col">
                    <LanguageRow
                        value={draftLanguage}
                        onChange={setDraftLanguage}
                        selected={form.languages}
                        isDraft
                        labels={labels}
                    />
                    {form.languages.map((language, index) => (
                        <LanguageRow
                            key={language.language}
                            value={language}
                            selected={form.languages}
                            isDraft={false}
                            labels={labels}
                            onChange={(next) => set({ languages: form.languages.map((item, i) => (i === index ? next : item)) })}
                            onRemove={() => set({ languages: form.languages.filter((_, i) => i !== index) })}
                        />
                    ))}
                    {form.languages.length > 1 && (
                        <div className="mt-3.5 flex flex-wrap gap-x-[30px] gap-y-2.5">
                            <LabeledSwitch tone="mui" labelStyle="lato" label={labels.oneLanguage} checked={!form.needAllLanguages} onChange={() => set({ needAllLanguages: !form.needAllLanguages })} />
                            <LabeledSwitch tone="mui" labelStyle="lato" label={labels.allLanguages} checked={form.needAllLanguages} onChange={() => set({ needAllLanguages: !form.needAllLanguages })} />
                        </div>
                    )}
                </div>
                <div>
                    <button
                        type="button"
                        onClick={() => {
                            const next = addLanguage(form.languages, draftLanguage);
                            if (!next) return;
                            set({ languages: next });
                            setDraftLanguage(EMPTY_LANGUAGE);
                        }}
                        className="group inline-flex cursor-pointer items-center justify-center rounded-[10px] border border-caption bg-primary px-5 py-[15px] text-[14px] leading-[normal] text-white hover:text-black"
                    >
                        <svg aria-hidden viewBox="0 0 14 14" className="mr-2.5 flex h-3.5 w-3.5 fill-white group-hover:fill-black"><path d="M14 6.66667H7.33333V0H6.66667V6.66667H0V7.33333H6.66667V14H7.33333V7.33333H14V6.66667Z" /></svg>
                        {labels.addLanguage}
                    </button>
                </div>
            </div>

            <TextField
                className="mt-[30px] max-w-[300px]"
                type="number"
                inputMode="numeric"
                label={labels.places}
                value={String(form.volunteerPlaces)}
                onChange={(event) => {
                    const value = Number(event.target.value);
                    if (Number.isInteger(value) && value >= 0 && value <= MAX_VOLUNTEER_PLACES) set({ volunteerPlaces: value });
                }}
            />
            {submitted && errors.volunteerPlaces && <ErrorText text={labels.required} />}

            <div className="mt-[30px]">
                <p className="font-[Lato] text-[14px] leading-[14px] font-normal text-caption">{labels.receptionTitle}</p>
                <div className="mt-3.5 flex flex-col gap-2">
                    {RECEPTION.map((place) => (
                        <LabeledSwitch key={place} block labelStyle="lato" label={labels.reception[place]} checked={form.receptionPlace === place} onChange={() => set({ receptionPlace: place })} />
                    ))}
                </div>
            </div>

            <WizardTextarea
                className="mt-[30px] max-w-[620px]"
                label={labels.additionalInfo}
                hint={labels.additionalHint}
                maxLength={ADDITIONAL_INFO_MAX}
                value={form.additionalInfo}
                onChange={(event) => set({ additionalInfo: event.target.value })}
            />

            <WizardActions unsaved={unsaved} busy={busy} nextHref={nextHref} labels={labels} className="pt-10" />
        </form>
    );
}

