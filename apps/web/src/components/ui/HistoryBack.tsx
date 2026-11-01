"use client";

/** Кнопка «Назад» по истории браузера (navigate(-1) старого фронта) */
export function HistoryBack({ label, className = "" }: { label: string; className?: string }) {
    return <button type="button" onClick={() => window.history.back()} className={className}>{label}</button>;
}
