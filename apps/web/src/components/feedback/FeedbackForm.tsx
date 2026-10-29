"use client";

import { useState } from "react";

import { browserApi } from "@/lib/browserApi";

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * «Обратная связь» (FeedbackForm старого фронта): имя, e-mail, сообщение;
 * «Отправить» доступна, только когда всё заполнено и e-mail похож на e-mail.
 */
export function FeedbackForm({ labels }: {
    labels: { name: string; message: string; send: string; sent: string; sentHint: string; again: string; error: string };
}) {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");
    const [sent, setSent] = useState(false);
    const [busy, setBusy] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const valid = name.trim() !== "" && EMAIL.test(email.trim()) && message.trim() !== "";

    const submit = async () => {
        if (!valid) return;
        setBusy(true);
        setError(null);
        const result = await browserApi().POST("/api/v1/feedback", { body: { name, email, message } as never }).catch(() => ({ error: true }));
        setBusy(false);
        if (result.error) setError(labels.error);
        else setSent(true);
    };

    const label = "mb-2 flex items-center text-[0.875rem] leading-[100%] text-[#82949F]";
    const field = "box-border w-full rounded-[0.625rem] border border-[#82949F] p-3.5 text-[1rem] outline-none";
    return (
        <div className="mx-auto my-[60px] flex w-full max-w-[480px] flex-col gap-5 rounded-2xl bg-white p-8 shadow-[0_8px_30px_rgba(0,0,0,0.08)] down-sm:my-8 down-sm:p-5">
            {sent ? (
                <>
                    <h2 className="text-[1.5rem] font-bold">{labels.sent}</h2>
                    <p className="text-[#7a7a7a]">{labels.sentHint}</p>
                    <button
                        type="button"
                        onClick={() => { setName(""); setEmail(""); setMessage(""); setSent(false); }}
                        className="cursor-pointer rounded-[10px] border border-primary bg-primary px-[100px] py-3 text-[16px] leading-[120%] text-white hover:bg-white hover:text-primary down-lg:w-full down-lg:px-[15px]"
                    >
                        {labels.again}
                    </button>
                </>
            ) : (
                <>
                    <div className="flex flex-col">
                        <label htmlFor="feedback-name" className={label}>{labels.name}</label>
                        <input id="feedback-name" value={name} maxLength={255} onChange={(event) => setName(event.target.value)} className={`${field} max-h-11`} />
                    </div>
                    <div className="flex flex-col">
                        <label htmlFor="feedback-email" className={label}>E-mail</label>
                        <input id="feedback-email" type="email" value={email} maxLength={255} onChange={(event) => setEmail(event.target.value)} className={`${field} max-h-11`} />
                    </div>
                    {/* Блок, а не flex: textarea строчная, как в старом фронте (+3 px под строкой) */}
                    <div>
                        <label htmlFor="feedback-message" className="flex items-center text-[0.875rem] text-[#82949F]">{labels.message}</label>
                        <textarea id="feedback-message" value={message} maxLength={2000} onChange={(event) => setMessage(event.target.value)} className={`${field} mt-2 h-[7.375rem] resize-none align-baseline`} />
                    </div>
                    {error && <p className="text-[14px] text-error">{error}</p>}
                    <button
                        type="button"
                        onClick={submit}
                        disabled={!valid || busy}
                        className="flex w-full cursor-pointer items-center justify-center rounded-[10px] border border-primary bg-primary px-5 py-3 text-[16px] leading-[120%] text-white transition-all duration-300 hover:bg-white hover:text-primary disabled:cursor-default disabled:opacity-70 disabled:hover:bg-primary disabled:hover:text-white"
                    >
                        {busy ? "…" : labels.send}
                    </button>
                </>
            )}
        </div>
    );
}
