"use client";

import { type FormEvent, useCallback, useState } from "react";

import { Loading } from "@/components/ui/Loading";
import { Toast } from "@/components/ui/Toast";
import type { Locale } from "@/i18n/config";
import {
    type Day, durationLabel, type DurationWords, MAX_PERIODS, type Period, setDurationFrom, setDurationTo,
    setPeriodEnd, setPeriodStart, today, toggleLastMoment, toggleNoEndDate, type WhenForm as Form, whenFormFromApi, whenFormToApi,
} from "@/lib/offerWizard";

import { DateField } from "./DateField";
import { clearDraft, readDraft, writeDraft } from "./draft";
import { DurationSlider } from "./DurationSlider";
import { LabeledSwitch } from "./LabeledSwitch";
import { useVacancy, type Vacancy } from "./useVacancy";
import { WizardActions } from "./WizardActions";

export interface WhenLabels {
    addPeriod: string;
    fullYear: string;
    lastMoment: string;
    duration: string;
    from: string;
    to: string;
    endDate: string;
    noEndDate: string;
    periodStart: string;
    periodEnd: string;
    removePeriod: string;
    notSet: string;
    words: DurationWords;
    marks: { value: number; label: string }[];
    saved: string;
    error: string;
    save: string;
    next: string;
    unsaved: string;
    loading: string;
    missing: string;
}

interface Draft { form: Form; temp: Period }

const isDraft = (value: unknown): value is Draft => {
    const v = value as Draft | null;
    return !!v && !!v.form && Array.isArray(v.form.periods) && Array.isArray(v.form.duration) && !!v.temp;
};

const EMPTY: Period = { start: null, end: null };

/** Пара полей «с — по» и крестик (DateInputs старого фронта); крестик виден, когда есть что убрать */
function PeriodRow({ period, onChange, onRemove, removable, locale, labels, now }: {
    period: Period;
    onChange: (period: Period) => void;
    onRemove: () => void;
    removable: boolean;
    locale: Locale;
    labels: WhenLabels;
    now: Day;
}) {
    return (
        <div className="flex w-fit items-center">
            <DateField shape="left" value={period.start} onChange={(day) => onChange(setPeriodStart(period, day))} label={labels.periodStart} placeholder={labels.notSet} locale={locale} />
            <DateField
                shape="right"
                value={period.end}
                min={now}
                onChange={(day) => onChange(setPeriodEnd(period, day, now))}
                label={labels.periodEnd}
                placeholder={labels.notSet}
                locale={locale}
                calendarClass="left-[5%] down-lg:right-[-20%] down-lg:left-auto"
            />
            <button
                type="button"
                aria-label={labels.removePeriod}
                tabIndex={removable ? 0 : -1}
                onClick={(event) => {
                    event.preventDefault();
                    if (removable) onRemove();
                }}
                className={`ml-3 inline-flex items-center justify-center rounded-[2px] px-2.5 py-1.5 font-[sans-serif] text-[13.3333px] text-black select-none hover:bg-[rgb(236,233,233)] ${removable ? "cursor-pointer opacity-100" : "cursor-default opacity-0"}`}
            >
                ✖
            </button>
        </div>
    );
}

/** Число в поле срока: свободный ввод, в форму попадает только допустимое значение, при уходе из поля — как в форме */
function DurationInput({ value, onCommit, placeholder, label }: { value: number; onCommit: (value: number) => void; placeholder: string; label: string }) {
    const [text, setText] = useState<string | null>(null);
    return (
        <div className="flex max-w-[125px]">
            <input
                type="number"
                inputMode="numeric"
                aria-label={label}
                value={text ?? String(value)}
                placeholder={placeholder}
                onChange={(event) => {
                    setText(event.target.value);
                    if (event.target.value !== "") onCommit(Number(event.target.value));
                }}
                onBlur={() => setText(null)}
                className="box-border h-11 w-full rounded-[10px] border border-[#82949F] bg-white p-3.5 font-[Lato] text-[16px] leading-[normal] text-black outline-none"
            />
        </div>
    );
}

/**
 * Шаг «Когда» (OfferWhen старого фронта): периоды приёма (до пяти) или круглый
 * год, «последний момент», срок участия от–до (1–190 дней), дата окончания
 * приёма заявок. «Сохранить» — PATCH when, «Дальше» — на «Кто нужен».
 */
export function WhenForm({ id, locale, nextHref, labels }: { id: string; locale: Locale; nextHref: string; labels: WhenLabels }) {
    const { state, save } = useVacancy(id);
    if (state.status === "missing") return <p className="mt-10 text-[18px] text-ink-tertiary">{labels.missing}</p>;
    if (state.status === "loading") return <Loading label={labels.loading} className="min-h-[200px]" />;
    return <WhenEditor id={id} locale={locale} nextHref={nextHref} labels={labels} vacancy={state.vacancy} save={save} />;
}

/** Форма монтируется, когда вакансия уже загружена: начальное значение — несохранённые правки или блок «Когда» вакансии */
function WhenEditor({ id, locale, nextHref, labels, vacancy, save }: {
    id: string;
    locale: Locale;
    nextHref: string;
    labels: WhenLabels;
    vacancy: Vacancy;
    save: ReturnType<typeof useVacancy>["save"];
}) {
    const [now] = useState(today);
    const [initial] = useState(() => readDraft("when", id, isDraft));
    const [draft, setDraft] = useState<Draft>(() => initial ?? { form: whenFormFromApi(vacancy.when, now), temp: EMPTY });
    const [unsaved, setUnsaved] = useState(!!initial);
    const [busy, setBusy] = useState(false);
    const [toast, setToast] = useState<{ text: string; ok: boolean } | null>(null);

    const update = useCallback((next: Draft) => {
        setDraft(next);
        setUnsaved(true);
        writeDraft("when", id, next);
    }, [id]);

    const { form, temp } = draft;
    const set = (patch: Partial<Form>) => update({ form: { ...form, ...patch }, temp });
    const format = (value: number) => durationLabel(value, labels.words);

    const submit = async (event: FormEvent) => {
        event.preventDefault();
        setBusy(true);
        setToast(null);
        const error = await save({ when: whenFormToApi(form, temp) }, labels.error);
        setBusy(false);
        if (error) {
            setToast({ text: error, ok: false });
            return;
        }
        clearDraft("when", id);
        setUnsaved(false);
        setToast({ text: labels.saved, ok: true });
        // Сохранённый незаконченный период становится обычным
        setDraft({ form: { ...form, periods: whenFormToApi(form, temp).periods.map((period) => ({ start: period.start, end: period.ending })) }, temp: EMPTY });
    };

    const addPeriod = () => {
        if (!temp.start || !temp.end || form.periods.length >= MAX_PERIODS) return;
        update({ form: { ...form, periods: [...form.periods, temp] }, temp: EMPTY });
    };

    return (
        <form onSubmit={submit} noValidate className="mt-10 max-w-[1280px]">
            <Toast text={toast?.text ?? null} ok={toast?.ok} onClose={() => setToast(null)} />
            {!form.isFullYearAcceptable && (
                <div className="flex flex-wrap gap-x-1.5 gap-y-[15px]">
                    <div className="flex flex-col gap-3">
                        {form.periods.map((period, index) => (
                            <PeriodRow
                                key={index}
                                period={period}
                                now={now}
                                removable
                                locale={locale}
                                labels={labels}
                                onChange={(next) => set({ periods: form.periods.map((item, i) => (i === index ? next : item)) })}
                                onRemove={() => set({ periods: form.periods.filter((_, i) => i !== index) })}
                            />
                        ))}
                        <PeriodRow
                            period={temp}
                            now={now}
                            removable={!!(temp.start || temp.end)}
                            locale={locale}
                            labels={labels}
                            onChange={(next) => update({ form, temp: next })}
                            onRemove={() => update({ form, temp: EMPTY })}
                        />
                    </div>
                    <div>
                        <button type="button" onClick={addPeriod} className="group inline-flex cursor-pointer items-center justify-center rounded-[10px] border border-caption bg-primary px-5 py-[15px] text-[14px] leading-[normal] text-white hover:text-black">
                            <svg aria-hidden viewBox="0 0 14 14" className="mr-2.5 flex h-3.5 w-3.5 fill-white group-hover:fill-black"><path d="M14 6.66667H7.33333V0H6.66667V6.66667H0V7.33333H6.66667V14H7.33333V7.33333H14V6.66667Z" /></svg>
                            {labels.addPeriod}
                        </button>
                    </div>
                </div>
            )}
            <div className="mt-[30px] flex flex-wrap">
                <LabeledSwitch checked={form.isFullYearAcceptable} onChange={() => set({ isFullYearAcceptable: !form.isFullYearAcceptable })} label={labels.fullYear} />
                <LabeledSwitch checked={form.isApplicableAtTheEnd} onChange={() => update({ form: toggleLastMoment(form), temp })} label={labels.lastMoment} />
            </div>
            <div className="mt-[33px] flex flex-col">
                <p className="font-[Roboto,Helvetica,Arial,sans-serif] text-[14px] leading-[1.5] tracking-[0.00938em] text-caption">{labels.duration}</p>
                <div className="flex items-center gap-2.5">
                    <DurationInput value={form.duration[0]} onCommit={(value) => set({ duration: setDurationFrom(form.duration, value) })} placeholder={labels.from} label={`${labels.duration}: ${labels.from}`} />
                    —
                    <DurationInput value={form.duration[1]} onCommit={(value) => set({ duration: setDurationTo(form.duration, value) })} placeholder={labels.to} label={`${labels.duration}: ${labels.to}`} />
                </div>
                <div className="flex w-full flex-col p-5">
                    <DurationSlider value={form.duration} onChange={(duration) => set({ duration })} marks={labels.marks} format={format} labels={[`${labels.duration}: ${labels.from}`, `${labels.duration}: ${labels.to}`]} />
                </div>
            </div>
            <div className="mt-[30px]">
                <p className="font-[Roboto,Helvetica,Arial,sans-serif] text-[14px] leading-[1.5] tracking-[0.00938em] text-caption">{labels.endDate}</p>
                <div className="mt-2 flex flex-wrap items-center gap-x-[60px] gap-y-[15px]">
                    <DateField
                        value={form.applicationEndDate}
                        disabled={form.isWithoutApplicationDate}
                        onChange={(day) => {
                            if (!form.isWithoutApplicationDate) set({ applicationEndDate: day });
                        }}
                        label={labels.endDate}
                        placeholder={labels.notSet}
                        locale={locale}
                    />
                    <LabeledSwitch checked={form.isWithoutApplicationDate} onChange={() => update({ form: toggleNoEndDate(form, now), temp })} label={labels.noEndDate} />
                </div>
            </div>
            <WizardActions unsaved={unsaved} busy={busy} nextHref={nextHref} labels={labels} className="pt-5" widePadding />
        </form>
    );
}
