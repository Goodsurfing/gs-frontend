import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { CabinetShell } from "@/components/cabinet/CabinetShell";
import { PasswordForm } from "@/components/cabinet/profile/ProfileSettings";
import { isLocale } from "@/i18n/config";
import { getTranslator } from "@/i18n/dictionary";
import { authMetadata } from "@/lib/authPages";
import { profileMenu } from "@/lib/cabinetMenus";
import { routes } from "@/lib/routes";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { locale } = await params;
    return isLocale(locale) ? authMetadata(locale, routes.profileResetPassword(locale), "main.sidebar.Пароль") : {};
}

/** Кабинет: «Изменение пароля» (ProfileResetPasswordPage старого фронта, GS-219) */
export default async function ProfilePasswordPage({ params }: Props) {
    const { locale } = await params;
    if (!isLocale(locale)) notFound();
    const [t, tp] = await Promise.all([getTranslator(locale), getTranslator(locale, "profile")]);
    const p = (key: string) => tp(`password.${key}`);
    return (
        <CabinetShell locale={locale} items={profileMenu(locale, t)}>
            <main className="w-full">
                <div className="mb-[30px] flex w-full items-end justify-between"><h2 className="text-[1.625rem] font-normal text-ink-secondary">{p("Изменение пароля")}</h2></div>
                <PasswordForm
                    labels={{
                        current: p("Текущий пароль"),
                        next: p("Новый пароль"),
                        repeat: p("Повторите новый пароль"),
                        save: p("Сохранить"),
                        saved: p("Изменение пароля произошло успешно"),
                        error: p("Произошла ошибка"),
                        currentRequired: p("Текущий пароль обязателен"),
                        nextRequired: p("Новый пароль обязателен"),
                        mismatch: p("Пароли должны совпадать"),
                        repeatRequired: p("Повторите новый пароль"),
                    }}
                />
            </main>
        </CabinetShell>
    );
}
