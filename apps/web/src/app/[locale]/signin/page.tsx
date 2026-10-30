import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { AuthShell } from "@/components/auth/AuthShell";
import { SignInForm } from "@/components/auth/SignInForm";
import { isLocale } from "@/i18n/config";
import { getTranslator } from "@/i18n/dictionary";
import { routes } from "@/lib/routes";
import { pageMetadata } from "@/lib/seo";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { locale } = await params;
    if (!isLocale(locale)) return {};
    const [t, tMain] = await Promise.all([getTranslator(locale), getTranslator(locale, "main")]);
    return pageMetadata({ locale, path: routes.signIn(locale), title: `${t("login.Вход")} — GoodSurfing`, description: tMain("seo.description"), noindex: true });
}

// Ответы API о неудачном входе → тексты (errorMessages старого фронта)
const ERRORS = [
    "User not found", "Ошибка авторизации", "Invalid password", "Данный пользователь уже существует", "Некорректно введены данные",
    "Для входа в систему необходимо подтвердить email адрес. Проверьте вашу почту.", "Пользователь был удален или не создавался",
];

/** Вход (SignInPage старого фронта, GS-219) */
export default async function SignInPage({ params }: Props) {
    const { locale } = await params;
    if (!isLocale(locale)) notFound();
    const t = await getTranslator(locale);
    return (
        <AuthShell locale={locale} cancelHref={routes.main(locale)}>
            <div className="flex w-full justify-center">
                <div className="flex w-full flex-col items-center">
                    <h2 className="mb-[55px] text-[1.5em] font-bold">{t("login.Вход")}</h2>
                    <SignInForm
                        locale={locale}
                        resetHref={routes.resetPassword(locale)}
                        signUpHref={routes.signUp(locale)}
                        profileHref={routes.profileInfo(locale)}
                        labels={{
                            password: t("login.Пароль"),
                            submit: t("login.Войти"),
                            remember: t("login.Запомнить меня"),
                            forgot: t("login.Забыли пароль?"),
                            notRegistered: t("login.Не зарегистрированы на Гудсёрфинге?"),
                            signUp: t("login.Зарегистрироваться"),
                            deleted: t("login.Пользователь был удален или не создавался"),
                            errors: Object.fromEntries(ERRORS.map((key) => [key, t(`login.${key}`)])),
                        }}
                    />
                </div>
            </div>
        </AuthShell>
    );
}
