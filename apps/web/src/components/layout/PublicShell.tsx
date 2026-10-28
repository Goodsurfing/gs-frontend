import type { ReactNode } from "react";

import type { Locale } from "@/i18n/config";
import { getTranslator } from "@/i18n/dictionary";
import { getHeaderBanner } from "@/lib/marketingBanner";

import { Footer } from "./Footer";
import { Header, type HeaderVariant } from "./header/Header";
import { SocialRibbon } from "./SocialRibbon";

/**
 * Каркас публичной страницы (как MainPageLayout старого фронта): лента
 * соцсетей, шапка, содержимое на всю оставшуюся высоту, подвал.
 */
export async function PublicShell({ locale, headerVariant = "floating", children }: {
    locale: Locale;
    headerVariant?: HeaderVariant;
    children: ReactNode;
}) {
    const [t, tProfile, banner] = await Promise.all([
        getTranslator(locale),
        getTranslator(locale, "profile"),
        getHeaderBanner(locale),
    ]);

    return (
        <div className="flex min-h-screen flex-col">
            <SocialRibbon t={t} />
            <Header locale={locale} t={t} tProfile={tProfile} banner={banner} variant={headerVariant} />
            <main className="flex-1">{children}</main>
            <Footer locale={locale} t={t} />
        </div>
    );
}
