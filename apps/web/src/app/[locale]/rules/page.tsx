import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { LegalDocumentPage } from "@/components/content/LegalDocumentPage";
import { RULES } from "@/content/legal";
import { isLocale } from "@/i18n/config";
import { getTranslator } from "@/i18n/dictionary";
import { routes } from "@/lib/routes";
import { pageMetadata } from "@/lib/seo";

// Статичный текст; шапка с баннером из админки обновляется раз в 5 минут
export const revalidate = 300;

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { locale } = await params;
    if (!isLocale(locale)) return {};
    const t = await getTranslator(locale, "seo");
    return pageMetadata({
        locale,
        path: routes.rules(locale),
        title: t("rules.title"),
        description: t("rules.description"),
    });
}

/** Правила платформы (GS-219). */
export default async function RulesPage({ params }: Props) {
    const { locale } = await params;
    if (!isLocale(locale)) notFound();
    const t = await getTranslator(locale);

    return <LegalDocumentPage locale={locale} title={t("Правила")} document={RULES[locale]} />;
}
