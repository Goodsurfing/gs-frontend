"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

import { Spinner } from "@/components/ui/Spinner";
import { browserApi } from "@/lib/browserApi";

type Vacancy = { id: number; title?: string | null; asked: boolean };

export interface RelevanceLabels {
    title: string;
    text: string;
    asked: string;
    confirm: string;
    all: string;
    done: string;
    none: string;
    manage: string;
    invalid: string;
    empty: string;
    error: string;
}

/**
 * Подтверждение актуальности вакансий по ссылке из письма (GS-248). Отмечены те, о которых
 * спрашивали; «Подтвердить» — POST (сканеры почты открывают только GET).
 */
export function RelevanceConfirm({ manageHref, offerHref, labels }: { manageHref: string; offerHref: string; labels: RelevanceLabels }) {
    const token = useSearchParams().get("token") ?? "";
    const [vacancies, setVacancies] = useState<Vacancy[] | null>(null);
    const [selected, setSelected] = useState<Set<number>>(new Set());
    const [state, setState] = useState<"loading" | "ready" | "invalid" | "busy" | "done" | "error">("loading");
    const [confirmed, setConfirmed] = useState(0);
    const [hint, setHint] = useState(false);

    useEffect(() => {
        if (!token) return;
        browserApi()
            .GET("/api/v1/vacancy-relevance", { params: { query: { token } } })
            .then(({ data, response }) => {
                if (!response.ok || !data) {
                    setState("invalid");
                    return;
                }
                const list = (data.vacancies ?? []) as Vacancy[];
                setVacancies(list);
                // Отмечены те, о которых спрашивали; если таких нет — все
                const asked = list.filter((v) => v.asked).map((v) => v.id);
                setSelected(new Set(asked.length > 0 ? asked : list.map((v) => v.id)));
                setState("ready");
            })
            .catch(() => setState("error"));
    }, [token]);

    const toggle = (id: number) => setSelected((current) => {
        const next = new Set(current);
        if (next.has(id)) next.delete(id);
        else next.add(id);
        return next;
    });

    const submit = async () => {
        if (selected.size === 0) {
            setHint(true);
            return;
        }
        setState("busy");
        try {
            const { data, response } = await browserApi().POST("/api/v1/vacancy-relevance/confirm", { body: { token, vacancyIds: [...selected] } });
            if (!response.ok || !data) throw new Error();
            setConfirmed(data.confirmed ?? 0);
            setState("done");
        } catch {
            setState("error");
        }
    };

    return (
        <div className="mx-auto w-full max-w-[720px] px-5 py-10 down-sm:py-6">
            <h1 className="text-[28px] font-semibold text-ink-secondary down-sm:text-[24px]">{labels.title}</h1>
            {!token && <p className="mt-4 text-[16px]">{labels.invalid}</p>}
            {token && state === "loading" && <div className="flex justify-center py-10"><Spinner /></div>}
            {token && state === "invalid" && <p className="mt-4 text-[16px]">{labels.invalid} <a href={manageHref} className="text-primary underline">→</a></p>}
            {state === "done" && <p role="status" className="mt-4 rounded-[12px] bg-field p-4 text-[16px] text-ink-secondary">{labels.done.replace("{{count}}", String(confirmed))}</p>}
            {(state === "ready" || state === "busy" || state === "error") && vacancies && (
                <>
                    <p className="mt-2 text-[16px] leading-[140%] text-ink-tertiary">{labels.text}</p>
                    {vacancies.length === 0 ? <p className="mt-6">{labels.empty}</p> : (
                        <>
                            <button type="button" onClick={() => setSelected(new Set(vacancies.map((v) => v.id)))} className="mt-5 cursor-pointer text-[14px] text-primary underline">{labels.all}</button>
                            <ul className="mt-3 flex flex-col gap-2">
                                {vacancies.map((vacancy) => (
                                    <li key={vacancy.id}>
                                        <label className="flex cursor-pointer items-start gap-3 rounded-[12px] border border-accent-bg bg-white p-4">
                                            <input type="checkbox" checked={selected.has(vacancy.id)} onChange={() => toggle(vacancy.id)} className="mt-1 h-4 w-4 shrink-0" />
                                            <span className="min-w-0 flex-1">
                                                <a href={offerHref.replace("{id}", String(vacancy.id))} target="_blank" rel="noreferrer" className="text-[16px] text-ink-secondary hover:text-primary">{vacancy.title || `#${vacancy.id}`}</a>
                                                {vacancy.asked && <span className="ml-2 text-[12px] text-caption">{labels.asked}</span>}
                                            </span>
                                        </label>
                                    </li>
                                ))}
                            </ul>
                            {hint && selected.size === 0 && <p className="mt-3 text-[14px] text-error">{labels.none}</p>}
                            {state === "error" && <p role="alert" className="mt-3 text-[14px] text-error">{labels.error}</p>}
                            <button type="button" onClick={() => void submit()} disabled={state === "busy"} className="mt-5 cursor-pointer rounded-[10px] border border-cta bg-cta px-8 py-3 text-[16px] font-medium text-white transition-colors hover:bg-white hover:text-cta disabled:cursor-wait disabled:opacity-60">
                                {labels.confirm}
                            </button>
                        </>
                    )}
                </>
            )}
            <p className="mt-8 text-[14px]"><a href={manageHref} className="text-primary no-underline hover:underline">{labels.manage}&nbsp;→</a></p>
        </div>
    );
}
