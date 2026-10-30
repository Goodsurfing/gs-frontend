import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { AuthMessage } from "@/components/auth/AuthMessage";
import { AuthShell } from "@/components/auth/AuthShell";
import { isLocale } from "@/i18n/config";
import { getTranslator } from "@/i18n/dictionary";
import { authMetadata } from "@/lib/authPages";
import { routes } from "@/lib/routes";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { locale } = await params;
    return isLocale(locale) ? authMetadata(locale, routes.emailExpired(locale), "login.Истёк срок подтверждения почты") : {};
}

/** Ссылка из письма устарела — сюда ведёт бэкенд (EmailExpiredPage старого фронта, GS-219) */
export default async function EmailExpiredPage({ params }: Props) {
    const { locale } = await params;
    if (!isLocale(locale)) notFound();
    const t = await getTranslator(locale);
    return (
        <AuthShell locale={locale} cancelHref={routes.signIn(locale)}>
            <AuthMessage title={t("login.Истёк срок подтверждения почты")}>
                {t("login.Ссылка для подтверждения больше недействительна — её срок истёк.")}
                {t("login.Вы можете")}{" "}
                <a href={routes.signIn(locale)} className="text-primary">{t("login.войти снова")}</a>,{" "}
                {t("login.чтобы получить новую.")}
            </AuthMessage>
        </AuthShell>
    );
}
