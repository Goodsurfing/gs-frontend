import type { ReactNode } from "react";

/**
 * Пустое состояние на телефоне (EmptyState приложения gs-mobile): значок,
 * фраза, подсказка и одна кнопка «что делать». Используется в телефонной
 * версии кабинета волонтёра и в пустых «Сообщениях».
 */
export function EmptyHint({ icon = "send", title, hint, action, className = "" }: {
    icon?: "send" | "chat";
    title: string;
    hint?: string;
    action?: { href: string; label: string };
    className?: string;
}) {
    return (
        <div className={`flex flex-col items-center gap-2 px-4 py-6 text-center ${className}`}>
            <span aria-hidden className="mb-1 flex h-12 w-12 items-center justify-center rounded-full bg-m-primary-soft text-m-primary-dark">
                <EmptyIcon name={icon} />
            </span>
            <p className="text-[16px] leading-[130%] font-semibold text-ink-secondary">{title}</p>
            {hint && <p className="max-w-[320px] text-[14px] leading-[140%] text-caption">{hint}</p>}
            {action && (
                <a href={action.href} className="mt-2 inline-flex h-12 w-full max-w-[320px] items-center justify-center rounded-m-button bg-cta px-6 text-[16px] font-semibold text-white no-underline hover:bg-cta-hover">
                    {action.label}
                </a>
            )}
        </div>
    );
}

/** Значки Feather (как в приложении): «отправить» и «сообщение» */
function EmptyIcon({ name }: { name: "send" | "chat" }): ReactNode {
    const common = { width: 22, height: 22, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 2, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };
    return name === "send"
        ? <svg {...common}><path d="M22 2 11 13" /><path d="M22 2 15 22l-4-9-9-4 20-7z" /></svg>
        : <svg {...common}><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></svg>;
}
