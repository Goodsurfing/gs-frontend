import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { AuthShell } from "@/components/auth/AuthShell";
import { VerifyEmailSend } from "@/components/auth/VerifyEmailSend";
import { isLocale } from "@/i18n/config";
import { getTranslator } from "@/i18n/dictionary";
import { authMetadata } from "@/lib/authPages";
import { routes } from "@/lib/routes";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { locale } = await params;
    return isLocale(locale) ? authMetadata(locale, routes.verifyEmail(locale), "login.Подтверждение почты") : {};
}

/** Подтверждение почты из профиля (VerifyEmailPage старого фронта, GS-219) */
export default async function VerifyEmailPage({ params }: Props) {
    const { locale } = await params;
    if (!isLocale(locale)) notFound();
    const t = await getTranslator(locale);
    return (
        <AuthShell locale={locale} cancelHref={routes.profileInfo(locale)} stayIfSignedIn>
            <VerifyEmailSend
                mainHref={routes.main(locale)}
                labels={{
                    submit: t("login.Подтвердить"),
                    note: t("login.Вам на почту придёт письмо с подтверждением"),
                    sent: t("login.Сообщение с подтверждением отправлено на ваш email"),
                    resend: t("login.Отправить ещё раз"),
                    resendIn: t("login.Отправить ещё раз через {{seconds}}", { seconds: "{{seconds}}" }),
                    error: t("login.Произошла ошибка"),
                }}
            />
        </AuthShell>
    );
}
