"use client";

import { usePathname } from "next/navigation";
import { type InputHTMLAttributes, type Ref, useId, useState } from "react";

import { localeFromPath } from "@/i18n/config";

/** «Показать / скрыть пароль» — короткие подписи «глаза» прямо здесь, без словаря на каждой форме входа */
const EYE: Record<"ru" | "en" | "es", { show: string; hide: string }> = {
    ru: { show: "Показать пароль", hide: "Скрыть пароль" },
    en: { show: "Show password", hide: "Hide password" },
    es: { show: "Mostrar contraseña", hide: "Ocultar contraseña" },
};

/**
 * Поле на страницах входа (AuthInputField старого фронта): линия снизу,
 * подпись внутри поля поднимается при вводе; у пароля — «глаз».
 * Без value — неконтролируемое поле (форма входа): введённое до загрузки
 * скриптов не теряется, подпись поднимается через CSS, значение — из inputRef.
 */
export function AuthInput({ label, type, error, value, inputRef, className = "", ...rest }: Omit<InputHTMLAttributes<HTMLInputElement>, "value"> & {
    label: string;
    type: string;
    error?: string;
    value?: string;
    inputRef?: Ref<HTMLInputElement>;
}) {
    const id = useId();
    const [shown, setShown] = useState(false);
    const eye = EYE[localeFromPath(usePathname() ?? "")];
    const isPassword = type === "password";
    const controlled = value !== undefined;
    // Подпись поднята: поле в фокусе или заполнено (у неконтролируемого — «плейсхолдер не виден»)
    const raised = "-top-[5px] text-[0.875rem] opacity-80";
    const lowered = "top-2.5 text-[1.125rem] opacity-50";
    const position = controlled
        ? (value ? raised : lowered)
        : `${lowered} peer-[:not(:placeholder-shown)]:-top-[5px] peer-[:not(:placeholder-shown)]:text-[0.875rem] peer-[:not(:placeholder-shown)]:opacity-80`;
    return (
        <div className={`relative mb-[25px] box-border w-full ${className}`}>
            <div className="flex w-full gap-1.5 border-b border-[#82949f]">
                <input
                    id={id}
                    type={isPassword && shown ? "text" : type}
                    ref={inputRef}
                    required
                    {...(controlled ? { value } : { placeholder: " " })}
                    aria-invalid={!!error}
                    className="peer w-full border-0 py-[15px] text-[1rem] leading-[138%] font-semibold text-ink-secondary outline-none"
                    {...rest}
                />
                {isPassword && (
                    <button type="button" onClick={() => setShown(!shown)} aria-label={shown ? eye.hide : eye.show} className="shrink-0 cursor-pointer border-0 bg-transparent px-1.5">
                        {/* eslint-disable-next-line @next/next/no-img-element -- иконка */}
                        <img src={shown ? "/web/icons/auth/eye-hide.svg" : "/web/icons/auth/eye.svg"} alt="" className="w-[18px]" />
                    </button>
                )}
                <label
                    htmlFor={id}
                    className={`pointer-events-none absolute left-0 leading-[138%] font-medium text-ink-secondary transition-all duration-200 peer-focus:-top-[5px] peer-focus:text-[0.875rem] peer-focus:opacity-80 ${position}`}
                >
                    {label}
                </label>
            </div>
            {error && <p role="alert" className="mt-1 text-[14px] text-error">{error}</p>}
        </div>
    );
}
