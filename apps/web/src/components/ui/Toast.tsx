"use client";

import { useEffect } from "react";

/** Всплывающее сообщение (HintPopup старого фронта): зелёное — успех, красное — ошибка; гаснет через 4 с */
export function Toast({ text, ok = false, onClose }: { text: string | null; ok?: boolean; onClose: () => void }) {
    useEffect(() => {
        if (!text) return;
        const timer = setTimeout(onClose, 4000);
        return () => clearTimeout(timer);
    }, [text, onClose]);
    if (!text) return null;
    return (
        <div className="fixed top-[10%] left-1/2 z-[51] min-w-[20vh] -translate-x-1/2 font-medium tracking-[.6px] text-white">
            <div role={ok ? "status" : "alert"} onClick={onClose} className={`flex cursor-pointer items-center justify-center rounded-[30px] px-8 py-4 shadow-[6px_8px_16px_0_rgba(34,60,80,0.2)] ${ok ? "bg-[#62eb50]" : "bg-[#F4444E]"}`}>
                {text}
            </div>
        </div>
    );
}

/** Переключатель (Switch MUI старого фронта): синий бегунок справа — включено */
export function Switch({ checked, onChange, disabled, labelledBy }: { checked: boolean; onChange: (value: boolean) => void; disabled?: boolean; labelledBy?: string }) {
    return (
        <button type="button" role="switch" aria-checked={checked} aria-labelledby={labelledBy} disabled={disabled} onClick={() => onChange(!checked)} className="relative inline-flex h-[38px] w-[58px] shrink-0 cursor-pointer items-center p-3 disabled:cursor-default disabled:opacity-60">
            <span className={`h-3.5 w-full rounded-full transition-colors ${checked ? "bg-primary/50" : "bg-black/38"}`} />
            <span className={`absolute top-[9px] h-5 w-5 rounded-full shadow-[0_2px_1px_-1px_rgba(0,0,0,0.2),0_1px_1px_0_rgba(0,0,0,0.14),0_1px_3px_0_rgba(0,0,0,0.12)] transition-[left] ${checked ? "left-[29px] bg-primary" : "left-[9px] bg-white"}`} />
        </button>
    );
}
