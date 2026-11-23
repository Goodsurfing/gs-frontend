"use client";

import { useCallback, useEffect, useState } from "react";

import { adminButton, adminButtonPrimary, adminInput, YesNo } from "@/components/admin/AdminList";
import { Spinner } from "@/components/ui/Spinner";
import { useAdminApi } from "@/lib/admin/api";

/** Тариф для управления (GET /admin/v1/membership/tariffs/settings) */
interface TariffRow {
    code: string;
    name: string;
    priceRub: number;
    durationDays: number;
    forRole: string;
    category: string;
    seats: number;
    active: boolean;
    editable: boolean;
}

const ROLE: Record<string, string> = { VOLUNTEER: "волонтёр", HOST: "организатор", BOTH: "все" };

/**
 * Цены и включение тарифов членства. Новая цена — для следующих оплат (начатые
 * идут по старой); страница «Членство» на сайте обновляется за ~5 минут.
 * Выключенный тариф не виден на сайте и не оплачивается; купленные членства не трогаются.
 */
export function TariffsAdmin() {
    const api = useAdminApi();
    const [rows, setRows] = useState<TariffRow[] | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [draft, setDraft] = useState<Record<string, string>>({});
    const [busy, setBusy] = useState<string | null>(null);
    const [message, setMessage] = useState<{ text: string; ok: boolean } | null>(null);

    const load = useCallback(() => {
        api.get<TariffRow[]>("membership/tariffs/settings")
            .then((data) => {
                setError(null);
                setRows(data);
                setDraft(Object.fromEntries(data.map((r) => [r.code, String(r.priceRub)])));
            })
            .catch((e: unknown) => setError(e instanceof Error ? e.message : "Ошибка"));
    }, [api]);
    useEffect(load, [load]);

    const save = (row: TariffRow, body: { priceRub?: number; active?: boolean }, done: string) => {
        setBusy(row.code);
        setMessage(null);
        api.patch<TariffRow>(`membership/tariffs/${row.code}`, body)
            .then((updated) => {
                setRows((list) => list?.map((r) => (r.code === updated.code ? updated : r)) ?? null);
                setDraft((d) => ({ ...d, [updated.code]: String(updated.priceRub) }));
                setMessage({ text: done, ok: true });
            })
            .catch((e: unknown) => setMessage({ text: e instanceof Error ? e.message : "Ошибка", ok: false }))
            .finally(() => setBusy(null));
    };

    return (
        <section>
            <h1 className="mb-2 text-[22px] font-bold">Тарифы членства</h1>
            <p className="mb-4 max-w-[720px] text-muted">
                Новая цена действует для следующих оплат, на сайте обновится в течение 5 минут. Выключенный тариф не виден на сайте и не оплачивается; уже купленные членства не меняются.
            </p>
            {message && <p role="status" className={`mb-3 ${message.ok ? "text-cta" : "text-error"}`}>{message.text}</p>}
            {error && (
                <div className="p-6 text-center">
                    <p className="mb-3 text-error">Не удалось загрузить: {error}</p>
                    <button type="button" className={adminButton} onClick={load}>Повторить</button>
                </div>
            )}
            {!rows && !error && <div className="flex justify-center p-8"><Spinner /></div>}
            {rows && (
                <div className="flex flex-col gap-3">
                    {rows.map((row) => {
                        const price = Number(draft[row.code]);
                        const priceValid = Number.isInteger(price) && price >= 1 && price <= 1_000_000;
                        return (
                            <div key={row.code} className="flex flex-wrap items-end gap-4 rounded-[8px] bg-surface p-4">
                                <div className="min-w-[220px] flex-1">
                                    <p className="font-semibold">{row.name}</p>
                                    <p className="text-[12px] text-muted">
                                        {row.code} · {ROLE[row.forRole] ?? row.forRole} · {row.durationDays} дн.{row.seats > 1 ? ` · на ${row.seats}` : ""}
                                    </p>
                                    <p className="mt-1 text-[13px]">На сайте: <YesNo value={row.active} /></p>
                                </div>
                                {row.editable ? (
                                    <>
                                        <label className="flex w-[140px] flex-col gap-1 text-[12px] text-muted">
                                            Цена, ₽
                                            <input className={adminInput} inputMode="numeric" value={draft[row.code] ?? ""} onChange={(e) => setDraft((d) => ({ ...d, [row.code]: e.target.value.replace(/\D/g, "") }))} />
                                        </label>
                                        <button
                                            type="button"
                                            className={adminButtonPrimary}
                                            disabled={busy === row.code || !priceValid || price === row.priceRub}
                                            onClick={() => save(row, { priceRub: price }, `«${row.name}»: цена ${price.toLocaleString("ru-RU")} ₽`)}
                                        >
                                            Сохранить цену
                                        </button>
                                        <button
                                            type="button"
                                            className={adminButton}
                                            disabled={busy === row.code}
                                            onClick={() => save(row, { active: !row.active }, row.active ? `«${row.name}» скрыт с сайта` : `«${row.name}» показывается на сайте`)}
                                        >
                                            {row.active ? "Скрыть с сайта" : "Показать на сайте"}
                                        </button>
                                    </>
                                ) : (
                                    <p className="text-[13px] text-muted">Бессрочный — выдаётся вручную, не меняется</p>
                                )}
                            </div>
                        );
                    })}
                </div>
            )}
        </section>
    );
}
