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
    return isLocale(locale) ? authMetadata(locale, routes.emailAlreadyConfirmed(locale), "login.Почта уже была подтверждена") : {};
}

/** Повторный переход по ссылке подтверждения (EmailAlreadyConfirmedPage старого фронта, GS-219) */
export default async function EmailAlreadyConfirmedPage({ params }: Props) {
    const { locale } = await params;
    if (!isLocale(locale)) notFound();
    const t = await getTranslator(locale);
    return (
        <AuthShell locale={locale} cancelHref={routes.signUp(locale)}>
            <AuthMessage title={t("login.Почта уже была подтверждена")}>
                {t("login.Похоже, эта почта уже подтверждена.")}{" "}
                <a href={routes.signIn(locale)} className="text-primary">{t("login.Перейти ко входу")}</a>
            </AuthMessage>
        </AuthShell>
    );
}
