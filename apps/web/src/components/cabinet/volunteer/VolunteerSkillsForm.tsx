"use client";

import type { components } from "@goodsurfing/api";
import { type FormEvent, type SelectHTMLAttributes, useEffect, useId, useState } from "react";

import { blueButton, TextAreaField } from "@/components/form/fields";
import { useSession } from "@/components/session/SessionProvider";
import { Spinner } from "@/components/ui/Spinner";
import { Toast } from "@/components/ui/Toast";
import { browserApi } from "@/lib/browserApi";

type Skill = components["schemas"]["ListResult17"];
type Language = { language: string; languageLevel: string };

interface Draft {
    languages: Language[];
    skills: number[];
    additional: string[];
    extraInfo: string;
}

/** Несохранённая форма живёт до закрытия вкладки (VOLUNTEER_SKILLS_FORM старого фронта, другой формат — свой ключ) */
const DRAFT_KEY = "volunteerSkillsDraft";
const MAX_ITEMS = 10;

export interface VolunteerSkillsLabels {
    languages: string;
    level: string;
    addLanguage: string;
    removeLanguage: string;
    skills: string;
    addSkill: string;
    editSkill: string;
    removeSkill: string;
    extraInfo: string;
    extraInfoHint: string;
    save: string;
    noChanges: string;
    saved: string;
    error: string;
}

const same = (a: Draft, b: Draft) => JSON.stringify(a) === JSON.stringify(b);

/** Выпадающий список как Select MUI старого фронта: рамка #82949F, скругление 10, стрелка ▼ справа */
function Select({ label, options, ...rest }: SelectHTMLAttributes<HTMLSelectElement> & { label?: string; options: { value: string; label: string }[] }) {
    const id = useId();
    return (
        <div className="flex w-full max-w-[405px] flex-col gap-2 max-[567px]:w-[130px]">
            {label ? <label htmlFor={id} className="text-[14px] text-caption">{label}</label> : null}
            <div className="relative">
                <select id={id} aria-label={label ? undefined : rest["aria-label"]} className="box-border h-11 w-full cursor-pointer appearance-none rounded-[10px] border border-caption bg-white py-0 pr-8 pl-3.5 text-label text-black outline-none hover:border-2 hover:px-[13px]" {...rest}>
                    <option value="" disabled hidden />
                    {options.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
                </select>
                <svg aria-hidden viewBox="0 0 24 24" className="pointer-events-none absolute top-1/2 right-[7px] h-6 w-6 -translate-y-1/2 fill-black/54"><path d="M7 10l5 5 5-5z" /></svg>
            </div>
        </div>
    );
}

/** Поле своего навыка (InputWithIcon старого фронта): серый фон, рамка, место под иконку слева */
const FIELD = "box-border max-h-11 rounded-[10px] border border-caption bg-field py-3 pr-5 pl-[42px] text-[16px] leading-[125%] outline-none hover:shadow-[0_0_0_1px_#8494a1] focus:shadow-[0_0_0_1px_#8494a1] down-lg:p-2.5";
const CHECK = "M6.356 14.03 1.615 9.288 0 10.891l6.356 6.357L20 3.603 18.397 2 6.356 14.03Z";
const PLUS = "M14 6.667H7.333V0h-.666v6.667H0v.666h6.667V14h.666V7.333H14z";
const CROSS = "M14 1.41 12.59 0 7 5.59 1.41 0 0 1.41 5.59 7 0 12.59 1.41 14 7 8.41 12.59 14 14 12.59 8.41 7 14 1.41Z";

/** Удалить строку (крестик delete.svg старого фронта): тёмный, при наведении — красный и крупнее */
function RemoveButton({ label, onClick, className = "" }: { label: string; onClick: () => void; className?: string }) {
    return (
        <button type="button" aria-label={label} onClick={onClick} className={`group shrink-0 cursor-pointer transition-transform duration-150 hover:scale-115 ${className}`}>
            <svg aria-hidden viewBox="0 0 14 14" className="block h-[18px] w-[18px] fill-ink transition-colors duration-150 group-hover:fill-error"><path fillRule="evenodd" clipRule="evenodd" d={CROSS} /></svg>
        </button>
    );
}

/** Свой навык: круг с галочкой и поле; двойной щелчок по полю или галочка — правка (EditableInputWithButton старого фронта) */
function OwnSkill({ value, labels, onChange, onRemove }: { value: string; labels: VolunteerSkillsLabels; onChange: (value: string) => void; onRemove: () => void }) {
    const [editing, setEditing] = useState(false);
    const [text, setText] = useState(value);
    const submit = () => {
        if (text && text !== value) onChange(text);
        if (text) setEditing(false);
    };
    return (
        <div className="relative flex gap-5">
            <button
                type="button"
                aria-label={labels.editSkill}
                aria-pressed={editing}
                onClick={() => (editing ? submit() : setEditing(true))}
                className={`flex h-[46px] w-[46px] shrink-0 cursor-pointer items-center justify-center rounded-full border ${editing ? "border-caption bg-caption" : "border-primary bg-primary"}`}
            >
                <svg aria-hidden viewBox="0 0 20 20" className="h-[18px] w-[18px] fill-white"><path fillRule="evenodd" clipRule="evenodd" d={CHECK} /></svg>
            </button>
            <input
                aria-label={labels.editSkill}
                value={text}
                readOnly={!editing}
                onChange={(event) => setText(event.target.value)}
                onDoubleClick={() => setEditing(true)}
                onKeyDown={(event) => {
                    if (event.key === "Enter" || event.key === "Escape") {
                        event.preventDefault();
                        submit();
                    }
                }}
                onBlur={() => editing && submit()}
                // В старом фронте стили поля InputWithIcon перекрывали «нередактируемый» вид — сохранённый навык выглядит как обычное поле
                className={`${FIELD} text-ink-secondary ${editing ? "cursor-text" : "cursor-pointer"}`}
            />
            <RemoveButton label={labels.removeSkill} onClick={onRemove} className="absolute top-[30%] -right-8" />
        </div>
    );
}

/**
 * «Навыки и умения» волонтёра (VolunteerSkillsForm старого фронта): языки с
 * уровнем, навыки из справочника, свои навыки (до 10), дополнительная
 * информация. Сохранение — PATCH /volunteer; без изменений — сообщение, без запроса.
 */
export function VolunteerSkillsForm({ locale, languages, levels, labels }: {
    locale: "ru" | "en" | "es";
    /** Языки и уровни: значение API → подпись */
    languages: { value: string; label: string }[];
    levels: { value: string; label: string }[];
    labels: VolunteerSkillsLabels;
}) {
    const session = useSession();
    const [catalog, setCatalog] = useState<Skill[] | null>(null);
    const [saved, setSaved] = useState<Draft | null>(null);
    const [form, setForm] = useState<Draft | null>(null);
    const [main, setMain] = useState<Language | null>(null);
    const [newSkill, setNewSkill] = useState("");
    const [busy, setBusy] = useState(false);
    const [message, setMessage] = useState<{ text: string; ok: boolean } | null>(null);
    const volunteer = session.profile?.volunteer;

    useEffect(() => {
        if (session.status !== "user") return;
        let cancelled = false;
        void browserApi(session.token).GET("/api/v1/skill", { params: { query: { lang: locale } } })
            .then(({ data }) => !cancelled && setCatalog(Array.isArray(data) ? data : []))
            .catch(() => !cancelled && setCatalog([]));
        return () => {
            cancelled = true;
        };
    }, [session.status, session.token, locale]);

    useEffect(() => {
        if (!volunteer || saved) return;
        const initial: Draft = {
            languages: (volunteer.languages ?? []).map(({ language, languageLevel }) => ({ language, languageLevel })),
            skills: (volunteer.skills ?? []).map((skill) => skill.id),
            additional: volunteer.additionalSkills ?? [],
            extraInfo: volunteer.externalInfo ?? "",
        };
        let draft: Draft | null = null;
        try {
            const raw = window.sessionStorage.getItem(DRAFT_KEY);
            const parsed: unknown = raw ? JSON.parse(raw) : null;
            if (parsed && typeof parsed === "object" && Array.isArray((parsed as Draft).skills)) draft = parsed as Draft;
        } catch {
            draft = null;
        }
        // eslint-disable-next-line react-hooks/set-state-in-effect -- профиль приходит из сессии в браузере
        setSaved(initial);
        setForm(draft ?? initial);
    }, [volunteer, saved]);

    const update = (patch: Partial<Draft>) => {
        if (!form) return;
        const next = { ...form, ...patch };
        setForm(next);
        try {
            window.sessionStorage.setItem(DRAFT_KEY, JSON.stringify(next));
        } catch {
            // хранилище недоступно — черновик не сохраняется
        }
    };

    if (!form || !saved || catalog === null) return <Spinner />;

    const submit = async (event: FormEvent) => {
        event.preventDefault();
        setMessage(null);
        // Ничего не меняли — не отправляем и не пишем «успешно изменены» (аудит 29.10 в старом фронте)
        if (same(form, saved)) {
            setMessage({ text: labels.noChanges, ok: false });
            return;
        }
        setBusy(true);
        const { error } = await browserApi(session.token).PATCH("/api/v1/volunteer", {
            body: {
                languages: form.languages as components["schemas"]["LanguageCommand"][],
                skillIds: form.skills,
                additionalSkills: form.additional,
                externalInfo: form.extraInfo,
            },
        }).catch(() => ({ error: true }));
        setBusy(false);
        if (error) {
            const { detail, message: text } = (typeof error === "object" ? error : {}) as { detail?: unknown; message?: unknown };
            setMessage({ text: typeof detail === "string" ? detail : typeof text === "string" ? text : labels.error, ok: false });
            return;
        }
        setSaved(form);
        try {
            window.sessionStorage.removeItem(DRAFT_KEY);
        } catch {
            // хранилище недоступно
        }
        setMessage({ text: labels.saved, ok: true });
    };

    const languageRow = (value: Language | null, onChange: (value: Language) => void, titled: boolean) => (
        <div className="flex w-full gap-6 max-[567px]:w-auto max-[567px]:gap-2.5">
            <Select
                label={titled ? labels.languages : undefined}
                aria-label={labels.languages}
                options={languages}
                value={value?.language ?? ""}
                // Новый язык — с начальным уровнем (LanguageLevelComponent старого фронта)
                onChange={(event) => onChange({ language: event.target.value, languageLevel: "beginner" })}
            />
            <Select
                label={titled ? labels.level : undefined}
                aria-label={labels.level}
                options={levels}
                value={value?.languageLevel ?? ""}
                onChange={(event) => onChange({ language: value?.language ?? "", languageLevel: event.target.value })}
            />
        </div>
    );
    const mainReady = !!main?.language && !!main.languageLevel;
    const addSkill = () => {
        if (!newSkill || form.additional.length >= MAX_ITEMS) return;
        if (!form.additional.includes(newSkill)) update({ additional: [...form.additional, newSkill] });
        setNewSkill("");
    };

    return (
        <form onSubmit={submit} className="flex w-full flex-col flex-wrap gap-[30px]">
            <Toast text={message?.text ?? null} ok={message?.ok} onClose={() => setMessage(null)} />
            <div className="mt-10 w-full">
                <div className="mb-5 flex w-full items-center gap-2.5 self-start">
                    {languageRow(main, setMain, true)}
                    {mainReady && <RemoveButton label={labels.removeLanguage} onClick={() => setMain(null)} className="m-2.5" />}
                </div>
                <div className="mt-3.5 flex flex-col gap-3.5">
                    {form.languages.map((item, index) => (
                        <div key={index} className="mb-5 flex w-full items-center gap-2.5 self-start">
                            {languageRow(item, (value) => update({ languages: form.languages.map((entry, i) => (i === index ? value : entry)) }), false)}
                            <RemoveButton label={labels.removeLanguage} onClick={() => update({ languages: form.languages.filter((_, i) => i !== index) })} className="m-2.5" />
                        </div>
                    ))}
                </div>
                <button
                    type="button"
                    disabled={!mainReady}
                    onClick={() => {
                        if (!main || form.languages.length > MAX_ITEMS) return;
                        update({ languages: [...form.languages, main] });
                        setMain(null);
                    }}
                    className="group inline-flex cursor-pointer items-center justify-center rounded-[10px] border border-caption bg-primary px-5 py-[15px] text-[14px] text-white hover:text-black disabled:cursor-not-allowed disabled:bg-field disabled:text-caption"
                >
                    <svg aria-hidden viewBox="0 0 14 14" className="mr-2.5 h-3.5 w-3.5 fill-white group-hover:fill-black group-disabled:fill-caption"><path d={PLUS} /></svg>
                    {labels.addLanguage}
                </button>
            </div>
            <span className="text-[14px] text-caption">{labels.skills}</span>
            <div className="flex w-full flex-col flex-wrap gap-[30px]">
                <div className="grid grid-cols-3 gap-[30px] down-md:grid-cols-[repeat(2,minmax(200px,1fr))] max-[600px]:!grid-cols-[minmax(200px,1fr)]">
                    {catalog.map((skill) => {
                        const checked = form.skills.includes(skill.id);
                        return (
                            <button
                                key={skill.id}
                                type="button"
                                aria-pressed={checked}
                                onClick={() => {
                                    if (checked) update({ skills: form.skills.filter((id) => id !== skill.id) });
                                    else if (form.skills.length <= MAX_ITEMS) update({ skills: [...form.skills, skill.id] });
                                }}
                                className="group flex cursor-pointer items-center gap-5 text-left"
                            >
                                <span className={`flex h-[46px] w-[46px] shrink-0 items-center justify-center rounded-full border transition-colors ${checked ? "border-primary bg-primary" : "border-accent-bg bg-accent-bg group-hover:border-caption"}`}>
                                    {/* eslint-disable-next-line @next/next/no-img-element -- иконка навыка из хранилища (серая; выбранная — белая) */}
                                    <img src={skill.imagePath} alt="" className={`h-5 w-5 ${checked ? "brightness-0 invert" : ""}`} />
                                </span>
                                <span className="text-label text-ink-secondary">{skill.name}</span>
                            </button>
                        );
                    })}
                </div>
                <div className="grid grid-cols-[repeat(auto-fit,minmax(330px,1fr))] items-start gap-[30px]">
                    {form.additional.map((skill) => (
                        <OwnSkill
                            key={skill}
                            value={skill}
                            labels={labels}
                            onChange={(text) => update({ additional: form.additional.map((item) => (item === skill ? text : item)) })}
                            onRemove={() => update({ additional: form.additional.filter((item) => item !== skill) })}
                        />
                    ))}
                    <div className="flex gap-5">
                        <button
                            type="button"
                            aria-label={labels.addSkill}
                            disabled={!newSkill}
                            onClick={addSkill}
                            className="flex h-[46px] w-[46px] shrink-0 cursor-pointer items-center justify-center rounded-full border border-accent-bg bg-accent-bg hover:border-caption disabled:cursor-not-allowed"
                        >
                            <svg aria-hidden viewBox="0 0 20 20" className="h-[18px] w-[18px] fill-caption"><path fillRule="evenodd" clipRule="evenodd" d={CHECK} /></svg>
                        </button>
                        <div className="relative">
                            <input
                                aria-label={labels.addSkill}
                                placeholder={labels.addSkill}
                                value={newSkill}
                                onChange={(event) => setNewSkill(event.target.value)}
                                // Как useOnClickOutside в старом InputWithButton: уход с поля добавляет навык
                                onBlur={addSkill}
                                onKeyDown={(event) => {
                                    if (event.key !== "Enter" && event.key !== "Escape") return;
                                    event.preventDefault();
                                    addSkill();
                                }}
                                className={FIELD}
                            />
                            <svg aria-hidden viewBox="0 0 14 14" className="absolute top-1/2 left-5 h-3.5 w-3.5 -translate-y-1/2 fill-black down-lg:hidden"><path d={PLUS} /></svg>
                        </div>
                    </div>
                </div>
            </div>
            {/* +3 px снизу — строчная textarea и <br> в старом Textarea */}
            <TextAreaField className="pb-[3px]" label={labels.extraInfo} description={labels.extraInfoHint} maxLength={1000} value={form.extraInfo} onChange={(event) => update({ extraInfo: event.target.value })} />
            <button type="submit" disabled={busy} className={blueButton}>{labels.save}</button>
        </form>
    );
}
