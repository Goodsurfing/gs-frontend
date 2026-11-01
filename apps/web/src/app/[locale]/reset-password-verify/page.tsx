import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { AuthShell } from "@/components/auth/AuthShell";
import { AuthTitle } from "@/components/auth/AuthTitle";
import { ResetPasswordConfirm } from "@/components/auth/ResetPasswordForms";
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
    return isLocale(locale) ? authMetadata(locale, routes.resetPasswordVerify(locale), "login.Восстановление пароля") : {};
}

/** Новый пароль по ссылке из письма, ?token= (ResetPasswordVerifyPage старого фронта, GS-219) */
export default async function ResetPasswordVerifyPage({ params, searchParams }: Props) {
    const { locale } = await params;
    if (!isLocale(locale)) notFound();
    const { token } = await searchParams;
    const t = await getTranslator(locale);
    return (
        <AuthShell locale={locale} cancelHref={routes.signIn(locale)}>
            <div className="flex w-full max-w-[402px] flex-col items-center">
                <AuthTitle className="mb-[55px]">{t("login.Восстановление пароля")}</AuthTitle>
                <ResetPasswordConfirm
                    token={typeof token === "string" && token ? token : null}
                    mainHref={routes.main(locale)}
                    labels={{
                        password: t("login.Новый пароль"),
                        repeat: t("login.Повторите новый пароль"),
                        mismatch: t("login.Пароли не совпадают"),
                        send: t("login.Отправить"),
                        error: t("login.Произошла ошибка"),
                    }}
                />
            </div>
        </AuthShell>
    );
}
