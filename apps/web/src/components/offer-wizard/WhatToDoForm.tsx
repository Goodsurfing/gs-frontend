"use client";

import { type FormEvent, useCallback, useState } from "react";

import { useSession } from "@/components/session/SessionProvider";
import { Loading } from "@/components/ui/Loading";
import { Toast } from "@/components/ui/Toast";
import type { Locale } from "@/i18n/config";
import { browserApi } from "@/lib/browserApi";
import {
    addExtraSkill, DAY_OFF_OPTIONS, MAX_HOURS, MAX_SKILLS, renameExtraSkill, setHours, setTimeType,
    TIME_TYPES, type TimeType, toggleIn, type WhatToDoForm as Form, whatToDoFromApi, whatToDoToApi,
} from "@/lib/offerWizardFinish";

import { clearDraft, readDraft, writeDraft } from "./draft";
import { Caption, IconToggle, localIcon, MaskImage, OldNumberInput, OldSelect, OldTextarea } from "./FinishParts";
import { apiErrorText, type DictionaryItem, useDictionary, useVacancyElement, type VacancyElement } from "./useVacancy";
import { WizardActions } from "./WizardActions";

export interface WhatToDoLabels {
    skills: string;
    addSkill: string;
    hours: string;
    /** «В неделю», «В день», «В месяц» */
    timeTypes: Record<TimeType, string>;
    daysOff: string;
    extraInfo: string;
    maxChars: string;
    deleteSkill: string;
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
    return !!v && Array.isArray(v.skills) && Array.isArray(v.additionalSkills) && typeof v.hours === "number" && typeof v.externalInfo === "string";
};

/** Свой навык (EditableInputWithButton): синий кружок с галочкой, поле правки, удаление */
function ExtraSkill({ value, onRename, onDelete, label }: { value: string; onRename: (text: string) => void; onDelete: () => void; label: string }) {
    // null — поле не правится, показывается сохранённое значение
    const [text, setText] = useState<string | null>(null);
    return (
        <div className="relative flex items-center gap-5">
            <span className="flex h-[46px] w-[46px] shrink-0 items-center justify-center rounded-full bg-primary text-white">
                <MaskImage src={localIcon("success")} className="h-5 w-5" />
            </span>
            <input
                aria-label={value}
                value={text ?? value}
                onChange={(event) => setText(event.target.value)}
                onBlur={() => {
                    if (text !== null && text !== value) onRename(text);
                    setText(null);
                }}
                onKeyDown={(event) => {
                    if (event.key === "Enter") {
                        event.preventDefault();
                        event.currentTarget.blur();
                    }
                }}
                className="box-border h-11 w-[261px] rounded-[10px] border-2 border-page bg-page px-5 py-[15px] text-[16px] leading-[125%] text-ink-secondary outline-none focus:bg-white"
            />
            <button type="button" aria-label={label} onClick={onDelete} className="flex cursor-pointer text-caption hover:text-ink-secondary">
                <MaskImage src={localIcon("delete")} className="h-5 w-5" />
            </button>
        </div>
    );
}

/** Новый свой навык (InputWithButton): кружок-галочка добавляет, Enter — тоже */
function AddExtraSkill({ onAdd, placeholder }: { onAdd: (text: string) => void; placeholder: string }) {
    const [text, setText] = useState("");
    const add = () => {
        if (!text.trim()) return;
        onAdd(text);
        setText("");
    };
    return (
        <div className="flex items-start gap-5">
            <button
                type="button"
                aria-label={placeholder}
                disabled={!text.trim()}
                onClick={add}
                className="flex h-[46px] w-[46px] shrink-0 cursor-pointer items-center justify-center rounded-full border border-accent-bg bg-accent-bg p-2 text-[rgba(0,0,0,0.26)] enabled:text-caption enabled:hover:border-caption disabled:cursor-default"
            >
                <MaskImage src={localIcon("success")} className="h-5 w-5" />
            </button>
            <div className="relative">
                <input
                    aria-label={placeholder}
                    value={text}
                    placeholder={placeholder}
                    onChange={(event) => setText(event.target.value)}
                    onKeyDown={(event) => {
                        if (event.key === "Enter") {
                            event.preventDefault();
                            add();
                        }
                    }}
                    className="box-border h-11 w-[261px] rounded-[10px] border border-caption bg-field py-3 pr-5 pl-[42px] text-[16px] leading-[20px] text-black outline-none placeholder:text-[#757575]"
                />
            </div>
        </div>
    );
}

function SkillsPicker({ skills, value, onChange }: { skills: DictionaryItem[]; value: number[]; onChange: (value: number[]) => void }) {
    return (
        <div className="grid grid-cols-3 grid-rows-5 gap-[30px] down-md:grid-cols-[repeat(2,minmax(200px,1fr))] [@media(max-width:600px)]:grid-cols-[minmax(200px,1fr)]">
            {skills.map((skill) => (
                <IconToggle
                    key={skill.id}
                    checked={value.includes(skill.id)}
                    onToggle={() => onChange(toggleIn(value, skill.id, MAX_SKILLS))}
                    text={skill.name}
                    icon={<MaskImage src={skill.imagePath} className="h-5 w-5" />}
                />
            ))}
        </div>
    );
}

/**
 * Шаг «Что делать» (OfferWhatToDo старого фронта): навыки из справочника и
 * свои, рабочие часы за день/неделю/месяц, выходные, дополнительная
 * информация. «Сохранить» — PATCH /api/v1/vacancy/what-to-do/{id}.
 */
export function WhatToDoForm({ id, locale, nextHref, labels }: { id: string; locale: Locale; nextHref: string; labels: WhatToDoLabels }) {
    const state = useVacancyElement(id);
    if (state.status === "missing") return <p className="mt-10 text-[18px] text-ink-tertiary">{labels.missing}</p>;
    if (state.status === "loading") return <Loading label={labels.loading} className="min-h-[200px]" />;
    return <WhatToDoEditor id={id} locale={locale} nextHref={nextHref} labels={labels} vacancy={state.vacancy} />;
}

function WhatToDoEditor({ id, locale, nextHref, labels, vacancy }: { id: string; locale: Locale; nextHref: string; labels: WhatToDoLabels; vacancy: VacancyElement }) {
    const session = useSession();
    const skills = useDictionary("/api/v1/skill", locale);
    const [initial] = useState(() => readDraft("what-to-do", id, isForm));
    const [form, setForm] = useState<Form>(() => initial ?? whatToDoFromApi(vacancy.whatToDo));
    const [unsaved, setUnsaved] = useState(!!initial);
    const [busy, setBusy] = useState(false);
    const [toast, setToast] = useState<{ text: string; ok: boolean } | null>(null);

    // Без изменений (отказ по лимиту, уход из поля без правки) — не «несохранённые изменения»
    const update = useCallback((next: Form) => {
        if (JSON.stringify(next) === JSON.stringify(form)) return;
        setForm(next);
        setUnsaved(true);
        writeDraft("what-to-do", id, next);
    }, [id, form]);

    const submit = async (event: FormEvent) => {
        event.preventDefault();
        setBusy(true);
        setToast(null);
        const result = await browserApi(session.token)
            .PATCH("/api/v1/vacancy/what-to-do/{id}", { params: { path: { id: Number(id) } }, body: whatToDoToApi(form) })
            .catch(() => null);
        setBusy(false);
        if (!result || result.error || !result.response.ok) {
            setToast({ text: apiErrorText(result?.error, labels.error), ok: false });
            return;
        }
        clearDraft("what-to-do", id);
        setUnsaved(false);
        setToast({ text: labels.saved, ok: true });
    };

    return (
        <form onSubmit={submit} noValidate className="mt-[30px] flex flex-col gap-[30px]">
            <Toast text={toast?.text ?? null} ok={toast?.ok} onClose={() => setToast(null)} />
            <Caption className="text-[16px] leading-[normal]">{labels.skills}</Caption>
            <div className="flex w-full flex-col flex-wrap gap-[30px]">
                {skills === null ? <Loading label={labels.loading} className="min-h-[100px]" /> : (
                    <SkillsPicker skills={skills} value={form.skills} onChange={(value) => update({ ...form, skills: value })} />
                )}
                <div className="grid grid-cols-[repeat(auto-fit,minmax(330px,1fr))] items-start gap-[30px]">
                    {form.additionalSkills.map((skill, index) => (
                        <ExtraSkill
                            // Ключ — позиция: переименование при уходе из поля не пересоздаёт строку под курсором
                            key={index}
                            value={skill}
                            label={labels.deleteSkill}
                            onRename={(text) => update({ ...form, additionalSkills: renameExtraSkill(form.additionalSkills, index, text) })}
                            onDelete={() => update({ ...form, additionalSkills: form.additionalSkills.filter((_, i) => i !== index) })}
                        />
                    ))}
                    <AddExtraSkill placeholder={labels.addSkill} onAdd={(text) => update({ ...form, additionalSkills: addExtraSkill(form.additionalSkills, text) })} />
                </div>
            </div>
            <div className="flex flex-wrap items-end gap-[30px]">
                <div className="flex flex-col gap-2">
                    <Caption>{labels.hours}</Caption>
                    <div className="flex max-w-[307px] items-end gap-3.5">
                        <OldNumberInput
                            min={0}
                            max={MAX_HOURS[form.timeType]}
                            labelHidden={labels.hours}
                            value={form.hours}
                            onText={(text) => update(setHours(form, text))}
                            className="w-[83px] shrink-0"
                        />
                        <OldSelect aria-label={labels.hours} value={form.timeType} onChange={(event) => update(setTimeType(form, event.target.value as TimeType))} className="w-[210px]">
                            {TIME_TYPES.map((type) => <option key={type} value={type}>{labels.timeTypes[type]}</option>)}
                        </OldSelect>
                    </div>
                </div>
                <div className="flex w-[245px] flex-col gap-2">
                    <Caption>{labels.daysOff}</Caption>
                    <OldSelect aria-label={labels.daysOff} value={String(form.dayOff)} onChange={(event) => update({ ...form, dayOff: Number(event.target.value) })} className="w-full">
                        {DAY_OFF_OPTIONS.map((day) => <option key={day} value={day}>{day}</option>)}
                    </OldSelect>
                </div>
            </div>
            <OldTextarea label={labels.extraInfo} description={labels.maxChars} maxLength={1000} value={form.externalInfo} onChange={(event) => update({ ...form, externalInfo: event.target.value })} />
            <WizardActions unsaved={unsaved} busy={busy} nextHref={nextHref} labels={labels} className="pt-[60px]" />
        </form>
    );
}
