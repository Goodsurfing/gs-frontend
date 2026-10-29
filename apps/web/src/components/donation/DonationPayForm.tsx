"use client";

import { type FormEvent, useEffect, useState } from "react";

import { useSession } from "@/components/session/SessionProvider";
import { browserApi } from "@/lib/browserApi";

const PRESET_AMOUNTS = [300, 1500, 5000];
const MIN_AMOUNT = 100;

export interface DonationPayLabels {
    amountTitle: string;
    otherAmount: string;
    settings: string;
    anonymous: string;
    creating: string;
    /** «Поддержать — {{amount}} ₽» */
    submit: string;
    offerBefore: string;
    offerLink: string;
    offerAfter: string;
    minAmount: string;
    unavailable: string;
    createError: string;
}

/**
 * Форма пожертвования (DonationPayPage старого фронта): сумма из трёх
 * готовых или своя (не меньше 100 ₽), анонимность; создаёт платёж и уводит
 * на страницу ЮKassa. Без входа — на вход с возвратом к сбору.
 */
export function DonationPayForm({ fundraiseId, signInHref, offerHref, labels }: {
    fundraiseId: string;
    signInHref: string;
    offerHref: string;
    labels: DonationPayLabels;
}) {
    const session = useSession();
    const [selected, setSelected] = useState<number | null>(1500);
    const [custom, setCustom] = useState("");
    const [anonymous, setAnonymous] = useState(false);
    const [fieldError, setFieldError] = useState<string | null>(null);
    const [apiError, setApiError] = useState<string | null>(null);
    const [creating, setCreating] = useState(false);

    useEffect(() => {
        if (session.status === "guest") window.location.replace(signInHref);
    }, [session.status, signInHref]);

    const amount = selected ?? (Number.isFinite(Number(custom)) ? Number(custom) : 0);

    const submit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setApiError(null);
        if (!Number.isFinite(amount) || amount < MIN_AMOUNT) {
            setFieldError(labels.minAmount);
            return;
        }
        setFieldError(null);
        setCreating(true);
        try {
            const { data, error, response } = await browserApi(session.token).POST("/api/v1/donation", {
                body: { fundraiseId, amount, isAnonymous: anonymous } as never,
            });
            const paymentUrl = (data as { paymentUrl?: string } | undefined)?.paymentUrl;
            if (paymentUrl) {
                window.location.href = paymentUrl;
                return;
            }
            // 502/503/504 — недоступна ЮKassa: говорим об этом прямо, а не «ошибка»
            if (response.status >= 502 && response.status <= 504) setApiError(labels.unavailable);
            else setApiError((error as { error?: string } | undefined)?.error || labels.createError);
        } catch {
            setApiError(labels.createError);
        } finally {
            setCreating(false);
        }
    };

    if (session.status !== "user") return null;

    return (
        <>
            <form onSubmit={submit} className="rounded-[20px] border border-[#dbe6ef] bg-white p-6 shadow-[0_10px_30px_rgb(16_44_74/6%)] max-[600px]:rounded-2xl max-[600px]:p-4">
                <div className="grid grid-cols-2 gap-6 max-[900px]:grid-cols-1 max-[900px]:gap-5">
                    <section>
                        <h3 className="mb-4 text-[24px] font-bold text-[#0c2238] max-[600px]:text-[22px]">{labels.amountTitle}</h3>
                        <div className="flex flex-wrap gap-3">
                            {PRESET_AMOUNTS.map((preset) => (
                                <button
                                    key={preset}
                                    type="button"
                                    aria-pressed={selected === preset}
                                    onClick={() => {
                                        setSelected(preset);
                                        setCustom("");
                                        setFieldError(null);
                                    }}
                                    className={`min-w-[130px] cursor-pointer rounded-xl border px-4 py-3 text-[18px] font-bold transition-all duration-200 max-[600px]:min-w-[100px] max-[600px]:text-[16px] ${selected === preset
                                        ? "border-[#0a66c2] bg-[rgb(10_102_194/8%)] text-[#0a66c2]"
                                        : "border-[#c9d8e6] bg-white text-[#23415f] hover:border-[#5a90c2]"}`}
                                >
                                    {preset} ₽
                                </button>
                            ))}
                        </div>
                        <div className="mt-3.5 flex flex-col gap-2">
                            <label htmlFor="custom-amount" className="text-[0.875rem] text-[#82949F]">{labels.otherAmount}</label>
                            <input
                                id="custom-amount"
                                type="number"
                                min={MIN_AMOUNT}
                                value={custom}
                                onChange={(event) => {
                                    setSelected(null);
                                    setCustom(event.target.value);
                                    setFieldError(null);
                                }}
                                className="box-border w-full rounded-[0.625rem] border border-[#82949F] p-3.5 text-[1rem] outline-none"
                            />
                        </div>
                        {fieldError && <p role="alert" className="mt-0.5 text-[13px] leading-[1.3] text-[#d32f2f]">{fieldError}</p>}
                    </section>
                    <section>
                        <h3 className="mb-4 text-[24px] font-bold text-[#0c2238] max-[600px]:text-[22px]">{labels.settings}</h3>
                        <div className="mt-4 grid gap-2.5">
                            <label htmlFor="anonymous-check" className="flex items-start gap-2.5 text-[15px] leading-[1.4] text-[#38516b]">
                                <input id="anonymous-check" type="checkbox" checked={anonymous} onChange={(event) => setAnonymous(event.target.checked)} className="mt-0.5 h-[18px] w-[18px]" />
                                <span>{labels.anonymous}</span>
                            </label>
                        </div>
                        <div className="mt-[18px]">
                            <button
                                type="submit"
                                disabled={creating}
                                className="w-full cursor-pointer rounded-[10px] border border-primary bg-primary px-[70px] py-4 text-[16px] leading-[120%] text-white transition-all duration-300 hover:bg-white hover:text-primary disabled:cursor-default disabled:opacity-70 disabled:hover:bg-primary disabled:hover:text-white"
                            >
                                {creating ? labels.creating : labels.submit.replace("{{amount}}", String(amount))}
                            </button>
                        </div>
                        <p className="mt-2.5 text-[13px] leading-[1.4] text-[#7a99b2]">
                            {labels.offerBefore}
                            <a href={offerHref} target="_blank" rel="noreferrer" className="text-[#0a66c2] underline">{labels.offerLink}</a>
                            {labels.offerAfter}.
                        </p>
                    </section>
                </div>
            </form>
            {apiError && <div role="alert" className="mt-4 rounded-xl border border-[#f4b0b0] bg-[#fff3f3] px-3.5 py-3 text-[#a63636]">{apiError}</div>}
        </>
    );
}
