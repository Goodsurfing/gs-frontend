import { notFound } from "next/navigation";

import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/header/Header";
import { SocialRibbon } from "@/components/layout/SocialRibbon";
import { isLocale } from "@/i18n/config";
import { getTranslator } from "@/i18n/dictionary";
import { getHeaderBanner } from "@/lib/marketingBanner";

// Баннер под шапкой меняется в админке — страница пересобирается раз в 5 минут
export const revalidate = 300;

/**
 * Заглушка каркаса (GS-217): на стенде новый фронт доступен только с cookie
 * gs_web=1 и только по уже перенесённым адресам — пользователи её не видят.
 * Здесь собираются общие элементы для визуального сравнения со старым сайтом.
 */
export default async function LocaleHome({ params }: { params: Promise<{ locale: string }> }) {
    const { locale } = await params;
    if (!isLocale(locale)) notFound();
    const t = await getTranslator(locale);
    const [tMain, tProfile, banner] = await Promise.all([
        getTranslator(locale, "main"),
        getTranslator(locale, "profile"),
        getHeaderBanner(locale),
    ]);

    return (
        <>
            <SocialRibbon t={t} />
            <Header locale={locale} t={t} tProfile={tProfile} banner={banner} />
            <main className="mx-auto max-w-[1200px] px-4 py-16">
                <h1 className="text-h1 text-ink">{tMain("seo.title")}</h1>
                <p className="mt-4 text-label text-caption">{tMain("seo.description")}</p>
            </main>
            <Footer locale={locale} t={t} />
        </>
    );
}
