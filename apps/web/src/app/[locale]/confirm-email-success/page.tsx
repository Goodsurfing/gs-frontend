import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { AuthMessage, outlinedLink } from "@/components/auth/AuthMessage";
import { AuthShell } from "@/components/auth/AuthShell";
import { RegisteredEmail } from "@/components/auth/ConfirmEmailResend";
import { isLocale } from "@/i18n/config";
import { getTranslator } from "@/i18n/dictionary";
import { authMetadata } from "@/lib/authPages";
import { routes } from "@/lib/routes";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { locale } = await params;
    return isLocale(locale) ? authMetadata(locale, routes.confirmEmailSuccess(locale), "login.Регистрация пользователя") : {};
}

/** Почта подтверждена — сюда ведёт бэкенд (ConfirmEmailSuccessPage старого фронта, GS-219) */
export default async function ConfirmEmailSuccessPage({ params }: Props) {
    const { locale } = await params;
    if (!isLocale(locale)) notFound();
    const t = await getTranslator(locale);
    return (
        <AuthShell locale={locale} cancelHref={routes.signUp(locale)}>
            <AuthMessage title={t("login.Регистрация пользователя")} action={<a href={routes.signIn(locale)} className={outlinedLink}>{t("login.Войти в свой аккаунт")}</a>}>
                {t("login.Спасибо! Ваш адрес электронной почты")}<RegisteredEmail /> {t("login.был подтверждён.")}
            </AuthMessage>
        </AuthShell>
    );
}
