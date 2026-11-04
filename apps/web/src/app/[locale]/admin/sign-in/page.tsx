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
export default async function AdminSignInPage({ searchParams }: { searchParams: Promise<{ denied?: string }> }) {
    const [{ denied }, t] = await Promise.all([searchParams, getTranslator("ru")]);
    return (
        <AuthShell locale="ru" cancelHref="/">
            <div className="flex w-full flex-col items-center">
                <h2 className={`${denied ? "mb-4" : "mb-[55px]"} text-center text-[1.5em] font-bold`}>Войти в панель администратора</h2>
                {denied && <p role="alert" className="mb-8 text-center text-error">У этой учётной записи нет прав администратора. Войдите под администратором.</p>}
                <SignInForm
                    locale="ru"
                    resetHref="/reset-password"
                    signUpHref="/signup"
                    profileHref="/admin"
                    admin
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
