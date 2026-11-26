"use client";

import { useId } from "react";

/**
 * Поле поиска над списком заявок (GS-331, GS-332): значок лупы, крестик
 * «Очистить», Enter — искать сразу, без паузы.
 */
export function ApplicationsSearch({ value, label, placeholder, clearLabel, onChange, onSubmit, onClear }: {
    value: string;
    label: string;
    placeholder: string;
    clearLabel: string;
    onChange: (value: string) => void;
    onSubmit: () => void;
    onClear: () => void;
}) {
    const id = useId();
    return (
        <div className="relative flex-1">
            <label htmlFor={id} className="sr-only">{label}</label>
            <svg aria-hidden viewBox="0 0 24 24" className="pointer-events-none absolute top-1/2 left-3.5 h-5 w-5 -translate-y-1/2 fill-none stroke-caption" strokeWidth="2" strokeLinecap="round">
                <circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" />
            </svg>
            <input
                id={id}
                type="search"
                value={value}
                maxLength={100}
                autoComplete="off"
                enterKeyHint="search"
                placeholder={placeholder}
                onChange={(event) => onChange(event.target.value)}
                onKeyDown={(event) => {
                    if (event.key === "Enter") onSubmit();
                }}
                className="box-border h-[50px] w-full rounded-[0.625rem] border border-muted bg-white py-3.5 pr-11 pl-11 text-[1rem] outline-none focus:border-primary [&::-webkit-search-cancel-button]:hidden"
            />
            {value && (
                <button
                    type="button"
                    aria-label={clearLabel}
                    onClick={onClear}
                    className="absolute top-1/2 right-2 flex h-9 w-9 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full border-0 bg-transparent p-0 text-caption hover:bg-field"
                >
                    <svg aria-hidden viewBox="0 0 24 24" className="h-4 w-4 fill-none stroke-current" strokeWidth="2.5" strokeLinecap="round"><path d="M6 6l12 12M18 6 6 18" /></svg>
                </button>
            )}
        </div>
    );
}
