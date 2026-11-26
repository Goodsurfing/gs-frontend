"use client";

import { forwardRef } from "react";

import type { ApplicationCounts, ApplicationTab } from "@/lib/applicationsView";

/**
 * Вкладки-таблетки по статусу с числом в каждой (GS-331, GS-332). Числа — с
 * сервера; пока их нет (грузятся или старый бэкенд) — вкладки без чисел. На
 * телефоне вкладки не влезают — прокручиваются вбок.
 */
export const CountTabs = forwardRef<HTMLDivElement, {
    id: string;
    tabs: readonly ApplicationTab[];
    selected: ApplicationTab | undefined;
    counts: ApplicationCounts | null;
    labels: Record<ApplicationTab, string>;
    label: string;
    onSelect: (tab: ApplicationTab) => void;
}>(function CountTabs({ id, tabs, selected, counts, labels, label, onSelect }, ref) {
    return (
        <div ref={ref} role="tablist" aria-label={label} className="-mx-1 flex scroll-mt-24 gap-1 overflow-x-auto border-b border-accent-bg px-1 [scrollbar-width:none]">
            {tabs.map((tab) => {
                const active = selected === tab;
                return (
                    <button
                        key={tab}
                        type="button"
                        role="tab"
                        id={`${id}-${tab}`}
                        aria-selected={active}
                        aria-controls={`${id}-panel`}
                        onClick={() => onSelect(tab)}
                        className={`-mb-px flex min-h-11 shrink-0 cursor-pointer items-center gap-1.5 border-0 border-b-2 bg-transparent px-3 text-[15px] whitespace-nowrap transition-colors ${active ? "border-primary font-semibold text-primary" : "border-transparent text-ink-secondary hover:text-primary"}`}
                    >
                        {labels[tab]}
                        {counts && (
                            <span className={`inline-flex min-w-[22px] items-center justify-center rounded-full px-1.5 text-[12px] leading-[20px] font-semibold ${active ? "bg-primary text-white" : "bg-field text-ink-secondary"}`}>
                                {counts[tab]}
                            </span>
                        )}
                    </button>
                );
            })}
        </div>
    );
});
