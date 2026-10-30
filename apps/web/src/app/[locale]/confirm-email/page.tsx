import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { AuthMessage } from "@/components/auth/AuthMessage";
import { AuthShell } from "@/components/auth/AuthShell";
import { ConfirmEmailResend, RegisteredEmail } from "@/components/auth/ConfirmEmailResend";
import { isLocale } from "@/i18n/config";
import { getTranslator } from "@/i18n/dictionary";
import { authMetadata } from "@/lib/authPages";
import { routes } from "@/lib/routes";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { locale } = await params;
    return isLocale(locale) ? authMetadata(locale, routes.confirmEmail(locale), "login.Регистрация пользователя") : {};
}

/** «Письмо отправлено» после регистрации (ConfirmEmailPage старого фронта, GS-219) */
export default async function ConfirmEmailPage({ params }: Props) {
    const { locale } = await params;
    if (!isLocale(locale)) notFound();
    const t = await getTranslator(locale);
    return (
        <AuthShell locale={locale} cancelHref={routes.signUp(locale)}>
            <AuthMessage
                title={t("login.Регистрация пользователя")}
                hint={t("Если вы не видите письмо, проверьте, не попало ли оно в папку «Спам».")}
                action={<ConfirmEmailResend labels={{ resend: t("login.Отправить подтверждение ещё раз"), wait: t("login.Отправить можно через"), error: t("login.Произошла ошибка") }} />}
            >
                {t("login.На")} <RegisteredEmail /> {t("login.было отправлено письмо со ссылкой для подтверждения почты.")}
            </AuthMessage>
        </AuthShell>
    );
}
