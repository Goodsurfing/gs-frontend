import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { AuthMessage } from "@/components/auth/AuthMessage";
import { AuthShell } from "@/components/auth/AuthShell";
import { isLocale } from "@/i18n/config";
import { getTranslator } from "@/i18n/dictionary";
import { authMetadata } from "@/lib/authPages";
import { safeSitePath } from "@/lib/authSession";
import { routes } from "@/lib/routes";

type Props = { params: Promise<{ locale: string }>; searchParams: Promise<Record<string, string | string[] | undefined>> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { locale } = await params;
    return isLocale(locale) ? authMetadata(locale, routes.emailAlreadyConfirmed(locale), "login.Почта уже была подтверждена") : {};
}

/** Повторный переход по ссылке подтверждения (EmailAlreadyConfirmedPage старого фронта, GS-219) */
export default async function EmailAlreadyConfirmedPage({ params, searchParams }: Props) {
    const { locale } = await params;
    if (!isLocale(locale)) notFound();
    const t = await getTranslator(locale);
    // Пришли на регистрацию с вакансии — вход вернёт к ней (?next= из ссылки письма, gs-backend #524)
    const { next } = await searchParams;
    const back = safeSitePath(typeof next === "string" ? next : null);
    const signInHref = back ? `${routes.signIn(locale)}?next=${encodeURIComponent(back)}` : routes.signIn(locale);
    return (
        <AuthShell locale={locale} cancelHref={routes.signUp(locale)}>
            <AuthMessage title={t("login.Почта уже была подтверждена")}>
                {t("login.Похоже, эта почта уже подтверждена.")}{" "}
                <a href={signInHref} className="text-primary">{back ? t("login.Войти и вернуться к вакансии") : t("login.Перейти ко входу")}</a>
            </AuthMessage>
        </AuthShell>
    );
}
