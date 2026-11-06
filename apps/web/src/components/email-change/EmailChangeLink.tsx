"use client";

import { useSearchParams } from "next/navigation";
import { useState } from "react";

import { blueButton } from "@/components/form/fields";
import { useSession } from "@/components/session/SessionProvider";
import { browserApi } from "@/lib/browserApi";
import { emailChangeErrorText, type EmailChangeErrorCode } from "@/lib/emailChange";

export interface EmailChangeLinkLabels {
    title: string;
    text: string;
    button: string;
    doneTitle: string;
    doneText: string;
    doneButton: string;
    missing: string;
    errors: Record<EmailChangeErrorCode | "network", string>;
}

/**
 * Страница по ссылке из письма: подтвердить новую почту (mode="confirm") или вернуть прежнюю
 * (mode="revert"). Вход не нужен. Действие — только по нажатию (POST): почтовые сканеры
 * открывают ссылки и выполнили бы его сами. После успеха все сессии на сервере закрыты —
 * выходим и здесь.
 */
export function EmailChangeLink({ mode, nextHref, labels }: { mode: "confirm" | "revert"; nextHref: string; labels: EmailChangeLinkLabels }) {
    const token = useSearchParams().get("token") ?? "";
    const session = useSession();
    const [state, setState] = useState<"ready" | "busy" | "done">("ready");
    const [email, setEmail] = useState("");
    const [error, setError] = useState<string | null>(null);

    const run = async () => {
        setState("busy");
        setError(null);
        try {
            const api = browserApi();
            const { data, error: failure } = mode === "confirm"
                ? await api.POST("/api/v1/email-change/confirm", { body: { token } })
                : await api.POST("/api/v1/email-change/revert", { body: { token } });
            if (data) {
                setEmail(data.email);
                setState("done");
                if (session.status === "user") await session.logout();
                return;
            }
            setError(emailChangeErrorText((failure as { errorCode?: string } | undefined)?.errorCode, labels.errors));
        } catch {
            setError(labels.errors.network);
        }
        setState("ready");
    };

    return (
        <main className="mx-auto flex w-full max-w-[560px] flex-col gap-5 px-4 py-10">
            {state === "done" ? (
                <>
                    <h1 className="text-[1.625rem] font-normal">{labels.doneTitle}</h1>
                    <p className="text-[16px] leading-[140%]" role="status">{labels.doneText.replace("{{email}}", email)}</p>
                    <a href={nextHref} className={`${blueButton} w-fit no-underline`}>{labels.doneButton}</a>
                </>
            ) : !token ? (
                <>
                    <h1 className="text-[1.625rem] font-normal">{labels.title}</h1>
                    <p className="text-[16px] leading-[140%]">{labels.missing}</p>
                </>
            ) : (
                <>
                    <h1 className="text-[1.625rem] font-normal">{labels.title}</h1>
                    <p className="text-[16px] leading-[140%]">{labels.text}</p>
                    {error && <p role="alert" className="text-[15px] text-error">{error}</p>}
                    <button type="button" disabled={state === "busy"} onClick={() => void run()} className={`${blueButton} w-fit`}>{labels.button}</button>
                </>
            )}
        </main>
    );
}
