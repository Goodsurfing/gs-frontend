import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { HostRegister } from "@/components/cabinet/host/HostRegister";
import { RequireUser } from "@/components/cabinet/RequireUser";
import { Header } from "@/components/layout/header/Header";
import { SocialRibbon } from "@/components/layout/SocialRibbon";
import { SessionProvider } from "@/components/session/SessionProvider";
import { isLocale } from "@/i18n/config";
import { getTranslator } from "@/i18n/dictionary";
import { authMetadata } from "@/lib/authPages";
import { hostDescriptionLabels } from "@/lib/hostCabinet";
import { getHeaderBanner } from "@/lib/marketingBanner";
import { routes } from "@/lib/routes";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { locale } = await params;
    return isLocale(locale) ? authMetadata(locale, routes.hostRegister(locale), "main.sidebar.Создать организацию") : {};
}

/**
 * Создание организации (HostRegisterPage старого фронта): шапка без меню
 * кабинета, белый фон. В старом фронте гость видел форму и получал ошибку
 * при сохранении — здесь гостя сразу ведёт на вход.
 */
export default async function HostRegisterPage({ params }: Props) {
    const { locale } = await params;
    if (!isLocale(locale)) notFound();
    const [t, tProfile, th, banner, labels] = await Promise.all([
        getTranslator(locale),
        getTranslator(locale, "profile"),
        getTranslator(locale, "host"),
        getHeaderBanner(locale),
        hostDescriptionLabels(locale),
    ]);
    return (
        <SessionProvider>
            <RequireUser locale={locale} />
            <SocialRibbon t={t} />
            <Header locale={locale} t={t} tProfile={tProfile} banner={banner} variant="static" />
            <main className="flex w-full flex-col gap-10 px-[120px] pt-10 pb-[4.125rem] down-1000:mx-auto down-1000:items-center down-1000:justify-center down-1000:gap-0 down-1000:px-5 down-1000:pt-5">
                <h2 className="text-h2 down-1000:pb-5 down-1000:text-center down-600:pb-0">{th("hostDescription.Создание организации")}</h2>
                <HostRegister infoHref={routes.hostInfo(locale)} organizationHref={routes.organization(locale, "{id}")} labels={labels} />
            </main>
        </SessionProvider>
    );
}
