import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { AuthShell } from "@/components/auth/AuthShell";
import { VerifyEmailHash } from "@/components/auth/VerifyEmailHash";
import { isLocale } from "@/i18n/config";
import { getTranslator } from "@/i18n/dictionary";
import { authMetadata } from "@/lib/authPages";
import { routes } from "@/lib/routes";

type Props = { params: Promise<{ locale: string; id: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { locale, id } = await params;
    return isLocale(locale) ? authMetadata(locale, routes.verifyEmailHash(locale, id), "login.Подтверждение почты") : {};
}

/** Ссылка из письма «Подтвердите почту» (VerifyEmailHashPage старого фронта, GS-219) */
export default async function VerifyEmailHashPage({ params }: Props) {
    const { locale, id } = await params;
    if (!isLocale(locale)) notFound();
    const t = await getTranslator(locale);
    return (
        <AuthShell locale={locale} cancelHref={routes.signUp(locale)} stayIfSignedIn>
            <VerifyEmailHash
                hash={id}
                profileHref={routes.profileInfo(locale)}
                labels={{
                    title: t("login.Подтверждение почты"),
                    before: t("login.Спасибо! Ваш адрес электронной почты"),
                    after: t("login.был подтверждён."),
                    toProfile: t("login.Перейти в профиль"),
                }}
            />
        </AuthShell>
    );
}
