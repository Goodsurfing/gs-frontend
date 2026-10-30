import type { ReactNode } from "react";

import { AuthTitle } from "./AuthTitle";

/** Страница-сообщение после входа/регистрации (ConfirmEmailPage и соседние старого фронта): заголовок, текст, подсказка, кнопка */
export function AuthMessage({ title, children, hint, action }: { title: string; children: ReactNode; hint?: string; action?: ReactNode }) {
    return (
        <div className="flex w-full flex-col items-center">
            <AuthTitle className="mb-[55px]">{title}</AuthTitle>
            <div className="flex w-full max-w-[580px] flex-col items-center gap-10 text-center">
                <div className="text-[1.125rem] leading-[144%] text-[#0e1d27] [&_span]:font-medium [&_span]:text-primary">{children}</div>
                {hint && <p className="text-[0.875rem] leading-[143%] text-ink-secondary opacity-50">{hint}</p>}
                {action}
            </div>
        </div>
    );
}

export const outlinedLink = "inline-block rounded-[10px] border border-primary px-[50px] py-3.5 text-center text-[1rem] leading-[1.375rem] text-primary transition-all duration-300 hover:bg-primary hover:text-white";
