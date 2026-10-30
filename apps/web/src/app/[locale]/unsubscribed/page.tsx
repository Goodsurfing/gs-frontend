import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { AuthMessage, outlinedLink } from "@/components/auth/AuthMessage";
import { AuthShell } from "@/components/auth/AuthShell";
import { isLocale } from "@/i18n/config";
import { getTranslator } from "@/i18n/dictionary";
import { authMetadata } from "@/lib/authPages";
import { routes } from "@/lib/routes";

type Props = {
    params: Promise<{ locale: string }>;
    searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { locale } = await params;
    return isLocale(locale) ? authMetadata(locale, routes.unsubscribed(locale), "unsubscribed.title") : {};
}

/**
 * Куда ведёт «Отписаться» из рекламного письма: бэкенд уже снял согласие и
 * перенаправил сюда; status=invalid — ссылка испорчена (UnsubscribedPage
 * старого фронта, GS-219). Из письма обычно приходят вошедшими — не уводим.
 */
export default async function UnsubscribedPage({ params, searchParams }: Props) {
    const { locale } = await params;
    if (!isLocale(locale)) notFound();
    const { status } = await searchParams;
    const t = await getTranslator(locale);
    return (
        <AuthShell locale={locale} cancelHref={routes.main(locale)} stayIfSignedIn>
            <AuthMessage
                title={t("unsubscribed.title")}
                hint={t("unsubscribed.hint")}
                action={<a href={routes.profilePrivacy(locale)} className={outlinedLink}>{t("unsubscribed.settings")}</a>}
            >
                {status === "invalid" ? t("unsubscribed.invalid") : t("unsubscribed.done")}
            </AuthMessage>
        </AuthShell>
    );
}
