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
    return isLocale(locale) ? authMetadata(locale, routes.confirmError(locale), "login.Произошла неизвестная ошибка!") : {};
}

/** Ссылка из письма не сработала — сюда ведёт бэкенд (ConfirmErrorPage старого фронта, GS-219) */
export default async function ConfirmErrorPage({ params }: Props) {
    const { locale } = await params;
    if (!isLocale(locale)) notFound();
    const t = await getTranslator(locale);
    return (
        <AuthShell locale={locale} cancelHref={routes.signIn(locale)}>
            <AuthMessage title={t("login.Произошла неизвестная ошибка!")}>
                <a href={routes.signIn(locale)} className="text-primary">{t("login.Попробуйте ещё раз.")}</a>
            </AuthMessage>
        </AuthShell>
    );
}
