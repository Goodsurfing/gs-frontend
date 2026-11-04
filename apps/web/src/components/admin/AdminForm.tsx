"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { type ReactNode, useEffect, useState } from "react";

import { adminButtonPrimary, adminInput } from "@/components/admin/AdminList";
import { Spinner } from "@/components/ui/Spinner";
import { Toast } from "@/components/ui/Toast";
import { useAdminApi } from "@/lib/admin/api";

// unknown — для полей со своей отрисовкой (списки id, HTML, автор)
export type AdminFieldValue = string | number | boolean | File | null | unknown;

export interface AdminField {
    key: string;
    label: string;
    type?: "text" | "textarea" | "number" | "color" | "image" | "checkbox" | "select" | "date" | "custom";
    options?: { value: string; label: string }[];
    required?: boolean;
    /** Подсказка под полем */
    hint?: string;
    /** Для картинки — откуда взять адрес текущей (imagePath и т. п.) */
    preview?: (record: Record<string, unknown>) => string | null | undefined;
    /** type "custom": начальное значение из записи и отрисовка поля */
    initial?: (record: Record<string, unknown> | null) => unknown;
    render?: (value: unknown, set: (value: unknown) => void, record: Record<string, unknown> | null) => ReactNode;
    /** Во всю ширину формы */
    wide?: boolean;
}

export interface AdminFormConfig {
    title: (record: Record<string, unknown> | null) => string;
    back: { href: string; label: string };
    /** Адрес записи для чтения; без него — только создание */
    load?: (id: string) => string;
    fields: AdminField[];
    /** "json" — тело JSON, "form" — multipart (справочники с картинкой) */
    format: "json" | "form";
    create: { method: "POST"; path: string };
    update: (id: string) => { method: "POST" | "PATCH"; path: string };
    /** Подготовка тела из значений формы (по умолчанию — как есть) */
    toBody?: (values: Record<string, AdminFieldValue>, record: Record<string, unknown> | null) => Record<string, unknown>;
    /** Куда перейти после создания */
    afterCreate?: (response: unknown) => string;
    /** Дополнительные блоки под формой (только у существующей записи) */
    extra?: (record: Record<string, unknown>, reload: () => void) => ReactNode;
}

const initialValue = (field: AdminField, record: Record<string, unknown> | null): AdminFieldValue => {
    if (field.initial) return field.initial(record);
    const raw = record?.[field.key];
    if (field.type === "image") return null;
    if (field.type === "checkbox") return raw === true;
    // Пустой цвет в базе (так бывает у старых категорий блога) API при сохранении не примет — начинаем с чёрного
    if (raw === undefined || raw === null || (field.type === "color" && raw === "")) return field.type === "color" ? "#000000" : "";
    return typeof raw === "number" || typeof raw === "string" || typeof raw === "boolean" ? raw : String(raw);
};

/**
 * Карточка или создание записи раздела админки по конфигу: читает запись,
 * показывает поля, сохраняет JSON или multipart. id = "create" — новая запись.
 */
export function AdminForm({ config, id }: { config: AdminFormConfig; id: string }) {
    const api = useAdminApi();
    const router = useRouter();
    const isNew = id === "create" || !config.load;
    const [record, setRecord] = useState<Record<string, unknown> | null | "error">(isNew ? null : null);
    const [loaded, setLoaded] = useState(isNew);
    const [values, setValues] = useState<Record<string, AdminFieldValue>>(() => Object.fromEntries(config.fields.map((f) => [f.key, initialValue(f, null)])));
    const [busy, setBusy] = useState(false);
    const [toast, setToast] = useState<{ text: string; ok: boolean } | null>(null);
    const [version, setVersion] = useState(0);

    useEffect(() => {
        if (isNew || !config.load) return;
        let cancelled = false;
        api.get<Record<string, unknown>>(config.load(id))
            .then((r) => {
                if (cancelled) return;
                setRecord(r);
                setValues(Object.fromEntries(config.fields.map((f) => [f.key, initialValue(f, r)])));
                setLoaded(true);
            })
            .catch(() => {
                if (cancelled) return;
                setRecord("error");
                setLoaded(true);
            });
        return () => {
            cancelled = true;
        };
    }, [api, config, id, isNew, version]);

    if (!loaded) return <Spinner />;
    if (record === "error") return <p className="text-error">Запись не найдена или ошибка загрузки</p>;

    const submit = async () => {
        setBusy(true);
        try {
            const prepared = config.toBody ? config.toBody(values, record) : values;
            const target = isNew ? config.create : config.update(id);
            let body: unknown = prepared;
            if (config.format === "form") {
                const form = new FormData();
                for (const [key, value] of Object.entries(prepared)) {
                    if (value === null || value === undefined) continue;
                    if (value instanceof File) form.append(key, value);
                    else form.append(key, typeof value === "boolean" ? (value ? "1" : "0") : String(value));
                }
                body = form;
            }
            const response = body instanceof FormData
                ? await api.postForm(target.path, body)
                : target.method === "PATCH" ? await api.patch(target.path, body) : await api.post(target.path, body);
            setToast({ text: isNew ? "Создано" : "Сохранено", ok: true });
            if (isNew) router.push(config.afterCreate?.(response) ?? config.back.href);
            else setVersion((v) => v + 1);
        } catch (e) {
            // Ключи полей в ошибке проверки API → подписи формы
            const message = e instanceof Error ? config.fields.reduce((text, f) => text.replaceAll(`${f.key}Id:`, `${f.label}:`).replaceAll(`${f.key}:`, `${f.label}:`), e.message) : "Не удалось сохранить";
            setToast({ text: message, ok: false });
        } finally {
            setBusy(false);
        }
    };

    const set = (key: string, value: AdminFieldValue) => setValues((v) => ({ ...v, [key]: value }));

    return (
        <div className="max-w-[900px]">
            <p className="mb-2"><Link href={config.back.href} className="text-primary hover:underline">← {config.back.label}</Link></p>
            <h1 className="mb-4 text-[22px] font-bold">{config.title(isNew ? null : record)}</h1>
            <form
                className="mb-5 grid grid-cols-2 gap-3 rounded-[8px] bg-surface p-4 down-md:grid-cols-1"
                onSubmit={(e) => {
                    e.preventDefault();
                    void submit();
                }}
            >
                {config.fields.map((field) => {
                    const value = values[field.key];
                    const wide = field.wide || field.type === "textarea" || field.type === "image";
                    if (field.type === "custom" && field.render) {
                        return (
                            <div key={field.key} className={`flex flex-col gap-1 ${wide ? "col-span-2 down-md:col-span-1" : ""}`}>
                                <span className="text-[12px] text-muted">{field.label}{field.required ? " *" : ""}</span>
                                {field.render(value, (v) => set(field.key, v), record)}
                                {field.hint && <span className="text-[11px] text-muted">{field.hint}</span>}
                            </div>
                        );
                    }
                    const label = `${field.label}${field.required ? " *" : ""}`;
                    if (field.type === "checkbox") {
                        return (
                            <label key={field.key} className="flex items-center gap-2">
                                <input type="checkbox" checked={value === true} onChange={(e) => set(field.key, e.target.checked)} />
                                {label}
                            </label>
                        );
                    }
                    return (
                        <label key={field.key} className={`flex flex-col gap-1 text-[12px] text-muted ${wide ? "col-span-2 down-md:col-span-1" : ""}`}>
                            {label}
                            {field.type === "textarea" ? (
                                <textarea className={`${adminInput} min-h-[120px]`} required={field.required} value={String(value ?? "")} onChange={(e) => set(field.key, e.target.value)} />
                            ) : field.type === "select" ? (
                                <select className={adminInput} required={field.required} value={String(value ?? "")} onChange={(e) => set(field.key, e.target.value)}>
                                    <option value="">—</option>
                                    {field.options?.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
                                </select>
                            ) : field.type === "image" ? (
                                <span className="flex items-center gap-4">
                                    {(() => {
                                        const src = value instanceof File ? URL.createObjectURL(value) : record ? field.preview?.(record) : null;
                                        // eslint-disable-next-line @next/next/no-img-element -- превью загружаемой картинки, размер мал
                                        return src ? <img src={src} alt="" loading="eager" width={72} height={72} className="size-[72px] rounded-[6px] bg-field object-contain" /> : <span className="flex size-[72px] items-center justify-center rounded-[6px] bg-field text-[11px]">нет</span>;
                                    })()}
                                    <input type="file" accept="image/*" required={field.required && isNew} onChange={(e) => set(field.key, e.target.files?.[0] ?? null)} />
                                </span>
                            ) : (
                                <input
                                    className={field.type === "color" ? "h-[38px] w-[80px] cursor-pointer rounded-[6px] border border-accent-bg" : adminInput}
                                    type={field.type === "number" ? "number" : field.type === "color" ? "color" : field.type === "date" ? "date" : "text"}
                                    required={field.required}
                                    value={String(value ?? "")}
                                    onChange={(e) => set(field.key, field.type === "number" ? (e.target.value === "" ? null : Number(e.target.value)) : e.target.value)}
                                />
                            )}
                            {field.hint && <span className="text-[11px]">{field.hint}</span>}
                        </label>
                    );
                })}
                <div className="col-span-2 down-md:col-span-1">
                    <button type="submit" className={adminButtonPrimary} disabled={busy}>{isNew ? "Создать" : "Сохранить"}</button>
                </div>
            </form>
            {!isNew && record && config.extra?.(record, () => setVersion((v) => v + 1))}
            <Toast text={toast?.text ?? null} ok={toast?.ok} onClose={() => setToast(null)} />
        </div>
    );
}
