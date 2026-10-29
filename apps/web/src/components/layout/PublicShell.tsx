import type { ReactNode } from "react";

import type { Locale } from "@/i18n/config";
import { getTranslator } from "@/i18n/dictionary";
import { getHeaderBanner } from "@/lib/marketingBanner";

import { SessionProvider } from "@/components/session/SessionProvider";

import { Footer } from "./Footer";
import { Header, type HeaderVariant } from "./header/Header";
import { SocialRibbon } from "./SocialRibbon";

/**
 * Каркас публичной страницы (как MainPageLayout старого фронта): лента
 * соцсетей, шапка, содержимое на всю оставшуюся высоту, подвал.
 */
export async function PublicShell({ locale, headerVariant = "floating", topGap = false, children }: {
    locale: Locale;
    headerVariant?: HeaderVariant;
    /**
     * Отступ 100 px над лентой соцсетей шире 992 px — как у страниц на
     * MainPageLayout старого фронта (padding-top у всего каркаса под
     * плавающую шапку; ленту позже добавили внутрь, и отступ оказался над ней).
     * Вопрос об исправлении — у владельца; пока внешний вид повторяется.
     */
    topGap?: boolean;
    children: ReactNode;
}) {
    const [t, tProfile, banner] = await Promise.all([
        getTranslator(locale),
        getTranslator(locale, "profile"),
        getHeaderBanner(locale),
    ]);

    return (
        <SessionProvider>
            <div className={`flex min-h-screen flex-col ${topGap ? "pt-[100px] down-lg:pt-0" : ""}`}>
                <SocialRibbon t={t} />
                <Header locale={locale} t={t} tProfile={tProfile} banner={banner} variant={headerVariant} />
                <main className="flex-1">{children}</main>
                <Footer locale={locale} t={t} />
            </div>
        </SessionProvider>
    );
}
