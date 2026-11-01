import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { AuthShell } from "@/components/auth/AuthShell";
import { AuthTitle } from "@/components/auth/AuthTitle";
import { SignUpForm } from "@/components/auth/SignUpForm";
import { isLocale } from "@/i18n/config";
import { getTranslator } from "@/i18n/dictionary";
import { routes } from "@/lib/routes";
import { pageMetadata } from "@/lib/seo";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { locale } = await params;
    if (!isLocale(locale)) return {};
    const [t, tMain] = await Promise.all([getTranslator(locale), getTranslator(locale, "main")]);
    return pageMetadata({ locale, path: routes.signUp(locale), title: `${t("login.Регистрация пользователя")} — GoodSurfing`, description: tMain("seo.description"), noindex: true });
}

/** Регистрация (SignUpPage старого фронта, GS-219) */
export default async function SignUpPage({ params }: Props) {
    const { locale } = await params;
    if (!isLocale(locale)) notFound();
    const t = await getTranslator(locale);
    return (
        <AuthShell locale={locale} cancelHref={routes.main(locale)}>
            <div className="flex w-full flex-col items-center">
                <AuthTitle className="mb-[55px]">{t("login.Регистрация пользователя")}</AuthTitle>
                <SignUpForm
                    locale={locale}
                    signInHref={routes.signIn(locale)}
                    resetHref={routes.resetPassword(locale)}
                    privacyHref={routes.privacyPolicy(locale)}
                    confirmHref={routes.confirmEmail(locale)}
                    profileHref={routes.profileInfo(locale)}
                    labels={{
                        password: t("login.Пароль"),
                        submit: t("login.Зарегистрироваться"),
                        required: t("login.ПолеОбязательно"),
                        weakPassword: t("login.НедостаточноСложныйПароль"),
                        duplicate: t("login.Данный пользователь уже существует"),
                        invalid: t("login.Некорректно введены данные"),
                        maybeRegistered: t("login.Возможно, вы уже регистрировались."),
                        signIn: t("login.Войти"),
                        forgot: t("login.Забыли пароль?"),
                        consent: t("login.Хочу получать письма о новых проектах, акциях и новостях Гудсёрфинга"),
                        consentHint: t("login.marketingConsentHint"),
                        acceptBefore: t("login.Нажимая кнопку «Зарегистрироваться», я принимаю"),
                        privacyPolicy: t("login.Политику конфеденциальности ГудСёрфинга"),
                        noPosting: t("login.Мы не постим ничего без вашего ведома"),
                        deleted: t("login.Пользователь был удален или не создавался"),
                    }}
                />
            </div>
        </AuthShell>
    );
}
