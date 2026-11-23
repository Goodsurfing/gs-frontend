import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";

import { PublicShell } from "@/components/layout/PublicShell";
import { RelevanceConfirm } from "@/components/relevance/RelevanceConfirm";
import { isLocale } from "@/i18n/config";
import { getTranslator } from "@/i18n/dictionary";
import { routes } from "@/lib/routes";
import { pageMetadata } from "@/lib/seo";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { locale } = await params;
    if (!isLocale(locale)) return {};
    const t = await getTranslator(locale);
    return pageMetadata({ locale, path: routes.hostRelevance(locale), title: `${t("relevance.title")} — GoodSurfing`, description: t("relevance.text"), noindex: true });
}

/**
 * «Ваши вакансии ещё актуальны?» — по ссылке из письма (GS-248), вход не нужен: токен в адресе
 * читает браузер, страница одинаковая для всех и не кэширует личного.
 */
export default async function HostRelevancePage({ params }: Props) {
    const { locale } = await params;
    if (!isLocale(locale)) notFound();
    const t = await getTranslator(locale);
    const keys = ["title", "text", "asked", "confirm", "all", "done", "none", "manage", "invalid", "empty", "error"] as const;
    const labels = Object.fromEntries(keys.map((key) => [key, t(`relevance.${key}`, key === "done" ? { count: "{{count}}" } : undefined)])) as Record<(typeof keys)[number], string>;
    return (
        <PublicShell locale={locale} topGap>
            {/* useSearchParams: страница статическая, токен читается в браузере */}
            <Suspense>
                <RelevanceConfirm manageHref={routes.myOffers(locale)} offerHref={routes.offer(locale, "{id}")} labels={labels} />
            </Suspense>
        </PublicShell>
    );
}
