import type { ReactNode } from "react";

const outlineButton = "min-h-11 cursor-pointer rounded-[10px] border border-primary bg-white px-6 text-[15px] text-primary hover:bg-primary hover:text-white";

/** Мерцающие заглушки карточек, пока список грузится (место под карточки уже занято) */
export function ApplicationsLoading({ height = 188 }: { height?: number }) {
    return (
        <div className="grid grid-cols-2 gap-4 down-lg:grid-cols-1" data-testid="applications-loading">
            {[0, 1, 2, 3].map((index) => <div key={index} className="animate-pulse rounded-[12px] bg-field" style={{ height }} />)}
        </div>
    );
}

/** Список не загрузился — текст и «Повторить» */
export function ApplicationsError({ text, retry, onRetry }: { text: string; retry: string; onRetry: () => void }) {
    return (
        <div className="flex flex-col items-center gap-3 rounded-[12px] bg-white px-4 py-10 text-center" role="alert">
            <p className="m-0 text-ink-secondary">{text}</p>
            <button type="button" onClick={onRetry} className={outlineButton}>{retry}</button>
        </div>
    );
}

/** Пусто: текст и, если список сужен поиском, кнопка сброса; children — своё действие («Найти поездку») */
export function ApplicationsEmpty({ text, reset, children }: { text: string; reset?: { label: string; onClick: () => void }; children?: ReactNode }) {
    return (
        <div className="flex flex-col items-center gap-3 rounded-[12px] bg-white px-4 py-10 text-center">
            <p className="m-0 text-ink-secondary">{text}</p>
            {reset && <button type="button" onClick={reset.onClick} className={outlineButton}>{reset.label}</button>}
            {children}
        </div>
    );
}
