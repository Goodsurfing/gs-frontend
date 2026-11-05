"use client";

import { useState } from "react";

import { useSession } from "@/components/session/SessionProvider";
import { browserApi } from "@/lib/browserApi";
import type { OffersFilters } from "@/lib/offersFilters";
import { savedSearchFilters, type SavedSearchSource, subscribeReturnQuery } from "@/lib/savedSearch";

export interface SubscribeLabels {
    button: string;
    empty: string;
    emptyButton: string;
    prompt: string;
    promptButton: string;
    guest: string;
    done: string;
    already: string;
    manage: string;
    limit: string;
    error: string;
}

type State = { kind: "idle" } | { kind: "busy" } | { kind: "done"; already: boolean } | { kind: "limit" } | { kind: "error" };

/**
 * Подписка на подборку по текущим фильтрам карты. Гостю — вход, после него
 * возврат на карту с теми же фильтрами и тем же предложением (?subscribe=).
 * variant: line — строка под поиском; empty — вместо «ничего не нашлось»;
 * prompt — плашка после перехода из письма или входа.
 */
export function SavedSearchButton({ filters, source, variant, signInHref, manageHref, labels }: {
    filters: OffersFilters;
    source: SavedSearchSource;
    variant: "line" | "empty" | "prompt";
    /** Адрес входа; возврат на карту с теми же фильтрами — через ?next=offersMap */
    signInHref: string;
    manageHref: string;
    labels: SubscribeLabels;
}) {
    const session = useSession();
    const [state, setState] = useState<State>({ kind: "idle" });

    const subscribe = () => {
        if (session.status !== "user") return;
        setState({ kind: "busy" });
        browserApi(session.token).POST("/api/v1/saved-searches", { body: { filters: savedSearchFilters(filters), source } as never })
            .then(({ response }) => {
                if (response.status === 201 || response.status === 200) setState({ kind: "done", already: response.status === 200 });
                else setState({ kind: response.status === 409 ? "limit" : "error" });
            })
            .catch(() => setState({ kind: "error" }));
    };

    const action = variant === "line" ? labels.button : variant === "empty" ? labels.emptyButton : labels.promptButton;
    const manage = <a href={manageHref} className="text-primary underline">{labels.manage}</a>;
    let control;
    if (state.kind === "done") {
        control = <p role="status" className="text-[14px] text-cta">{state.already ? labels.already : labels.done} {manage}</p>;
    } else if (state.kind === "limit") {
        control = <p role="alert" className="text-[14px] text-error">{labels.limit} {manage}</p>;
    } else if (session.status === "guest") {
        control = (
            <a href={`${signInHref}?next=offersMap&nextId=${encodeURIComponent(subscribeReturnQuery(filters, source))}`} className="inline-flex items-center gap-1.5 text-[14px] font-medium text-primary hover:underline">
                <Bell /> {action} <span className="text-[12px] font-normal text-muted">· {labels.guest}</span>
            </a>
        );
    } else {
        control = (
            <span className="inline-flex flex-wrap items-center gap-2">
                <button type="button" disabled={state.kind === "busy" || session.status !== "user"} onClick={subscribe} className={variant === "line"
                    ? "inline-flex cursor-pointer items-center gap-1.5 text-[14px] font-medium text-primary hover:underline disabled:cursor-default disabled:opacity-60"
                    : "inline-flex cursor-pointer items-center gap-1.5 rounded-[10px] bg-cta px-5 py-2.5 text-[14px] font-medium text-white hover:bg-cta-hover disabled:cursor-default disabled:opacity-60"}>
                    <Bell /> {action}
                </button>
                {state.kind === "error" && <span role="alert" className="text-[13px] text-error">{labels.error}</span>}
            </span>
        );
    }

    if (variant === "line") return <div className="px-[30px] pb-2 down-lg:px-5">{control}</div>;
    return (
        <div className={`m-5 flex flex-col items-center gap-3 rounded-xl p-5 text-center ${variant === "prompt" ? "border-2 border-cta bg-white" : "bg-field"}`}>
            <p className="text-[15px] font-medium">{variant === "empty" ? labels.empty : labels.prompt}</p>
            {control}
        </div>
    );
}

function Bell() {
    return (
        <svg aria-hidden width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 0 1-3.46 0" />
        </svg>
    );
}
