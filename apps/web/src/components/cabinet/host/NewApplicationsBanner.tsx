"use client";

import { type PluralText, pluralText } from "@/lib/hostApplicationsView";

/**
 * «3 новые заявки ждут ответа → Ответить» (GS-331): наверху рабочего стола
 * и над вкладками заявок. Нет новых — полосы нет. Ведёт ссылкой (href) или
 * переключает вкладку (onAction).
 */
export function NewApplicationsBanner({ locale, count, forms, action, href, onAction, className = "" }: {
    locale: string;
    count: number;
    forms: PluralText;
    action: string;
    href?: string;
    onAction?: () => void;
    className?: string;
}) {
    if (count <= 0) return null;
    const link = "notranslate inline-flex min-h-11 shrink-0 cursor-pointer items-center gap-1 border-0 bg-transparent p-0 text-[15px] font-semibold whitespace-nowrap text-primary no-underline hover:underline";
    const arrow = <span aria-hidden>→</span>;
    return (
        <div role="status" className={`flex flex-wrap items-center gap-x-3 gap-y-1 rounded-[12px] bg-notice-bg px-4 py-2 text-[15px] text-ink ${className}`} data-testid="new-applications-banner">
            <span className="font-medium">{pluralText(locale, count, forms)}</span>
            {href
                ? <a href={href} translate="no" className={link}>{arrow} {action}</a>
                : <button type="button" translate="no" onClick={onAction} className={link}>{arrow} {action}</button>}
        </div>
    );
}
