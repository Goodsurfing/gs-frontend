"use client";

import { useState } from "react";

export interface TranslatedLabels {
    note: string;
    showOriginal: string;
    showTranslation: string;
}

/**
 * Описание вакансии на /en и /es: машинный перевод с пометкой и кнопкой «Показать оригинал»
 * (GS-227). Оригинал приходит вместе со страницей — переключение без запроса.
 */
export function TranslatedText({ blocks, labels }: {
    blocks: { title: React.ReactNode; translated: string; original: string }[];
    labels: TranslatedLabels;
}) {
    const [showOriginal, setShowOriginal] = useState(false);
    const text = "text-[14px] font-medium whitespace-pre-line break-words";
    return (
        <div className="mt-10 flex w-full flex-col gap-10">
            {blocks.map((block, index) => (
                <div key={index} className="flex flex-col gap-5">
                    {block.title}
                    <p className={text} lang={showOriginal ? "ru" : undefined}>{showOriginal ? block.original : block.translated}</p>
                </div>
            ))}
            <p className="-mt-6 flex flex-wrap items-center gap-2 text-[13px] text-caption">
                <svg aria-hidden viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 5h8M8 3v2m2.5 0c-1 4-3.5 7-6.5 9m2-5c1.5 2.5 3.5 4 6 5" /><path d="M13 21l4-9 4 9m-6.5-3h5" /></svg>
                {labels.note} ·
                <button type="button" onClick={() => setShowOriginal((value) => !value)} className="cursor-pointer text-primary underline">
                    {showOriginal ? labels.showTranslation : labels.showOriginal}
                </button>
            </p>
        </div>
    );
}
