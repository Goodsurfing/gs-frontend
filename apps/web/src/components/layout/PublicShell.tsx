import type { ReactNode } from "react";

import type { Locale } from "@/i18n/config";
import { getTranslator } from "@/i18n/dictionary";
import { getHeaderBanner } from "@/lib/marketingBanner";

import { MembershipNudge } from "@/components/membership/MembershipNudge";
import { SessionProvider } from "@/components/session/SessionProvider";

import { Footer } from "./Footer";
import { Header, type HeaderVariant } from "./header/Header";
import { SocialRibbon } from "./SocialRibbon";

/** Подписи всплывающего предложения членства (GS-174) — общие для публичных страниц и кабинетов */
export const nudgeLabels = (t: (key: string) => string, tVolunteer: (key: string) => string, tHost: (key: string) => string) => ({
    volunteerTitle: tVolunteer("volunteer-dashboard.Оформи членство Гудсёрфинга и открой для себя бескрайний мир путешествий со смыслом!"),
    hostTitle: tHost("host-dashboard.Зарегистрируй членство организатора и получи больше возможностей для своего проекта!"),
    button: tVolunteer("volunteer-dashboard.Получить членство"),
    close: t("Закрыть"),
});

/**
 * Каркас публичной страницы (как MainPageLayout старого фронта): лента
 * соцсетей, шапка, содержимое на всю оставшуюся высоту, подвал.
 */
export async function PublicShell({ locale, headerVariant = "floating", topGap = false, footer = true, children }: {
    locale: Locale;
    headerVariant?: HeaderVariant;
    /**
     * Отступ под плавающую шапку (шире 1280 px) — как у страниц на
     * MainPageLayout старого фронта: содержимое начинается на 24 px ниже
     * капсулы (92 px под лентой соцсетей). Уже 1280 px шапка в потоке.
     */
    topGap?: boolean;
    /** Без подвала — страницы во весь экран (каталог вакансий с картой) */
    footer?: boolean;
    children: ReactNode;
}) {
    const [t, tProfile, tVolunteer, tHost, banner] = await Promise.all([
        getTranslator(locale),
        getTranslator(locale, "profile"),
        getTranslator(locale, "volunteer"),
        getTranslator(locale, "host"),
        getHeaderBanner(locale),
    ]);

    return (
        <SessionProvider>
            <div className="flex min-h-screen flex-col">
                <SocialRibbon t={t} />
                <Header locale={locale} t={t} tProfile={tProfile} banner={banner} variant={headerVariant} />
                <main className={`flex-1 ${topGap ? "pt-[92px] down-2xl:pt-0" : ""}`}>{children}</main>
                {footer && <Footer locale={locale} t={t} />}
            </div>
            <MembershipNudge locale={locale} labels={nudgeLabels(t, tVolunteer, tHost)} />
        </SessionProvider>
    );
}
