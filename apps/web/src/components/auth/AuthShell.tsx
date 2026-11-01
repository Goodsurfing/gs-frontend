import type { ReactNode } from "react";

import { LanguageSwitcher } from "@/components/layout/LanguageSwitcher";
import { SessionProvider } from "@/components/session/SessionProvider";
import type { Locale } from "@/i18n/config";
import { getTranslator } from "@/i18n/dictionary";
import { routes } from "@/lib/routes";

import { RedirectIfSignedIn } from "./RedirectIfSignedIn";

/**
 * Каркас страниц входа и регистрации (SignLayout старого фронта): узкая
 * шапка с логотипом и языком (уже 480 px её нет), справа «Отменить» —
 * рамкой, на телефоне крестиком. Вошедшего уводит на главную, если не
 * сказано иначе (подтверждение почты, отписка).
 */
export async function AuthShell({ locale, cancelHref, stayIfSignedIn = false, children }: {
    locale: Locale;
    cancelHref: string;
    stayIfSignedIn?: boolean;
    children: ReactNode;
}) {
    const t = await getTranslator(locale);
    return (
        <SessionProvider>
            {!stayIfSignedIn && <RedirectIfSignedIn href={routes.main(locale)} />}
            <header className="box-border flex w-full items-center border-b border-accent-bg bg-white px-[50px] py-5 down-xs:hidden">
                <a href={routes.main(locale)} className="mr-[25px]">
                    {/* eslint-disable-next-line @next/next/no-img-element -- логотип */}
                    <img src="/web/icons/header/logo.svg" alt="Logotype" />
                </a>
                <LanguageSwitcher locale={locale} label={t("Язык")} />
            </header>
            <div className="mb-[50px] box-border flex w-full justify-end p-5 down-xs:mb-2.5 down-xs:px-5 down-xs:py-[30px]">
                <a href={cancelHref} className="inline-block rounded-[10px] border border-caption px-[50px] py-3.5 text-center text-[1rem] leading-[1.375rem] text-caption transition-all duration-300 hover:border-primary down-xs:hidden">
                    {t("login.Отменить")}
                </a>
                <a href={cancelHref} className="hidden down-xs:block">
                    {/* eslint-disable-next-line @next/next/no-img-element -- иконка */}
                    <img src="/web/icons/auth/mobile-cancel.svg" alt={t("login.Отменить")} />
                </a>
            </div>
            <main className="flex w-full justify-center">{children}</main>
        </SessionProvider>
    );
}
