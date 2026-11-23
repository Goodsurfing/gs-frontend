"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { useCallback, useEffect, useState } from "react";

import { blueButton, TextField } from "@/components/form/fields";
import { useSession } from "@/components/session/SessionProvider";
import { browserApi } from "@/lib/browserApi";
import { emailChangeErrorText, type EmailChangeErrorCode } from "@/lib/emailChange";

export interface EmailChangeLabels {
    change: string;
    title: string;
    text: string;
    newEmail: string;
    password: string;
    passwordHint: string;
    vkHint: string;
    submit: string;
    cancel: string;
    sent: string;
    pending: string;
    close: string;
    signInAgain: string;
    errors: Record<EmailChangeErrorCode | "network", string>;
}

type State = { email: string; hasPassword: boolean; pending: { newEmail: string; expiresAt: string } | null };

/**
 * Смена почты из профиля (почта — единственный логин). Письмо со ссылкой уходит на новый адрес,
 * почта меняется только после перехода по ней; на старый адрес приходит ссылка отмены.
 * Не <form>: кнопка живёт внутри формы профиля, вложенные формы недопустимы.
 */
export function EmailChangeButton({ signInHref, labels }: { signInHref: string; labels: EmailChangeLabels }) {
    const session = useSession();
    const [state, setState] = useState<State | null>(null);
    const [open, setOpen] = useState(false);
    const [newEmail, setNewEmail] = useState("");
    const [password, setPassword] = useState("");
    const [busy, setBusy] = useState(false);
    const [error, setError] = useState<{ code: EmailChangeErrorCode | "network"; text: string } | null>(null);
    const [sentTo, setSentTo] = useState<string | null>(null);

    const load = useCallback(() => {
        if (session.status !== "user") return;
        browserApi(session.token)
            .GET("/api/v1/email-change")
            .then(({ data }) => data && setState(data as State))
            .catch(() => undefined);
    }, [session.status, session.token]);
    useEffect(load, [load]);

    const reset = () => {
        setNewEmail("");
        setPassword("");
        setError(null);
        setSentTo(null);
    };

    const submit = async () => {
        if (busy || !newEmail.trim() || (state?.hasPassword && !password)) return;
        setBusy(true);
        setError(null);
        try {
            const { data, error: failure, response } = await browserApi(session.token).POST("/api/v1/email-change", {
                body: { newEmail: newEmail.trim(), password: state?.hasPassword ? password : null },
            });
            if (response.status === 202 && data) {
                setSentTo(data.sentTo);
                load();
            } else {
                const code = ((failure as { errorCode?: string } | undefined)?.errorCode ?? "unknown") as EmailChangeErrorCode;
                setError({ code, text: emailChangeErrorText(code, labels.errors) });
            }
        } catch {
            setError({ code: "network", text: labels.errors.network });
        } finally {
            setBusy(false);
        }
    };

    if (!state) return null;

    return (
        <div className="flex flex-col gap-1">
            <button type="button" onClick={() => { reset(); setOpen(true); }} className="w-fit cursor-pointer text-[14px] text-primary hover:underline">
                {labels.change}
            </button>
            {state.pending && (
                <p className="text-[13px] leading-[140%] text-caption">
                    {labels.pending.replace("{{email}}", state.pending.newEmail).replace("{{date}}", state.pending.expiresAt)}
                </p>
            )}
            <Dialog.Root open={open} onOpenChange={setOpen}>
                <Dialog.Portal>
                    <Dialog.Overlay className="fixed inset-0 z-[999] flex animate-fade-in items-center justify-center overflow-y-auto bg-black/50 p-4">
                        <Dialog.Content aria-describedby={undefined} className="flex w-full max-w-[520px] flex-col gap-5 rounded-[10px] bg-white px-6 py-7 down-sm:px-4">
                            <Dialog.Title className="text-[20px] font-medium">{labels.title}</Dialog.Title>
                            {sentTo ? (
                                <>
                                    <p className="text-[15px] leading-[140%]" role="status">{labels.sent.replace("{{email}}", sentTo)}</p>
                                    <button type="button" onClick={() => setOpen(false)} className={blueButton}>{labels.close}</button>
                                </>
                            ) : (
                                <div
                                    className="flex flex-col gap-5"
                                    onKeyDown={(event) => {
                                        if (event.key === "Enter") {
                                            event.preventDefault();
                                            void submit();
                                        }
                                    }}
                                >
                                    <p className="text-[14px] leading-[140%] text-caption">{labels.text.replace("{{email}}", state.email)}</p>
                                    <TextField label={labels.newEmail} type="email" autoComplete="email" inputMode="email" value={newEmail} onChange={(event) => setNewEmail(event.target.value)} autoFocus />
                                    {state.hasPassword
                                        ? <TextField label={labels.password} description={labels.passwordHint} type="password" autoComplete="current-password" value={password} onChange={(event) => setPassword(event.target.value)} />
                                        : <p className="text-[13px] leading-[140%] text-caption">{labels.vkHint}</p>}
                                    {error && (
                                        <p role="alert" className="text-[14px] text-error">
                                            {error.text}
                                            {error.code === "reauth_required" && (
                                                <>
                                                    {" "}
                                                    <button type="button" onClick={() => { void session.logout().then(() => { window.location.href = signInHref; }); }} className="cursor-pointer text-primary underline">{labels.signInAgain}</button>
                                                </>
                                            )}
                                        </p>
                                    )}
                                    <div className="flex flex-wrap items-center gap-4">
                                        <button type="button" disabled={busy || !newEmail.trim() || (state.hasPassword && !password)} onClick={() => void submit()} className={blueButton}>{labels.submit}</button>
                                        <Dialog.Close className="cursor-pointer text-[15px] text-primary hover:underline">{labels.cancel}</Dialog.Close>
                                    </div>
                                </div>
                            )}
                        </Dialog.Content>
                    </Dialog.Overlay>
                </Dialog.Portal>
            </Dialog.Root>
        </div>
    );
}
