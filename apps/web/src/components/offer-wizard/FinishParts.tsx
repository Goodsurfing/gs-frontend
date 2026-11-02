"use client";

import { type InputHTMLAttributes, type ReactNode, type SelectHTMLAttributes, type TextareaHTMLAttributes, useId, useState } from "react";

/**
 * Элементы шагов «Что делать», «Условия», «Последние штрихи» — как shared/ui
 * старого фронта (Textarea, Input, IconButtonComponent, ToggleButtonWithIcon,
 * AddButton, Select на MUI). Рамки полей #82949F (--color-gray старого фронта).
 */

/** Иконка-маска цветом текста: локальная из /web/icons/offer или картинка справочника с API */
export function MaskImage({ src, className = "" }: { src: string | null | undefined; className?: string }) {
    if (!src) return <span aria-hidden className={`inline-block shrink-0 ${className}`} />;
    const url = `url("${src}")`;
    return (
        <span
            aria-hidden
            className={`inline-block shrink-0 bg-current ${className}`}
            style={{ maskImage: url, WebkitMaskImage: url, maskSize: "contain", WebkitMaskSize: "contain", maskRepeat: "no-repeat", WebkitMaskRepeat: "no-repeat", maskPosition: "center", WebkitMaskPosition: "center" }}
        />
    );
}

export const localIcon = (name: string) => `/web/icons/offer/${name}.svg`;

/** Многострочное поле (Textarea старого фронта): подпись 14 px, поле 118 px, подсказка 10 px */
export function OldTextarea({ label, description, className = "", ...rest }: TextareaHTMLAttributes<HTMLTextAreaElement> & { label: string; description?: string }) {
    const id = useId();
    return (
        <div className={className}>
            <div className="flex"><label htmlFor={id} className="text-[14px] text-[#82949F]">{label}</label></div>
            <textarea id={id} className="mt-2 box-border inline-block h-[118px] w-full resize-none rounded-[10px] border border-[#82949F] bg-white p-3.5 align-bottom text-[16px] text-black outline-none" {...rest} />
            {/* Подсказка в старом фронте шла строкой после поля — отсюда 11 px сверху и 3 px снизу */}
            {description && <p className="mt-[11px] mb-[3px] text-[10px] leading-[10px] text-[#82949F]">{description}</p>}
        </div>
    );
}

/** Однострочное поле (Input старого фронта): подпись над полем, подсказка под ним */
export function OldInput({ label, labelHidden, description, className = "", inputClassName = "", ...rest }: InputHTMLAttributes<HTMLInputElement> & {
    label?: string;
    /** Подпись только для чтения с экрана (у старого поля её не было) */
    labelHidden?: string;
    description?: string;
    inputClassName?: string;
}) {
    const id = useId();
    return (
        <div className={`flex flex-col ${className}`}>
            {label && <div className="mb-2 flex gap-2.5"><label htmlFor={id} className="text-[14px] leading-[14px] text-[#82949F]">{label}</label></div>}
            <input id={id} aria-label={labelHidden} className={`box-border h-11 w-full rounded-[10px] border border-[#82949F] bg-white p-3.5 text-[16px] leading-[normal] text-black outline-none placeholder:text-[#757575] ${inputClassName}`} {...rest} />
            {description && <p className="mt-2 text-[10px] leading-[12px] text-[#82949F]">{description}</p>}
        </div>
    );
}

/**
 * Числовое поле: пока его правят, показывается набранный текст (можно стереть и
 * набрать заново); в форму уходит только то, что примет onText; после ухода из
 * поля — снова значение формы.
 */
export function OldNumberInput({ value, onText, ...rest }: Omit<Parameters<typeof OldInput>[0], "value" | "onChange" | "onBlur" | "type"> & { value: number; onText: (text: string) => void }) {
    const [text, setText] = useState<string | null>(null);
    return (
        <OldInput
            {...rest}
            type="number"
            value={text ?? String(value)}
            onChange={(event) => {
                setText(event.target.value);
                onText(event.target.value);
            }}
            onBlur={() => setText(null)}
        />
    );
}

/** Выпадающий список (Select на MUI в старом фронте): рамка 10 px, стрелка справа */
export function OldSelect({ className = "", children, ...rest }: SelectHTMLAttributes<HTMLSelectElement> & { children: ReactNode }) {
    return (
        <div className={`relative flex h-11 ${className}`}>
            <select className="box-border h-11 w-full cursor-pointer appearance-none rounded-[10px] border border-[#8494A1] bg-transparent py-0 pr-8 pl-3.5 text-[16px] leading-[120%] tracking-[0.00938em] text-[rgba(0,0,0,0.87)] outline-none" {...rest}>
                {children}
            </select>
            <svg aria-hidden viewBox="0 0 24 24" className="pointer-events-none absolute top-[calc(50%-12px)] right-[7px] h-6 w-6 fill-[rgba(0,0,0,0.54)]"><path d="M7 10l5 5 5-5z" /></svg>
        </div>
    );
}

/** Круглая кнопка-значок с подписью (IconButtonComponent large): навыки, требования к участнику */
export function IconToggle({ checked, onToggle, text, icon }: { checked: boolean; onToggle: () => void; text: string; icon: ReactNode }) {
    return (
        <div className="flex items-center gap-5">
            <button
                type="button"
                aria-pressed={checked}
                aria-label={text}
                onClick={onToggle}
                className={`flex h-[46px] w-[46px] shrink-0 cursor-pointer items-center justify-center rounded-full border p-3 transition-colors ${checked ? "border-primary bg-primary text-white" : "border-accent-bg bg-accent-bg text-caption hover:border-caption"}`}
            >
                {icon}
            </button>
            <span aria-hidden onClick={onToggle} className="cursor-pointer text-[16px] leading-[120%] text-ink-secondary">{text}</span>
        </div>
    );
}

/** Плитка условия (ToggleButtonWithIcon в ConditionsItem): значок над подписью; выбранная — синяя */
export function ConditionTile({ checked, onToggle, text, icon }: { checked: boolean; onToggle: () => void; text: string; icon: ReactNode }) {
    return (
        <button
            type="button"
            aria-pressed={checked}
            onClick={onToggle}
            className={`flex w-40 cursor-pointer flex-col items-center gap-2 border px-4 py-2 text-[13.3333px] leading-[normal] transition-all duration-200 ease-in-out down-sm:w-full ${checked ? "border-primary bg-primary text-white" : "border-caption bg-white text-black [&>span:first-child]:text-caption"}`}
        >
            {icon}
            {text}
        </button>
    );
}

/** Синяя кнопка с плюсом (AddButton старого фронта) */
export function PlusButton({ text, onClick, disabled }: { text: string; onClick: () => void; disabled?: boolean }) {
    return (
        <button type="button" onClick={onClick} disabled={disabled} className="group inline-flex cursor-pointer items-center justify-center rounded-[10px] border border-caption bg-primary px-5 py-[15px] text-[14px] leading-[normal] text-white hover:text-black disabled:cursor-not-allowed disabled:bg-field disabled:text-caption">
            <svg aria-hidden viewBox="0 0 14 14" className="mr-2.5 flex h-3.5 w-3.5 fill-white group-hover:fill-black group-disabled:fill-caption"><path d="M14 6.66667H7.33333V0H6.66667V6.66667H0V7.33333H6.66667V14H7.33333V7.33333H14V6.66667Z" /></svg>
            {text}
        </button>
    );
}

/** Подпись раздела формы серым */
export function Caption({ children, className = "text-[14px] leading-[14px]" }: { children: ReactNode; className?: string }) {
    return <p className={`text-caption ${className}`}>{children}</p>;
}

/** Ошибка под полем (ErrorText старого фронта) */
export function FieldError({ text }: { text: string }) {
    return <p role="alert" className="my-[15px] text-[0.75rem] text-[#d32f2f]">{text}</p>;
}
