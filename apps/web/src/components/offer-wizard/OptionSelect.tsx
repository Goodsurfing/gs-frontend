"use client";

import { type KeyboardEvent, useEffect, useId, useRef, useState } from "react";

export interface Option { value: string; label: string }

/**
 * Выпадающий список (SelectField на react-select «unstyled» старого фронта):
 * серая подпись 14 px, рамка #82949F со скруглением 10 px, справа серая
 * «галочка»; меню под полем в такой же рамке, высота списка до 300 px.
 * Кнопка с ролью combobox, варианты — role="option": подпись поля — её имя.
 */
export function OptionSelect({ label, value, options, onChange, className = "" }: {
    label: string;
    value: string;
    options: Option[];
    onChange: (value: string) => void;
    className?: string;
}) {
    const id = useId();
    const [open, setOpen] = useState(false);
    const [active, setActive] = useState(-1);
    const root = useRef<HTMLDivElement>(null);
    const current = options.find((option) => option.value === value);

    useEffect(() => {
        if (!open) return;
        const close = (event: MouseEvent) => {
            if (root.current && !root.current.contains(event.target as Node)) setOpen(false);
        };
        document.addEventListener("mousedown", close);
        return () => document.removeEventListener("mousedown", close);
    }, [open]);

    const pick = (option: Option | undefined) => {
        if (option) onChange(option.value);
        setOpen(false);
    };

    const keyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
        if (event.key === "ArrowDown" || event.key === "ArrowUp") {
            event.preventDefault();
            if (!open) {
                setOpen(true);
                setActive(Math.max(0, options.indexOf(current as Option)));
                return;
            }
            const step = event.key === "ArrowDown" ? 1 : -1;
            setActive((index) => (index + step + options.length) % options.length);
        } else if ((event.key === "Enter" || event.key === " ") && open) {
            event.preventDefault();
            pick(options[active]);
        } else if (event.key === "Escape") {
            setOpen(false);
        }
    };

    return (
        <div ref={root} className={`relative flex w-full flex-col justify-center ${className}`}>
            <div className="flex items-center">
                <label id={`${id}-label`} htmlFor={id} className="font-[Lato] text-[0.875rem] font-normal text-[#82949F]">{label}</label>
            </div>
            <button
                id={id}
                type="button"
                role="combobox"
                aria-expanded={open}
                aria-haspopup="listbox"
                aria-controls={`${id}-list`}
                aria-labelledby={`${id}-label`}
                onClick={() => setOpen(!open)}
                onKeyDown={keyDown}
                className="mt-2 box-border flex w-full min-w-[90px] cursor-pointer items-center justify-start rounded-[0.625rem] border border-[#82949F] bg-transparent p-3.5 text-left font-[Lato] text-[16px] whitespace-nowrap text-black outline-none"
            >
                <span className="min-w-0 flex-1 truncate">{current?.label ?? ""}</span>
                <span aria-hidden className="flex shrink-0 items-center">
                    <span className="block h-5 w-px" />
                    <svg viewBox="0 0 20 20" className="block h-5 w-5 fill-[#82949F]"><path d="M4.516 7.548c0.436-0.446 1.043-0.481 1.576 0l3.908 3.747 3.908-3.747c0.533-0.481 1.141-0.446 1.574 0 0.436 0.445 0.408 1.197 0 1.615-0.406 0.418-4.695 4.502-4.695 4.502-0.217 0.223-0.502 0.335-0.787 0.335s-0.57-0.112-0.789-0.335c0 0-4.287-4.084-4.695-4.502s-0.436-1.17 0-1.615z" /></svg>
                </span>
            </button>
            {open && (
                <div className="absolute top-[110%] left-0 z-10 w-full rounded-[0.625rem] border border-[#82949F] bg-white p-3.5 font-[Lato] text-[1rem] leading-6 font-normal">
                    <ul id={`${id}-list`} role="listbox" aria-labelledby={`${id}-label`} className="m-0 max-h-[300px] list-none overflow-y-auto p-0">
                        {options.map((option, index) => (
                            <li
                                key={option.value}
                                role="option"
                                aria-selected={option.value === value}
                                onMouseDown={(event) => event.preventDefault()}
                                onMouseEnter={() => setActive(index)}
                                onClick={() => pick(option)}
                                className={`cursor-pointer ${index === active ? "text-primary" : ""}`}
                            >
                                {option.label}
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
}
