"use client";

import { useEffect, useState } from "react";

import { currentDisplayEnv, isIphoneSafari, isStandalone } from "@/lib/pwa";

/**
 * Подсказка на странице /app по браузеру: открыт с экрана «Домой» — «всё готово»;
 * iPhone, но не Safari — открыть в Safari. Определяется после загрузки, до неё
 * ничего (страница статическая и одинаковая для всех).
 */
export function AppInstallState({ labels, messengerHref }: { labels: { installed: string; notSafari: string; messenger: string }; messengerHref: string }) {
    const [state, setState] = useState<"installed" | "not-safari" | null>(null);

    useEffect(() => {
        const env = currentDisplayEnv();
        const next = isStandalone(env) ? "installed" : /iPhone|iPod/.test(env.userAgent) && !isIphoneSafari(env.userAgent) ? "not-safari" : null;
        // Определяется только в браузере, после загрузки
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setState(next);
    }, []);

    if (!state) return null;
    return (
        <p role="status" className="rounded-[10px] border border-accent-bg bg-status-new/10 px-4 py-3 text-[14px] leading-[140%] text-ink-secondary">
            {state === "installed" ? labels.installed : labels.notSafari}
            {state === "installed" && <> <a href={messengerHref} className="text-primary underline">{labels.messenger}</a></>}
        </p>
    );
}
