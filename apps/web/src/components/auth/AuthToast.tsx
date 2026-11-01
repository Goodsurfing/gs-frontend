"use client";

import { useEffect } from "react";

/** Всплывающее сообщение об ошибке (HintPopup старого фронта): красная плашка сверху, гаснет через 4 с */
export function AuthToast({ text, onClose }: { text: string | null; onClose: () => void }) {
    useEffect(() => {
        if (!text) return;
        const timer = setTimeout(onClose, 4000);
        return () => clearTimeout(timer);
    }, [text, onClose]);
    if (!text) return null;
    return (
        <div className="fixed top-[10%] left-1/2 z-[51] min-w-[20vh] -translate-x-1/2 font-medium tracking-[.6px] text-white">
            <div role="alert" onClick={onClose} className="flex cursor-pointer items-center justify-center rounded-[30px] bg-[#F4444E] px-8 py-4 shadow-[6px_8px_16px_0_rgba(34,60,80,0.2)]">
                {text}
            </div>
        </div>
    );
}
