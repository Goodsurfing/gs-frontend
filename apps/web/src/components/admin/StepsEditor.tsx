"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import { adminButton, adminButtonPrimary, adminInput } from "@/components/admin/AdminList";
import { Spinner } from "@/components/ui/Spinner";
import { Toast } from "@/components/ui/Toast";
import { type AdminPage, useAdminApi } from "@/lib/admin/api";

/**
 * Правка записи по шагам на вкладках (вакансия, сбор): каждый шаг — свой адрес
 * API админки (`{base}/{step}/{id}`), GET → форма → PATCH. Поля описаны декларативно.
 */

export type Dict = "category" | "skill" | "food" | "house" | "transfer";

export interface StepField {
    key: string;
    label: string;
    kind: "text" | "textarea" | "number" | "bool" | "select" | "multi" | "dict" | "list" | "lines" | "periods";
    options?: { value: string; label: string }[];
    dict?: Dict;
    hint?: string;
}

export interface Step {
    key: string;
    label: string;
    path: string;
    fields: StepField[];
    /** GET → тело PATCH: что API не принимает обратно */
    toBody?: (data: Record<string, unknown>) => Record<string, unknown>;
    /** Поля, которых нет в GET шага, но которые PATCH требует (статус сбора) — дочитываются перед сохранением */
    prepare?: (recordId: string) => Promise<Record<string, unknown>>;
}

type Data = Record<string, unknown>;

function StepEditor({ base, recordId, step }: { base: string; recordId: string; step: Step }) {
    const api = useAdminApi();
    const [data, setData] = useState<Data | null | "error">(null);
    const [dicts, setDicts] = useState<Partial<Record<Dict, { id: number; name: string }[]>>>({});
    const [busy, setBusy] = useState(false);
    const [toast, setToast] = useState<{ text: string; ok: boolean } | null>(null);

    useEffect(() => {
        let cancelled = false;
        api.get<Data>(`${base}/${step.path}/${recordId}`).then((d) => !cancelled && setData(d)).catch(() => !cancelled && setData("error"));
        for (const dict of new Set(step.fields.map((f) => f.dict).filter((d): d is Dict => !!d))) {
            api.get<AdminPage<{ id: number; name: string }>>(dict, { page: 1, limit: 200 })
                .then((r) => !cancelled && setDicts((prev) => ({ ...prev, [dict]: r.data ?? [] })))
                .catch(() => undefined);
        }
        return () => {
            cancelled = true;
        };
    }, [api, step, recordId, base]);

    if (data === null) return <Spinner />;
    if (data === "error") return <p className="text-error">Не удалось загрузить шаг</p>;

    const set = (key: string, value: unknown) => setData({ ...data, [key]: value });
    const toggleIn = (key: string, value: string | number) => {
        const list = Array.isArray(data[key]) ? (data[key] as (string | number)[]) : [];
        set(key, list.includes(value) ? list.filter((v) => v !== value) : [...list, value]);
    };

    const save = async () => {
        setBusy(true);
        try {
            const rest: Data = { ...data };
            delete rest.id;
            // Текст без значения — пустая строка: API отвечает «should not be null» (так же шлёт мастер вакансии)
            for (const f of step.fields) {
                if ((f.kind === "text" || f.kind === "textarea") && (rest[f.key] === null || rest[f.key] === undefined)) rest[f.key] = "";
            }
            const extra = step.prepare ? await step.prepare(recordId) : {};
            await api.patch(`${base}/${step.path}/${recordId}`, { ...(step.toBody ? step.toBody(rest) : rest), ...extra });
            setToast({ text: "Сохранено", ok: true });
        } catch (e) {
            const message = e instanceof Error ? step.fields.reduce((text, f) => text.replaceAll(`${f.key}:`, `${f.label}:`), e.message) : "Не удалось сохранить";
            setToast({ text: message, ok: false });
        } finally {
            setBusy(false);
        }
    };

    return (
        <form
            className="flex flex-col gap-4 rounded-[8px] bg-surface p-4"
            onSubmit={(e) => {
                e.preventDefault();
                void save();
            }}
        >
            {step.fields.map((f) => {
                const value = data[f.key];
                const label = <span className="text-[12px] text-muted">{f.label}</span>;
                const hint = f.hint ? <span className="text-[11px] text-muted">{f.hint}</span> : null;
                switch (f.kind) {
                    case "bool":
                        return <label key={f.key} className="flex items-center gap-2"><input type="checkbox" checked={value === true} onChange={(e) => set(f.key, e.target.checked)} />{f.label}{hint}</label>;
                    case "textarea":
                        return <label key={f.key} className="flex flex-col gap-1">{label}<textarea className={`${adminInput} min-h-[110px]`} value={String(value ?? "")} onChange={(e) => set(f.key, e.target.value)} />{hint}</label>;
                    case "number":
                        return <label key={f.key} className="flex max-w-[260px] flex-col gap-1">{label}<input type="number" step="any" className={adminInput} value={value === null || value === undefined ? "" : String(value)} onChange={(e) => set(f.key, e.target.value === "" ? null : Number(e.target.value))} />{hint}</label>;
                    case "select":
                        return (
                            <label key={f.key} className="flex max-w-[320px] flex-col gap-1">{label}
                                <select className={adminInput} value={String(value ?? "")} onChange={(e) => set(f.key, e.target.value || null)}>
                                    <option value="">—</option>
                                    {f.options?.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
                                </select>
                            </label>
                        );
                    case "multi":
                    case "dict": {
                        const items = f.kind === "dict" ? (dicts[f.dict!] ?? []).map((d) => ({ value: d.id as string | number, label: d.name })) : (f.options ?? []).map((o) => ({ value: o.value as string | number, label: o.label }));
                        const selected = Array.isArray(value) ? (value as (string | number)[]) : [];
                        return (
                            <fieldset key={f.key} className="flex flex-col gap-1">
                                <legend className="mb-1 text-[12px] text-muted">{f.label}</legend>
                                <div className="flex flex-wrap gap-2">
                                    {items.map((item) => (
                                        <label key={String(item.value)} className={`cursor-pointer rounded-full border px-3 py-1 ${selected.includes(item.value) ? "border-primary bg-primary/10" : "border-accent-bg"}`}>
                                            <input type="checkbox" className="sr-only" checked={selected.includes(item.value)} onChange={() => toggleIn(f.key, item.value)} />
                                            {item.label}
                                        </label>
                                    ))}
                                    {f.kind === "dict" && items.length === 0 && <span className="text-muted">загрузка…</span>}
                                </div>
                            </fieldset>
                        );
                    }
                    case "list":
                        return <label key={f.key} className="flex flex-col gap-1">{label}<input className={adminInput} value={Array.isArray(value) ? (value as string[]).join(", ") : ""} onChange={(e) => set(f.key, e.target.value.split(",").map((s) => s.trim()).filter(Boolean))} /><span className="text-[11px] text-muted">через запятую</span></label>;
                    case "lines":
                        return <label key={f.key} className="flex flex-col gap-1">{label}<textarea className={`${adminInput} min-h-[90px]`} value={Array.isArray(value) ? (value as string[]).join("\n") : ""} onChange={(e) => set(f.key, e.target.value.split("\n").map((s) => s.trim()).filter(Boolean))} /></label>;
                    case "periods": {
                        const periods = Array.isArray(value) ? (value as { id: number | null; start: string | null; end: string | null }[]) : [];
                        const update = (i: number, patch: Partial<{ start: string; end: string }>) => set(f.key, periods.map((p, j) => (j === i ? { ...p, ...patch } : p)));
                        return (
                            <fieldset key={f.key} className="flex flex-col gap-2">
                                <legend className="mb-1 text-[12px] text-muted">{f.label} (дд.мм.гггг)</legend>
                                {periods.map((p, i) => (
                                    <div key={p.id ?? `new-${i}`} className="flex flex-wrap items-center gap-2">
                                        <input aria-label={`Начало периода ${i + 1}`} className={`${adminInput} max-w-[150px]`} value={p.start ?? ""} onChange={(e) => update(i, { start: e.target.value })} />
                                        —
                                        <input aria-label={`Конец периода ${i + 1}`} className={`${adminInput} max-w-[150px]`} value={p.end ?? ""} onChange={(e) => update(i, { end: e.target.value })} />
                                        <button type="button" className={adminButton} onClick={() => set(f.key, periods.filter((_, j) => j !== i))}>Убрать</button>
                                    </div>
                                ))}
                                <button type="button" className={`${adminButton} self-start`} onClick={() => set(f.key, [...periods, { id: null, start: "", end: "" }])}>Добавить период</button>
                            </fieldset>
                        );
                    }
                    default:
                        return <label key={f.key} className="flex flex-col gap-1">{label}<input className={adminInput} value={String(value ?? "")} onChange={(e) => set(f.key, e.target.value)} />{hint}</label>;
                }
            })}
            <div><button type="submit" className={adminButtonPrimary} disabled={busy}>Сохранить шаг «{step.label}»</button></div>
            <Toast text={toast?.text ?? null} ok={toast?.ok} onClose={() => setToast(null)} />
        </form>
    );
}

export const opts = (pairs: [string, string][]) => pairs.map(([value, label]) => ({ value, label }));

export function StepsEditor({ base, id, steps, title, back, siteHref }: { base: string; id: string; steps: Step[]; title: string; back: { href: string; label: string }; siteHref?: string }) {
    const [tab, setTab] = useState(steps[0]!.key);
    const step = steps.find((s) => s.key === tab) ?? steps[0]!;
    return (
        <div className="max-w-[1000px]">
            <p className="mb-2"><Link href={back.href} className="text-primary hover:underline">← {back.label}</Link></p>
            <div className="mb-4 flex flex-wrap items-center gap-3">
                <h1 className="text-[22px] font-bold">{title}</h1>
                {siteHref && <a href={siteHref} target="_blank" rel="noreferrer" className="text-primary hover:underline">открыть на сайте</a>}
            </div>
            <div role="tablist" aria-label="Шаги" className="mb-4 flex flex-wrap gap-1">
                {steps.map((s) => (
                    <button key={s.key} type="button" role="tab" aria-selected={s.key === tab} className={`cursor-pointer rounded-[6px] px-3 py-1.5 ${s.key === tab ? "bg-primary text-white" : "bg-surface hover:bg-field"}`} onClick={() => setTab(s.key)}>
                        {s.label}
                    </button>
                ))}
            </div>
            <StepEditor key={step.key} base={base} recordId={id} step={step} />
        </div>
    );
}
