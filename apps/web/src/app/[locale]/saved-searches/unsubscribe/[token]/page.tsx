import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { AuthShell } from "@/components/auth/AuthShell";
import { SavedSearchUnsubscribe } from "@/components/cabinet/profile/SavedSearchUnsubscribe";
import { isLocale } from "@/i18n/config";
import { getTranslator } from "@/i18n/dictionary";
import { routes } from "@/lib/routes";
import { pageMetadata } from "@/lib/seo";

type Props = { params: Promise<{ locale: string; token: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { locale, token } = await params;
    if (!isLocale(locale)) return {};
    const t = await getTranslator(locale, "profile");
    return pageMetadata({ locale, path: routes.savedSearchUnsubscribe(locale, token), title: t("subscriptions.unsubTitle"), description: t("subscriptions.unsubTitle"), noindex: true });
}

/** «Отписаться от этой подборки» из письма — без входа; отписка — только по кнопке (почта открывает ссылки заранее) */
export default async function SavedSearchUnsubscribePage({ params }: Props) {
    const { locale, token } = await params;
    if (!isLocale(locale) || !/^[a-f0-9]{48}$/.test(token)) notFound();
    const t = await getTranslator(locale, "profile");
    const label = (key: string) => t(`subscriptions.${key}`, { name: "{{name}}" });
    return (
        <AuthShell locale={locale} cancelHref={routes.main(locale)} stayIfSignedIn>
            <SavedSearchUnsubscribe
                token={token}
                manageHref={routes.profileSubscriptions(locale)}
                labels={{ title: label("unsubTitle"), text: label("unsubText"), button: label("unsubButton"), done: label("unsubDone"), invalid: label("unsubInvalid"), error: label("error"), manage: label("title") }}
            />
        </AuthShell>
    );
}
