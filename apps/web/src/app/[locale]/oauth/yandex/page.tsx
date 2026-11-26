import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { YandexCallback } from "@/components/auth/YandexCallback";
import { isLocale, LOCALES, type Locale } from "@/i18n/config";
import { getTranslator } from "@/i18n/dictionary";
import { yandexCallbackLabels, type YandexCallbackLabels } from "@/lib/yandexIdLabels";

type Props = { params: Promise<{ locale: string }> };

export const metadata: Metadata = {
    title: "Яндекс ID — GoodSurfing",
    robots: { index: false, follow: false },
};

/**
 * Возврат с Яндекс ID (GS-336). Адрес один для всех языков — /oauth/yandex
 * (его регистрируют в приложении Яндекса); язык человека — в sessionStorage,
 * поэтому тексты всех трёх языков уходят в страницу (их немного).
 */
export default async function YandexCallbackPage({ params }: Props) {
    const { locale } = await params;
    if (!isLocale(locale)) notFound();
    const entries = await Promise.all(LOCALES.map(async (item) => [item, yandexCallbackLabels(await getTranslator(item))] as const));
    const labels = Object.fromEntries(entries) as Record<Locale, YandexCallbackLabels>;
    return (
        <>
            <header className="box-border flex w-full items-center border-b border-accent-bg bg-white px-[50px] py-5 down-sm:px-5 down-sm:py-3">
                {/* eslint-disable-next-line @next/next/no-img-element -- логотип */}
                <img src="/web/icons/header/logo.svg" alt="GoodSurfing" className="down-xs:h-9" />
            </header>
            <main className="box-border flex w-full justify-center pt-14 pb-20 down-sm:px-5 down-xs:pt-8 down-xs:pb-12">
                <YandexCallback labels={labels} />
            </main>
        </>
    );
}
