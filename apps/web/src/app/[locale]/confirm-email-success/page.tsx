import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { AuthMessage, outlinedLink } from "@/components/auth/AuthMessage";

const primaryLink = "inline-block rounded-[10px] border border-primary bg-primary px-[50px] py-3.5 text-center text-[1rem] leading-[1.375rem] text-white transition-all duration-300 hover:bg-white hover:text-primary";
import { AuthShell } from "@/components/auth/AuthShell";
import { ContinueAfterConfirm } from "@/components/auth/ContinueAfterConfirm";
import { EmailConfirmedGoal, RegisteredEmail } from "@/components/auth/ConfirmEmailResend";
import { isLocale } from "@/i18n/config";
import { getTranslator } from "@/i18n/dictionary";
import { authMetadata } from "@/lib/authPages";
import { safeSitePath } from "@/lib/authSession";
import { routes } from "@/lib/routes";

type Props = { params: Promise<{ locale: string }>; searchParams: Promise<Record<string, string | string[] | undefined>> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { locale } = await params;
    return isLocale(locale) ? authMetadata(locale, routes.confirmEmailSuccess(locale), "login.Регистрация пользователя") : {};
}

/** Почта подтверждена — сюда ведёт бэкенд (ConfirmEmailSuccessPage старого фронта, GS-219) */
export default async function ConfirmEmailSuccessPage({ params, searchParams }: Props) {
    const { locale } = await params;
    if (!isLocale(locale)) notFound();
    const t = await getTranslator(locale);
    // Пришли на регистрацию с вакансии — вход вернёт к ней (?next= из ссылки письма, gs-backend #524)
    const { next } = await searchParams;
    const back = safeSitePath(typeof next === "string" ? next : null);
    const signInHref = back ? `${routes.signIn(locale)}?next=${encodeURIComponent(back)}` : routes.signIn(locale);
    return (
        <AuthShell locale={locale} cancelHref={routes.signUp(locale)}>
            <AuthMessage title={t("login.Регистрация пользователя")} action={(
                <ContinueAfterConfirm
                    signIn={{ href: signInHref, label: back ? t("login.Войти и вернуться к вакансии") : t("login.Войти в свой аккаунт") }}
                    back={back}
                    catalogHref={routes.offersMap(locale)}
                    labels={{ backToOffer: t("login.Вернуться к вакансии"), toCatalog: t("login.Перейти к вакансиям") }}
                    className={back ? primaryLink : outlinedLink}
                />
            )}>
                {t("login.Спасибо! Ваш адрес электронной почты")}<RegisteredEmail /> {t("login.был подтверждён.")}
            </AuthMessage>
            <EmailConfirmedGoal />
        </AuthShell>
    );
}
