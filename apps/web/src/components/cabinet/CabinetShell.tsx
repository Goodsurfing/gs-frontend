import type { ReactNode } from "react";

import { Header } from "@/components/layout/header/Header";
import { SocialRibbon } from "@/components/layout/SocialRibbon";
import { SessionProvider } from "@/components/session/SessionProvider";
import type { Locale } from "@/i18n/config";
import { getTranslator } from "@/i18n/dictionary";
import { getHeaderBanner } from "@/lib/marketingBanner";

import { type CabinetMenuItem, CabinetFrame } from "./CabinetFrame";
import { RequireUser } from "./RequireUser";

/**
 * Каркас кабинета (PageLayout старого фронта): лента соцсетей, шапка в потоке, светлый фон,
 * меню раздела слева, без подвала. Гостя уводит на вход с возвратом сюда.
 */
export async function CabinetShell({ locale, items, need, children }: {
    locale: Locale;
    items: CabinetMenuItem[];
    /** Нужна роль: организатор или волонтёр */
    need?: "host" | "volunteer";
    children: ReactNode;
}) {
    const [t, tProfile, banner] = await Promise.all([getTranslator(locale), getTranslator(locale, "profile"), getHeaderBanner(locale)]);
    return (
        <SessionProvider>
            <RequireUser locale={locale} need={need} />
            <div id="page-layout" className="min-h-screen bg-[#FBFDFE]">
                <SocialRibbon t={t} />
                <Header locale={locale} t={t} tProfile={tProfile} banner={banner} variant="static" />
                <CabinetFrame items={items} labels={{ toggle: t("main.welcome.header.menu") }}>{children}</CabinetFrame>
            </div>
        </SessionProvider>
    );
}
