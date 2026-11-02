"use client";

import { type TextareaHTMLAttributes, useId } from "react";

/**
 * Многострочное поле мастера (Textarea старого фронта): серая подпись 14 px,
 * поле с рамкой #82949F (по умолчанию высота 118 px), под ним подсказка 10 px;
 * ошибка — красная рамка.
 */
export function WizardTextarea({ label, hint, invalid, className = "", textareaClass = "h-[7.375rem]", ...rest }: TextareaHTMLAttributes<HTMLTextAreaElement> & {
    label: string;
    hint?: string;
    invalid?: boolean;
    textareaClass?: string;
}) {
    const id = useId();
    return (
        <div className={`relative w-full ${className}`}>
            <div className="flex items-center">
                <label htmlFor={id} className="font-[Lato] text-[0.875rem] font-normal text-[#82949F]">{label}</label>
            </div>
            <textarea
                id={id}
                aria-invalid={invalid || undefined}
                className={`mt-2 box-border inline-block w-full resize-none rounded-[0.625rem] border bg-white p-3.5 font-[Lato] text-[1rem] font-normal outline-none ${invalid ? "border-error" : "border-[#82949F]"} ${textareaClass}`}
                {...rest}
            />
            {hint && <span className="text-[0.625rem] text-[#82949F]">{hint}</span>}
        </div>
    );
}
