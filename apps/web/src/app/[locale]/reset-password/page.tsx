import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { AuthShell } from "@/components/auth/AuthShell";
import { AuthTitle } from "@/components/auth/AuthTitle";
import { ResetPasswordRequest } from "@/components/auth/ResetPasswordForms";
import { isLocale } from "@/i18n/config";
import { getTranslator } from "@/i18n/dictionary";
import { authMetadata } from "@/lib/authPages";
import { routes } from "@/lib/routes";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { locale } = await params;
    return isLocale(locale) ? authMetadata(locale, routes.resetPassword(locale), "Восстановление пароля") : {};
}

/** Восстановление пароля: почта → письмо со ссылкой (ResetPasswordPage старого фронта, GS-219) */
export default async function ResetPasswordPage({ params }: Props) {
    const { locale } = await params;
    if (!isLocale(locale)) notFound();
    const t = await getTranslator(locale);
    return (
        <AuthShell locale={locale} cancelHref={routes.main(locale)}>
            <div className="flex w-full flex-col items-center">
                <AuthTitle className="mb-[55px]">{t("Восстановление пароля")}</AuthTitle>
                <ResetPasswordRequest
                    labels={{
                        send: t("login.Отправить"),
                        sentBefore: t("login.На"),
                        sentAfter: t("login.было отправлено письмо со ссылкой для восстановления пароля."),
                        spam: t("login.Если вы не видите письмо, проверьте, не попало ли оно в папку «Спам»."),
                        error: t("login.Произошла ошибка"),
                    }}
                />
            </div>
        </AuthShell>
    );
}
