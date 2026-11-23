import type { ReactNode } from "react";

import { LanguageSwitcher } from "@/components/layout/LanguageSwitcher";
import { SessionProvider } from "@/components/session/SessionProvider";
import { type Locale, localePrefix } from "@/i18n/config";
import { getTranslator } from "@/i18n/dictionary";
import { routes } from "@/lib/routes";

import { RedirectIfSignedIn } from "./RedirectIfSignedIn";
import { TestRibbon } from "@/components/layout/SocialRibbon";

/**
 * Каркас страниц входа и регистрации: узкая шапка с логотипом, языком и
 * ссылкой «← На главную» / «← Назад» (cancelHref). Вошедшего уводит на
 * главную, если не сказано иначе (подтверждение почты, отписка).
 */
export async function AuthShell({ locale, cancelHref, stayIfSignedIn = false, children }: {
    locale: Locale;
    cancelHref: string;
    stayIfSignedIn?: boolean;
    children: ReactNode;
}) {
    const t = await getTranslator(locale);
    const toMain = cancelHref === routes.main(locale) || cancelHref === "/";
    return (
        <SessionProvider>
            {!stayIfSignedIn && <RedirectIfSignedIn href={routes.main(locale)} prefix={localePrefix(locale)} />}
            <TestRibbon />
            {/* Шапка: логотип и язык слева, «← На главную» (или «← Назад» — ко входу, к профилю) справа.
                Раньше «Отменить» висела отдельной кнопкой под шапкой и давала много пустоты сверху (07.11) */}
            <header className="box-border flex w-full items-center gap-[25px] border-b border-accent-bg bg-white px-[50px] py-5 down-sm:px-5 down-sm:py-3">
                <a href={routes.main(locale)} className="shrink-0">
                    {/* eslint-disable-next-line @next/next/no-img-element -- логотип */}
                    <img src="/web/icons/header/logo.svg" alt="Logotype" className="down-xs:h-9" />
                </a>
                <LanguageSwitcher locale={locale} label={t("Язык")} />
                <a href={cancelHref} className="ml-auto inline-flex items-center gap-1.5 text-[15px] whitespace-nowrap text-caption no-underline transition-colors hover:text-primary">
                    <span aria-hidden>←</span>
                    {toMain ? t("На главную") : t("login.Назад")}
                </a>
            </header>
            {/* На телефоне поля и кнопки не прижимаются к краям экрана (04.11) */}
            {/* Снизу — отступ: у этих страниц нет подвала, иначе последняя строка прилипает к краю экрана (07.11) */}
            <main className="box-border flex w-full justify-center pt-14 pb-20 down-sm:px-5 down-xs:pt-8 down-xs:pb-12">{children}</main>
        </SessionProvider>
    );
}
