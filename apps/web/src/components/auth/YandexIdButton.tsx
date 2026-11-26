"use client";

import { useEffect, useState } from "react";

import type { Locale } from "@/i18n/config";
import { fetchYandexProvider, type OAuthProvider, startYandexFlow } from "@/lib/yandexId";

/** Логотип «Я» в красном круге — из макета кнопки Яндекс ID (yandex.ru/dev/id), без скриптов Яндекса */
export function YandexIdLogo({ className = "h-6 w-6" }: { className?: string }) {
    return (
        <svg aria-hidden viewBox="28 10 24 24" className={`shrink-0 ${className}`} xmlns="http://www.w3.org/2000/svg">
            <rect x="28" y="10" width="24" height="24" rx="12" fill="#FC3F1D" />
            <path d="M41.6911 29.212H44.1981V14.812H40.5515C36.8841 14.812 34.9572 16.6975 34.9572 19.4739C34.9572 21.6909 36.0139 22.9962 37.8994 24.3429L34.6257 29.212H37.34L40.9866 23.7628L39.7227 22.9133C38.1895 21.8773 37.4436 21.0693 37.4436 19.3288C37.4436 17.7956 38.521 16.7596 40.5722 16.7596H41.6911V29.212Z" fill="white" />
        </svg>
    );
}

/**
 * Яндекс включён? hint — ответ при рендере страницы (oauthProvidersServer):
 * provider/null — сразу знаем; undefined — API не ответил при рендере,
 * спрашиваем из браузера («loading», пока ждём). Ошибка — кнопки нет.
 */
export function useYandexProvider(hint: OAuthProvider | null | undefined): OAuthProvider | null | "loading" {
    const [fetched, setFetched] = useState<OAuthProvider | null | "loading">("loading");
    useEffect(() => {
        if (hint !== undefined) return;
        let cancelled = false;
        fetchYandexProvider()
            .then((provider) => !cancelled && setFetched(provider))
            .catch(() => !cancelled && setFetched(null));
        return () => {
            cancelled = true;
        };
    }, [hint]);
    return hint !== undefined ? hint : fetched;
}

/** Начать вход/привязку: запомнить поток и уйти на Яндекс; false — не вышло (нет sessionStorage, нет Web Crypto) */
export async function goToYandex(provider: OAuthProvider, options: Omit<Parameters<typeof startYandexFlow>[1], "origin">): Promise<boolean> {
    try {
        const url = await startYandexFlow(provider, { ...options, origin: window.location.origin });
        if (!url) return false;
        window.location.assign(url);
        return true;
    } catch {
        return false;
    }
}

/**
 * Кнопка «Войти с Яндекс ID» — основная версия по гайдлайну Яндекса
 * (yandex.ru/dev/id/doc/ru/codes/buttons-design): чёрная, логотип «Я» в
 * красном круге, белый текст, размер M (44 px), скругление 12 px; цвет, обводку,
 * текст и отступы между логотипом и текстом гайдлайн менять запрещает.
 * Переход — в этой же вкладке (verifier и state живут в sessionStorage вкладки),
 * возврат — на /oauth/yandex.
 */
export function YandexIdButton({ hint, locale, label, unavailable, returnTo, backTo, consentWording, onError }: {
    hint: OAuthProvider | null | undefined;
    locale: Locale;
    label: string;
    /** Текст, если уйти на Яндекс не получилось (браузер без sessionStorage) */
    unavailable: string;
    /** Куда вернуть после входа — считается в момент нажатия (returnAfterAuth) */
    returnTo: () => string;
    /** Куда ведёт «Вернуться ко входу» при ошибке */
    backTo: string;
    /** Регистрация с отмеченным согласием на рассылку — формулировка; иначе undefined */
    consentWording?: () => string | undefined;
    onError: (message: string) => void;
}) {
    const provider = useYandexProvider(hint);
    const [busy, setBusy] = useState(false);
    // Отступ сверху отрицательный: у блока VK над кнопкой свой нижний отступ 30 px — между кнопками остаётся 12 px
    const slot = "-mt-[18px] w-full max-w-[400px] pb-[30px]";
    if (provider === null) return null;
    // Ответа ещё нет — место под кнопку занято, вёрстка не прыгнет, когда она появится
    if (provider === "loading") return <div className={slot}><div aria-hidden className="h-11" /></div>;

    const start = async () => {
        if (busy) return;
        setBusy(true);
        const consent = consentWording?.();
        const ok = await goToYandex(provider, { mode: "login", locale, returnTo: returnTo(), backTo, ...(consent ? { consentWording: consent } : {}) });
        if (!ok) {
            setBusy(false);
            onError(unavailable);
        }
    };

    return (
        <div className={slot}>
            <button
                type="button"
                onClick={() => void start()}
                disabled={busy}
                aria-busy={busy}
                className="flex h-11 w-full cursor-pointer items-center justify-center gap-[13px] rounded-[12px] bg-yandex-id px-7 text-[16px] leading-[120%] font-medium text-white transition-colors hover:bg-yandex-id-hover disabled:cursor-wait disabled:opacity-80"
            >
                <YandexIdLogo />
                <span>{label}</span>
            </button>
        </div>
    );
}
