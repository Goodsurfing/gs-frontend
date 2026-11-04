"use client";

import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { type ReactNode, useCallback, useEffect, useMemo, useState } from "react";

import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { Spinner } from "@/components/ui/Spinner";
import { Toast } from "@/components/ui/Toast";
import { type AdminPage, type AdminQuery, useAdminApi } from "@/lib/admin/api";
import { pageItems } from "@/lib/pagination";

export interface AdminColumn<T> {
    label: string;
    cell: (row: T) => ReactNode;
    className?: string;
}

export interface AdminFilter {
    /** Параметр запроса API (email, firstName, status…) */
    key: string;
    label: string;
    options?: { value: string; label: string }[];
}

export interface AdminListConfig<T> {
    title: string;
    /** Адрес списка в API админки: "user", "organization", "feedback/" */
    path: string;
    rowKey: (row: T) => string;
    columns: AdminColumn<T>[];
    rowHref?: (row: T) => string;
    createHref?: string;
    filters?: AdminFilter[];
    sorts?: { value: string; label: string }[];
    defaultSort?: string;
    limit?: number;
    /** Удаление строки: адрес в API и что спросить */
    remove?: { path: (row: T) => string; confirm: (row: T) => string };
    /** Дополнительные кнопки строки (переключатели и т. п.); reload — перечитать список */
    actions?: (row: T, ctx: AdminRowContext) => ReactNode;
    /** Список без пагинации в API (справочники) — ответ массивом */
    plain?: boolean;
    /** Над таблицей (сводка, пояснение) */
    header?: ReactNode;
}

export interface AdminRowContext {
    reload: () => void;
    notify: (text: string, ok?: boolean) => void;
    api: ReturnType<typeof useAdminApi>;
}

export const adminButton = "inline-flex cursor-pointer items-center justify-center rounded-[6px] border border-primary px-3 py-1.5 text-primary hover:bg-primary hover:text-white disabled:cursor-default disabled:opacity-50";
export const adminButtonPrimary = "inline-flex cursor-pointer items-center justify-center rounded-[6px] bg-primary px-4 py-2 text-white hover:bg-primary-hover disabled:cursor-default disabled:opacity-50";
export const adminButtonDanger = "inline-flex cursor-pointer items-center justify-center rounded-[6px] border border-error px-3 py-1.5 text-error hover:bg-error hover:text-white disabled:cursor-default disabled:opacity-50";
export const adminInput = "w-full rounded-[6px] border border-accent-bg bg-surface px-3 py-2 text-[14px] text-ink outline-none focus:border-primary";

/** Да/нет в таблице */
export function YesNo({ value }: { value: boolean | null | undefined }) {
    return value
        ? <span className="rounded-full bg-status-accepted/40 px-2 py-0.5 text-[12px]">да</span>
        : <span className="rounded-full bg-accent-bg px-2 py-0.5 text-[12px] text-muted">нет</span>;
}

const toQuery = (params: URLSearchParams): AdminQuery => Object.fromEntries(params.entries());

/**
 * Список раздела админки по конфигу: фильтры, сортировка, пагинация (состояние —
 * в адресе страницы, «Назад» работает), удаление с подтверждением, состояния
 * загрузки, ошибки и пустого списка.
 */
export function AdminList<T>({ config }: { config: AdminListConfig<T> }) {
    const api = useAdminApi();
    const router = useRouter();
    const pathname = usePathname();
    const search = useSearchParams();
    const limit = config.limit ?? 30;
    const page = Math.max(1, Number(search.get("page")) || 1);
    const sort = search.get("sort") ?? config.defaultSort;

    const [version, setVersion] = useState(0);
    // Ответ помнит, на какой запрос он пришёл: пока ключ не совпал — идёт загрузка
    const requestKey = `${config.path}?${search.toString()}#${version}`;
    const [result, setResult] = useState<{ key: string; status: "ok" | "error"; rows: T[]; total: number; error?: string } | null>(null);
    const state = result && result.key === requestKey ? result : { status: "loading" as const, rows: [] as T[], total: result?.total ?? 0, error: undefined };
    const [toast, setToast] = useState<{ text: string; ok: boolean } | null>(null);
    const [toRemove, setToRemove] = useState<T | null>(null);
    const [busy, setBusy] = useState(false);
    const filterValues = useMemo(() => Object.fromEntries((config.filters ?? []).map((f) => [f.key, search.get(f.key) ?? ""])), [config.filters, search]);
    // Черновик фильтров сбрасывается к значениям из адреса, когда адрес меняется
    const [draftState, setDraftState] = useState<{ for: string; values: Record<string, string> } | null>(null);
    const draft = draftState && draftState.for === search.toString() ? draftState.values : filterValues;
    const setDraft = (update: (d: Record<string, string>) => Record<string, string>) => setDraftState({ for: search.toString(), values: update(draft) });

    const reload = useCallback(() => setVersion((v) => v + 1), []);
    const notify = useCallback((text: string, ok = false) => setToast({ text, ok }), []);

    useEffect(() => {
        let cancelled = false;
        const query = { ...toQuery(search), page, limit, sort };
        api.get<AdminPage<T> | T[]>(config.path, config.plain ? undefined : query)
            .then((res) => {
                if (cancelled) return;
                if (Array.isArray(res)) setResult({ key: requestKey, status: "ok", rows: res, total: res.length });
                else setResult({ key: requestKey, status: "ok", rows: res.data ?? [], total: res.pagination?.total ?? res.data?.length ?? 0 });
            })
            .catch((e: unknown) => !cancelled && setResult({ key: requestKey, status: "error", rows: [], total: 0, error: e instanceof Error ? e.message : "Ошибка" }));
        return () => {
            cancelled = true;
        };
    }, [api, config.path, config.plain, search, page, limit, sort, requestKey]);

    const setParams = (changes: Record<string, string | undefined>) => {
        const next = new URLSearchParams(search);
        for (const [key, value] of Object.entries(changes)) {
            if (value) next.set(key, value);
            else next.delete(key);
        }
        const s = next.toString();
        router.replace(s ? `${pathname}?${s}` : pathname);
    };

    const pages = config.plain ? 1 : Math.max(1, Math.ceil(state.total / limit));

    const remove = async () => {
        if (!toRemove || !config.remove) return;
        setBusy(true);
        try {
            await api.del(config.remove.path(toRemove));
            notify("Удалено", true);
            reload();
        } catch (e) {
            notify(e instanceof Error ? e.message : "Не удалось удалить");
        } finally {
            setBusy(false);
            setToRemove(null);
        }
    };

    return (
        <section>
            <div className="mb-4 flex flex-wrap items-center gap-3">
                <h1 className="text-[22px] font-bold">{config.title}</h1>
                {state.status === "ok" && !config.plain && <span className="text-muted">всего {state.total.toLocaleString("ru-RU")}</span>}
                {config.createHref && <Link href={config.createHref} className={`${adminButtonPrimary} ml-auto`}>Добавить</Link>}
            </div>
            {config.header}
            {(config.filters?.length || config.sorts?.length) ? (
                <form
                    className="mb-4 flex flex-wrap items-end gap-3 rounded-[8px] bg-surface p-3"
                    onSubmit={(e) => {
                        e.preventDefault();
                        setParams({ ...draft, page: undefined });
                    }}
                >
                    {config.filters?.map((f) => (
                        <label key={f.key} className="flex min-w-[160px] flex-col gap-1 text-[12px] text-muted">
                            {f.label}
                            {f.options ? (
                                <select className={adminInput} value={draft[f.key] ?? ""} onChange={(e) => setDraft((d) => ({ ...d, [f.key]: e.target.value }))}>
                                    <option value="">Все</option>
                                    {f.options.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
                                </select>
                            ) : (
                                <input className={adminInput} value={draft[f.key] ?? ""} onChange={(e) => setDraft((d) => ({ ...d, [f.key]: e.target.value }))} />
                            )}
                        </label>
                    ))}
                    {config.sorts?.length ? (
                        <label className="flex min-w-[180px] flex-col gap-1 text-[12px] text-muted">
                            Сортировка
                            <select className={adminInput} value={sort ?? ""} onChange={(e) => setParams({ sort: e.target.value, page: undefined })}>
                                {config.sorts.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
                            </select>
                        </label>
                    ) : null}
                    {config.filters?.length ? (
                        <>
                            <button type="submit" className={adminButtonPrimary}>Найти</button>
                            <button type="button" className={adminButton} onClick={() => setParams({ ...Object.fromEntries(config.filters!.map((f) => [f.key, undefined])), page: undefined })}>Сбросить</button>
                        </>
                    ) : null}
                </form>
            ) : null}

            <div className="overflow-x-auto rounded-[8px] bg-surface">
                <table className="w-full border-collapse text-left">
                    <thead>
                        <tr className="border-b border-accent-bg text-[12px] text-muted">
                            {config.columns.map((c) => <th key={c.label} scope="col" className={`px-3 py-2 font-semibold ${c.className ?? ""}`}>{c.label}</th>)}
                            {(config.actions || config.remove) && <th scope="col" className="px-3 py-2"><span className="sr-only">Действия</span></th>}
                        </tr>
                    </thead>
                    <tbody>
                        {state.status === "ok" && state.rows.map((row) => (
                            <tr key={config.rowKey(row)} className="border-b border-accent-bg/60 hover:bg-field/50">
                                {config.columns.map((c, i) => (
                                    <td key={c.label} className={`px-3 py-2 align-top ${c.className ?? ""}`}>
                                        {i === 0 && config.rowHref ? <Link href={config.rowHref(row)} className="text-primary hover:underline">{c.cell(row)}</Link> : c.cell(row)}
                                    </td>
                                ))}
                                {(config.actions || config.remove) && (
                                    <td className="px-3 py-2 text-right whitespace-nowrap">
                                        <span className="inline-flex gap-2">
                                            {config.actions?.(row, { reload, notify, api })}
                                            {config.remove && <button type="button" className={adminButtonDanger} onClick={() => setToRemove(row)}>Удалить</button>}
                                        </span>
                                    </td>
                                )}
                            </tr>
                        ))}
                    </tbody>
                </table>
                {state.status === "loading" && <div className="flex justify-center p-8"><Spinner /></div>}
                {state.status === "error" && (
                    <div className="p-6 text-center">
                        <p className="mb-3 text-error">Не удалось загрузить: {state.error}</p>
                        <button type="button" className={adminButton} onClick={reload}>Повторить</button>
                    </div>
                )}
                {state.status === "ok" && state.rows.length === 0 && <p className="p-6 text-center text-muted">Ничего не найдено</p>}
            </div>

            {pages > 1 && (
                <nav aria-label="Страницы" className="mt-4 flex flex-wrap gap-1">
                    {pageItems(page, pages).map((item, i) => typeof item === "number" ? (
                        <button key={item} type="button" aria-current={item === page ? "page" : undefined} className={`min-w-[34px] cursor-pointer rounded-[6px] px-2 py-1 ${item === page ? "bg-primary text-white" : "bg-surface hover:bg-field"}`} onClick={() => setParams({ page: item === 1 ? undefined : String(item) })}>
                            {item}
                        </button>
                    ) : <span key={`${item}-${i}`} className="px-1 py-1 text-muted">…</span>)}
                </nav>
            )}

            <ConfirmDialog open={toRemove !== null} text={toRemove && config.remove ? config.remove.confirm(toRemove) : ""} confirm="Удалить" cancel="Отмена" busy={busy} onConfirm={() => void remove()} onClose={() => setToRemove(null)} />
            <Toast text={toast?.text ?? null} ok={toast?.ok} onClose={() => setToast(null)} />
        </section>
    );
}
