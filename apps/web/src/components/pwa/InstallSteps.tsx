import type { ReactNode } from "react";

export interface InstallStepsLabels {
    /** «Нажмите „Поделиться“ внизу экрана…» */
    share: string;
    /** «Выберите „На экран «Домой»“…» */
    addToHome: string;
    /** «Нажмите „Добавить“…» */
    add: string;
    /** «Откройте Гудсёрфинг с экрана „Домой“, войдите и включите уведомления» */
    open: string;
}

/** Значок «Поделиться» Safari: квадрат со стрелкой вверх */
export function ShareIcon({ className = "h-6 w-6" }: { className?: string }) {
    return (
        <svg aria-hidden viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 3v12" /><path d="m8 7 4-4 4 4" /><path d="M8 10H6a1 1 0 0 0-1 1v9a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-9a1 1 0 0 0-1-1h-2" />
        </svg>
    );
}

/** Значок «На экран „Домой“»: квадрат с плюсом */
export function AddToHomeIcon({ className = "h-6 w-6" }: { className?: string }) {
    return (
        <svg aria-hidden viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <rect x="4" y="4" width="16" height="16" rx="3" /><path d="M12 8v8" /><path d="M8 12h8" />
        </svg>
    );
}

function AddIcon({ className = "h-6 w-6" }: { className?: string }) {
    return (
        <svg aria-hidden viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="m5 12 5 5 9-10" />
        </svg>
    );
}

function AppIcon() {
    return (
        // eslint-disable-next-line @next/next/no-img-element -- значок 180×180 из public, 11 КБ; размер задан, место зарезервировано
        <img src="/web/icons/app/icon-180.png" alt="" width={24} height={24} loading="lazy" className="h-6 w-6 rounded-[6px] border border-accent-bg" />
    );
}

/**
 * Пошаговая инструкция «Установить на iPhone»: «Поделиться» → «На экран „Домой“» →
 * «Добавить» → открыть с экрана «Домой». Значки — встроенные SVG (без загрузки
 * картинок), чтобы на медленном интернете инструкция была видна сразу.
 */
export function InstallSteps({ labels }: { labels: InstallStepsLabels }) {
    const steps: { icon: ReactNode; text: string }[] = [
        { icon: <ShareIcon />, text: labels.share },
        { icon: <AddToHomeIcon />, text: labels.addToHome },
        { icon: <AddIcon />, text: labels.add },
        { icon: <AppIcon />, text: labels.open },
    ];
    return (
        <ol className="flex flex-col gap-3">
            {steps.map((step, index) => (
                <li key={index} className="flex items-start gap-3 text-[15px] leading-[140%] text-ink">
                    <span aria-hidden className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[10px] bg-accent-bg/40 text-primary">{step.icon}</span>
                    <span className="pt-2"><span className="font-semibold">{index + 1}. </span>{step.text}</span>
                </li>
            ))}
        </ol>
    );
}
