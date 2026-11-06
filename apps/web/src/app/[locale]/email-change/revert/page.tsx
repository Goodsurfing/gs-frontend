import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";

import { EmailChangeLink } from "@/components/email-change/EmailChangeLink";
import { PublicShell } from "@/components/layout/PublicShell";
import { isLocale } from "@/i18n/config";
import { getTranslator } from "@/i18n/dictionary";
import { emailChangeLinkLabels } from "@/lib/emailChangeLabels";
import { routes } from "@/lib/routes";
import { pageMetadata } from "@/lib/seo";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { locale } = await params;
    if (!isLocale(locale)) return {};
    const t = await getTranslator(locale);
    return pageMetadata({ locale, path: routes.emailChangeRevert(locale), title: `${t("emailChange.revert.title")} — GoodSurfing`, description: t("emailChange.revert.text"), noindex: true });
}

/** Отмена смены почты по ссылке из письма на прежний адрес; токен читает браузер, страница статическая */
export default async function EmailChangeRevertPage({ params }: Props) {
    const { locale } = await params;
    if (!isLocale(locale)) notFound();
    const t = await getTranslator(locale);
    return (
        <PublicShell locale={locale} topGap>
            <Suspense>
                <EmailChangeLink mode="revert" nextHref={routes.resetPassword(locale)} labels={emailChangeLinkLabels(t, "revert")} />
            </Suspense>
        </PublicShell>
    );
}
