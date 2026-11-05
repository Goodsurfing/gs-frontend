"use client";

import { useEffect, useState } from "react";

import { Spinner } from "@/components/ui/Spinner";
import { browserApi } from "@/lib/browserApi";

type State = { kind: "loading" } | { kind: "ready"; name: string } | { kind: "done"; name: string } | { kind: "invalid" } | { kind: "error"; name: string };

/** Отписка от писем одной подборки по ссылке из письма (без входа) */
export function SavedSearchUnsubscribe({ token, manageHref, labels }: {
    token: string;
    manageHref: string;
    labels: { title: string; text: string; button: string; done: string; invalid: string; error: string; manage: string };
}) {
    const [state, setState] = useState<State>({ kind: "loading" });
    const [busy, setBusy] = useState(false);

    useEffect(() => {
        browserApi().GET("/api/v1/saved-searches/unsubscribe/{token}", { params: { path: { token } } })
            .then(({ data }) => setState(data ? { kind: "ready", name: (data as { name: string }).name } : { kind: "invalid" }))
            .catch(() => setState({ kind: "invalid" }));
    }, [token]);

    const fill = (text: string, name: string) => text.replace("{{name}}", name);
    const unsubscribe = (name: string) => {
        setBusy(true);
        browserApi().POST("/api/v1/saved-searches/unsubscribe/{token}", { params: { path: { token } } })
            .then(({ data }) => setState(data ? { kind: "done", name } : { kind: "error", name }))
            .catch(() => setState({ kind: "error", name }))
            .finally(() => setBusy(false));
    };

    return (
        <div className="mx-auto flex w-full max-w-[480px] flex-col items-center gap-4 py-10 text-center">
            <h1 className="text-[1.5rem] font-semibold">{labels.title}</h1>
            {state.kind === "loading" && <Spinner />}
            {state.kind === "invalid" && <p>{labels.invalid}</p>}
            {(state.kind === "ready" || state.kind === "error") && (
                <>
                    <p>{fill(labels.text, state.name)}</p>
                    <button type="button" disabled={busy} onClick={() => unsubscribe(state.name)} className="w-full cursor-pointer rounded-[10px] bg-primary px-6 py-3 text-white disabled:opacity-60">{labels.button}</button>
                    {state.kind === "error" && <p role="alert" className="text-error">{labels.error}</p>}
                </>
            )}
            {state.kind === "done" && <p role="status">{fill(labels.done, state.name)}</p>}
            <a href={manageHref} className="text-primary underline">{labels.manage}</a>
        </div>
    );
}
