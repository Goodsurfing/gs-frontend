import { getTranslator } from "@/i18n/dictionary";
import { isLocale } from "@/i18n/config";
import { notFound } from "next/navigation";

/**
 * Заглушка каркаса (GS-217): на стенде новый фронт доступен только с cookie
 * gs_web=1 и только по уже перенесённым адресам — пользователи её не видят.
 */
export default async function LocaleHome({ params }: { params: Promise<{ locale: string }> }) {
    const { locale } = await params;
    if (!isLocale(locale)) notFound();
    const t = await getTranslator(locale, "main");

    return (
        <main className="mx-auto max-w-[1200px] px-4 py-16">
            <h1 className="text-h1 text-ink">{t("seo.title")}</h1>
            <p className="mt-4 text-label text-caption">{t("seo.description")}</p>
        </main>
    );
}
