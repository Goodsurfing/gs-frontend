"use client";

import { type InputHTMLAttributes, type ReactNode, type SelectHTMLAttributes, type TextareaHTMLAttributes, useId } from "react";

/**
 * Поля форм кабинета (shared/ui/Input, Select, Textarea старого фронта):
 * подпись серым над полем, рамка #82949F, скругление 10 px, высота 44 px;
 * недоступное поле — серое. Ошибка — красная рамка и текст под полем.
 */
const control = "box-border w-full rounded-[0.625rem] border border-[#82949F] bg-white p-3.5 text-[1rem] font-normal outline-none disabled:cursor-not-allowed disabled:bg-disabled aria-[invalid=true]:border-error";

function Label({ htmlFor, text, icon }: { htmlFor: string; text?: string; icon?: string }) {
    if (!text) return null;
    return (
        <div className="mb-2 flex items-center gap-2.5">
            {/* eslint-disable-next-line @next/next/no-img-element -- иконка соцсети */}
            {icon && <img src={icon} alt="" className="max-w-[1.125rem]" />}
            <label htmlFor={htmlFor} className="text-[0.875rem] leading-none font-normal text-[#82949F]">{text}</label>
        </div>
    );
}

export function TextField({ label, icon, error, description, className = "", ...rest }: InputHTMLAttributes<HTMLInputElement> & {
    label?: string;
    icon?: string;
    error?: string;
    description?: string;
}) {
    const id = useId();
    return (
        <div className={`relative flex w-full flex-col ${className}`}>
            <Label htmlFor={id} text={label} icon={icon} />
            <input id={id} aria-invalid={!!error} className={`${control} max-h-11`} {...rest} />
            {description && <p className="mt-2 text-[0.625rem] text-[#82949F]">{description}</p>}
            {error && <p role="alert" className="mt-1 text-[0.75rem] text-error">{error}</p>}
        </div>
    );
}

export function TextAreaField({ label, description, error, className = "", ...rest }: TextareaHTMLAttributes<HTMLTextAreaElement> & {
    label?: string;
    description?: string;
    error?: string;
}) {
    const id = useId();
    return (
        <div className={`flex w-full flex-col ${className}`}>
            {label && <label htmlFor={id} className="mb-2 text-[0.875rem] font-medium text-[#82949F]">{label}</label>}
            <textarea id={id} aria-invalid={!!error} className={`${control} h-[7.375rem] resize-none`} {...rest} />
            {description && <p className="mt-[9px] text-[0.625rem] leading-[12px] font-medium text-[#82949F]">{description}</p>}
            {error && <p role="alert" className="mt-1 text-[0.75rem] text-error">{error}</p>}
        </div>
    );
}

export function SelectField({ label, error, children, className = "", ...rest }: SelectHTMLAttributes<HTMLSelectElement> & {
    label?: string;
    error?: string;
    children: ReactNode;
}) {
    const id = useId();
    return (
        <div className={`flex w-full flex-col ${className}`}>
            {label && <label htmlFor={id} className="mb-2 text-[0.875rem] leading-none text-[#82949F]">{label}</label>}
            <select id={id} aria-invalid={!!error} className={`${control} h-11 cursor-pointer px-3.5 py-0`} {...rest}>{children}</select>
            {error && <p role="alert" className="mt-1 text-[0.75rem] text-error">{error}</p>}
        </div>
    );
}

/** Синяя кнопка формы (Button BLUE FILL MEDIUM) */
export const blueButton = "flex cursor-pointer items-center justify-center rounded-[10px] border border-primary bg-primary px-[100px] py-3 text-center text-[16px] leading-[120%] text-white transition-all duration-300 hover:bg-white hover:text-primary disabled:cursor-default disabled:opacity-70 disabled:hover:bg-primary disabled:hover:text-white down-lg:w-full down-lg:px-[15px]";
