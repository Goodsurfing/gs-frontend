import type { Metadata } from "next";

import { AuthShell } from "@/components/auth/AuthShell";
import { SignInForm } from "@/components/auth/SignInForm";
import { getTranslator } from "@/i18n/dictionary";

export const metadata: Metadata = { title: "Вход в админку — GoodSurfing", robots: { index: false, follow: false } };

const ERRORS = [
    "User not found", "Ошибка авторизации", "Invalid password", "Некорректно введены данные",
    "Для входа в систему необходимо подтвердить email адрес. Проверьте вашу почту.", "Пользователь был удален или не создавался",
];

/** Вход в админку (AdminSignInPage старого фронта): обычный вход, после него — в админку */
export default async function AdminSignInPage() {
    const t = await getTranslator("ru");
    return (
        <AuthShell locale="ru" cancelHref="/">
            <div className="flex w-full flex-col items-center">
                <h2 className="mb-[55px] text-[1.5em] font-bold">Войти в панель администратора</h2>
                <SignInForm
                    locale="ru"
                    resetHref="/reset-password"
                    signUpHref="/signup"
                    profileHref="/admin"
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
        </AuthShell>
    );
}
