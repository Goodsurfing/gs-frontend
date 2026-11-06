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
    return pageMetadata({ locale, path: routes.emailChangeConfirm(locale), title: `${t("emailChange.confirm.title")} — GoodSurfing`, description: t("emailChange.confirm.text"), noindex: true });
}

/** Подтверждение новой почты по ссылке из письма; токен читает браузер, страница статическая */
export default async function EmailChangeConfirmPage({ params }: Props) {
    const { locale } = await params;
    if (!isLocale(locale)) notFound();
    const t = await getTranslator(locale);
    return (
        <PublicShell locale={locale} topGap>
            <Suspense>
                <EmailChangeLink mode="confirm" nextHref={routes.signIn(locale)} labels={emailChangeLinkLabels(t, "confirm")} />
            </Suspense>
        </PublicShell>
    );
}
