import { notFound } from "next/navigation";

import { Footer } from "@/components/layout/Footer";
import { SocialRibbon } from "@/components/layout/SocialRibbon";
import { isLocale } from "@/i18n/config";
import { getTranslator } from "@/i18n/dictionary";

/**
 * Заглушка каркаса (GS-217): на стенде новый фронт доступен только с cookie
 * gs_web=1 и только по уже перенесённым адресам — пользователи её не видят.
 * Здесь собираются общие элементы для визуального сравнения со старым сайтом.
 */
export default async function LocaleHome({ params }: { params: Promise<{ locale: string }> }) {
    const { locale } = await params;
    if (!isLocale(locale)) notFound();
    const t = await getTranslator(locale);
    const tMain = await getTranslator(locale, "main");

    return (
        <>
            <SocialRibbon t={t} />
            <main className="mx-auto max-w-[1200px] px-4 py-16">
                <h1 className="text-h1 text-ink">{tMain("seo.title")}</h1>
                <p className="mt-4 text-label text-caption">{tMain("seo.description")}</p>
            </main>
            <Footer locale={locale} t={t} />
        </>
    );
}
