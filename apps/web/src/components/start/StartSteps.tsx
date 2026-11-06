"use client";

import { useEffect } from "react";

import { useSession } from "@/components/session/SessionProvider";
import { Loading } from "@/components/ui/Loading";
import { type StartStep, startState } from "@/lib/startSteps";

export interface StartStepsLabels {
    title: string;
    text: string;
    done: string;
    skip: string;
    host: string;
    steps: Record<StartStep, { title: string; why: string; action: string }>;
}

/**
 * «С чего начать» — куда ведёт вход по умолчанию (06.11.2026; раньше — анкета «Обо мне» на 15+ полей,
 * а откликались 10 % зарегистрировавшихся). Три шага с отметками: откликнуться, имя и фото, направления.
 * Организатору и тому, кто уже откликался, страница не нужна — сразу на свой рабочий стол.
 */
export function StartSteps({ hrefs, labels }: {
    hrefs: { home: string; catalog: string; profile: string; preferences: string; volunteerDashboard: string; hostDashboard: string; hostRegister: string };
    labels: StartStepsLabels;
}) {
    const session = useSession();
    const state = session.profile ? startState(session.profile as Record<string, unknown>) : null;
    const redirect = state?.redirect ?? null;

    useEffect(() => {
        if (redirect === "host") window.location.replace(hrefs.hostDashboard);
        if (redirect === "volunteer") window.location.replace(hrefs.volunteerDashboard);
    }, [redirect, hrefs.hostDashboard, hrefs.volunteerDashboard]);

    if (!state || redirect) return <Loading className="min-h-[300px]" />;

    const steps: { key: StartStep; href: string }[] = [
        { key: "apply", href: hrefs.catalog },
        { key: "intro", href: hrefs.profile },
        { key: "directions", href: hrefs.preferences },
    ];
    // Первый несделанный шаг — главная кнопка, остальные — контурные
    const current = steps.find((step) => !state.done[step.key])?.key;

    return (
        <div className="mx-auto w-full max-w-[720px] px-5 py-10 down-sm:py-6">
            <h1 className="text-[28px] font-semibold text-ink-secondary down-sm:text-[24px]">{labels.title}</h1>
            <p className="mt-2 text-[16px] leading-[140%] text-ink-tertiary">{labels.text}</p>
            <ol className="mt-6 flex flex-col gap-3">
                {steps.map((step, index) => {
                    const done = state.done[step.key];
                    const text = labels.steps[step.key];
                    const active = step.key === current;
                    return (
                        <li key={step.key} className={`flex items-start gap-4 rounded-[14px] border bg-white p-5 down-sm:flex-wrap down-sm:p-4 ${active ? "border-primary shadow-[0_5px_20px_0_rgba(14,29,39,0.08)]" : "border-accent-bg"}`}>
                            <span aria-hidden className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[15px] font-semibold ${done ? "bg-cta text-white" : active ? "bg-primary text-white" : "bg-field text-caption"}`}>
                                {done
                                    ? <svg viewBox="0 0 16 16" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 8.5l3.2 3L13 4.5" /></svg>
                                    : index + 1}
                            </span>
                            <div className="min-w-0 flex-1">
                                <p className={`text-[17px] font-semibold ${done ? "text-caption line-through" : "text-ink-secondary"}`}>{text.title}</p>
                                <p className={`mt-1 text-[14px] leading-[140%] ${done ? "text-cta" : "text-ink-tertiary"}`}>{done ? labels.done : text.why}</p>
                            </div>
                            {!done && (
                                <a href={step.href} className={`shrink-0 self-center rounded-[10px] border border-primary px-4 py-2 text-[14px] font-medium whitespace-nowrap no-underline transition-colors down-sm:ml-12 ${active ? "bg-primary text-white hover:bg-white hover:text-primary" : "bg-white text-primary hover:bg-primary hover:text-white"}`}>
                                    {text.action}
                                </a>
                            )}
                        </li>
                    );
                })}
            </ol>
            <div className="mt-6 flex flex-wrap items-center justify-between gap-3 text-[14px]">
                <a href={hrefs.hostRegister} className="text-primary no-underline hover:underline">{labels.host}&nbsp;→</a>
                <a href={hrefs.home} className="text-caption no-underline hover:underline">{labels.skip}</a>
            </div>
        </div>
    );
}
