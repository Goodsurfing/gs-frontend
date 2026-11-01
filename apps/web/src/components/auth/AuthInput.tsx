"use client";

import { type InputHTMLAttributes, useId, useState } from "react";

/**
 * Поле на страницах входа (AuthInputField старого фронта): линия снизу,
 * подпись внутри поля поднимается при вводе; у пароля — «глаз».
 */
export function AuthInput({ label, type, error, value, className = "", ...rest }: InputHTMLAttributes<HTMLInputElement> & {
    label: string;
    type: string;
    error?: string;
    value: string;
}) {
    const id = useId();
    const [shown, setShown] = useState(false);
    const isPassword = type === "password";
    return (
        <div className={`relative mb-[25px] box-border w-full ${className}`}>
            <div className="flex w-full gap-1.5 border-b border-[#82949f]">
                <input
                    id={id}
                    type={isPassword && shown ? "text" : type}
                    required
                    value={value}
                    aria-invalid={!!error}
                    className="peer w-full border-0 py-[15px] text-[1rem] leading-[138%] font-semibold text-ink-secondary outline-none"
                    {...rest}
                />
                {isPassword && (
                    <button type="button" onClick={() => setShown(!shown)} aria-label={shown ? "Скрыть пароль" : "Показать пароль"} className="shrink-0 cursor-pointer border-0 bg-transparent px-1.5">
                        {/* eslint-disable-next-line @next/next/no-img-element -- иконка */}
                        <img src={shown ? "/web/icons/auth/eye-hide.svg" : "/web/icons/auth/eye.svg"} alt="" className="w-[18px]" />
                    </button>
                )}
                <label
                    htmlFor={id}
                    className={`pointer-events-none absolute left-0 leading-[138%] font-medium text-ink-secondary transition-all duration-200 peer-focus:-top-[5px] peer-focus:text-[0.875rem] peer-focus:opacity-80 ${value ? "-top-[5px] text-[0.875rem] opacity-80" : "top-2.5 text-[1.125rem] opacity-50"}`}
                >
                    {label}
                </label>
            </div>
            {error && <p role="alert" className="mt-1 text-[14px] text-error">{error}</p>}
        </div>
    );
}
