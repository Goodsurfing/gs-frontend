"use client";

import { useEffect, useRef, useState } from "react";

import { type Day, dayFromParts, dayLabel, dayParts, today } from "@/lib/offerWizard";

/** Первый и последний день месяца */
const monthBounds = (year: number, month: number): [Day, Day] => [dayFromParts(year, month, 1), dayFromParts(year, month, new Date(year, month, 0).getDate())];

/** Сдвиг месяца: month 1–12 */
const shiftMonth = (year: number, month: number, by: number): [number, number] => {
    const index = year * 12 + (month - 1) + by;
    return [Math.floor(index / 12), (index % 12) + 1];
};

/**
 * Календарь месяца (react-calendar в CalendarComponent старого фронта, со
 * стилями по умолчанию): «« ‹ месяц год › »», неделя с понедельника,
 * выходные красные, дни соседних месяцев серые, вне диапазона — недоступны.
 */
function MonthCalendar({ value, min, max, locale, onPick }: { value: Day | null; min?: Day; max?: Day; locale: string; onPick: (day: Day) => void }) {
    const [start] = useState(() => dayParts(value ?? today()));
    const [[year, month], setView] = useState<[number, number]>([start[0], start[1]]);

    const canShow = (y: number, m: number) => {
        const [first, last] = monthBounds(y, m);
        return (!min || last >= min) && (!max || first <= max);
    };
    const nav = (by: number) => {
        const next = shiftMonth(year, month, by);
        return { next, disabled: !canShow(next[0], next[1]) };
    };

    const first = new Date(year, month - 1, 1);
    const offset = (first.getDay() + 6) % 7;
    const daysInMonth = new Date(year, month, 0).getDate();
    const cells = Math.ceil((offset + daysInMonth) / 7) * 7;
    const days = Array.from({ length: cells }, (_, index) => {
        const date = new Date(year, month - 1, 1 - offset + index);
        const day = dayFromParts(date.getFullYear(), date.getMonth() + 1, date.getDate());
        return { day, date: date.getDate(), weekend: date.getDay() === 0 || date.getDay() === 6, neighbor: date.getMonth() !== month - 1 };
    });
    // 1 января 2024 — понедельник
    const weekdays = Array.from({ length: 7 }, (_, index) => new Date(2024, 0, 1 + index).toLocaleDateString(locale, { weekday: "short" }));
    const title = first.toLocaleDateString(locale, { month: "long", year: "numeric" });
    const navButton = "min-w-11 bg-transparent text-[13.3333px] enabled:cursor-pointer enabled:hover:bg-[#e6e6e6] disabled:bg-[#f0f0f0] disabled:text-[rgba(16,16,16,0.3)]";

    return (
        <div className="w-[350px] max-w-[300px] border border-[#a0a096] bg-white font-[Arial,Helvetica,sans-serif] text-[16px] leading-[1.125em] text-black down-lg:max-w-full">
            <div className="mb-4 flex h-11">
                {([[-12, "«"], [-1, "‹"]] as const).map(([by, text]) => (
                    <button key={by} type="button" disabled={nav(by).disabled} onClick={() => setView(nav(by).next)} className={navButton}>{text}</button>
                ))}
                <span className="flex grow items-center justify-center text-[13.3333px]">{title}</span>
                {([[1, "›"], [12, "»"]] as const).map(([by, text]) => (
                    <button key={by} type="button" disabled={nav(by).disabled} onClick={() => setView(nav(by).next)} className={navButton}>{text}</button>
                ))}
            </div>
            <div className="flex text-center text-[0.75em] font-bold uppercase">
                {weekdays.map((weekday) => <div key={weekday} className="basis-[14.2857%] p-[0.5em]"><abbr title={weekday} className="underline decoration-dotted">{weekday}</abbr></div>)}
            </div>
            <div className="flex flex-wrap">
                {days.map(({ day, date, weekend, neighbor }) => {
                    const disabled = (!!min && day < min) || (!!max && day > max);
                    const active = day === value;
                    const color = active ? "text-white" : neighbor ? "text-[#757575]" : weekend ? "text-[#d10000]" : "text-black";
                    return (
                        <button
                            key={day}
                            type="button"
                            disabled={disabled}
                            onClick={() => onPick(day)}
                            className={`h-[38px] max-w-full basis-[14.2857%] px-[6.6667px] py-2.5 text-center text-[0.833em] leading-4 disabled:bg-[#f0f0f0] disabled:text-[rgba(16,16,16,0.3)] ${active ? "bg-[#006edc]" : "bg-transparent enabled:hover:bg-[#e6e6e6]"} ${disabled ? "" : `cursor-pointer ${color}`}`}
                        >
                            {date}
                        </button>
                    );
                })}
            </div>
        </div>
    );
}

/**
 * Поле даты (DateInput и DatePickerCalendar старого фронта): только чтение,
 * «ДД-ММ-ГГГГ» или «Не задано», значок календаря справа; щелчок открывает
 * календарь под полем, выбор дня закрывает его. Дата вне диапазона — красным.
 */
export function DateField({ value, onChange, min, max, disabled, shape = "all", label, placeholder, locale, calendarClass = "left-[5%]" }: {
    value: Day | null;
    onChange: (day: Day) => void;
    min?: Day;
    max?: Day;
    disabled?: boolean;
    /** Скругление: пара полей «с — по» склеена в одну плашку */
    shape?: "all" | "left" | "right";
    label: string;
    placeholder: string;
    locale: string;
    calendarClass?: string;
}) {
    const [open, setOpen] = useState(false);
    const root = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!open) return;
        const close = (event: MouseEvent) => {
            if (root.current && !root.current.contains(event.target as Node)) setOpen(false);
        };
        document.addEventListener("click", close);
        return () => document.removeEventListener("click", close);
    }, [open]);

    const valid = !!value && (!min || value >= min) && (!max || value <= max);
    const radius = shape === "left" ? "rounded-l-[10px]" : shape === "right" ? "rounded-r-[10px]" : "rounded-[10px]";
    return (
        <div className="relative flex w-full items-center">
            <div ref={root} className="relative cursor-pointer" onClick={() => setOpen(!open)}>
                <div className={`border border-[#82949F] px-2.5 py-3.5 ${radius}`}>
                    <input
                        readOnly
                        type="text"
                        aria-label={label}
                        value={dayLabel(value)}
                        placeholder={placeholder}
                        onKeyDown={(event) => {
                            if (event.key === "Enter" || event.key === " ") setOpen(!open);
                            if (event.key === "Escape") setOpen(false);
                        }}
                        className={`w-full cursor-pointer bg-transparent p-0 text-[13.3333px] outline-none placeholder:text-[#757575] ${valid ? "text-black" : "text-[red]"} ${disabled ? "pointer-events-none" : ""}`}
                    />
                    {/* eslint-disable-next-line @next/next/no-img-element -- значок календаря */}
                    <img src="/web/icons/offer-wizard/calendar.svg" alt="" className="absolute top-1/2 right-[2%] block -translate-x-1/2 -translate-y-1/2 cursor-pointer" />
                </div>
                {open && !disabled && (
                    <div className={`absolute top-[120%] z-10 down-sm:w-[80vw] ${calendarClass}`} onClick={(event) => event.stopPropagation()}>
                        <MonthCalendar
                            value={value}
                            min={min}
                            max={max}
                            locale={locale}
                            onPick={(day) => {
                                onChange(day);
                                setOpen(false);
                            }}
                        />
                    </div>
                )}
            </div>
        </div>
    );
}
