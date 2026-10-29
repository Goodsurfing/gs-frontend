import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { LegalTranslationNotice } from "@/components/content/LegalTranslationNotice";
import { PageBanner } from "@/components/content/PageBanner";
import { PublicShell } from "@/components/layout/PublicShell";
import { PAYMENT_LOGOS, PAYMENT_SECURITY_TEXT } from "@/content/paymentSecurityPolicy";
import { isLocale } from "@/i18n/config";
import { getTranslator } from "@/i18n/dictionary";
import { routes } from "@/lib/routes";
import { pageMetadata } from "@/lib/seo";

// Статичный текст; шапка с баннером из админки обновляется раз в 5 минут
export const revalidate = 300;

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { locale } = await params;
    if (!isLocale(locale)) return {};
    const t = await getTranslator(locale, "seo");
    return pageMetadata({
        locale,
        path: routes.paymentSecurityPolicy(locale),
        title: t("paymentSecurityPolicy.title"),
        description: t("paymentSecurityPolicy.description"),
    });
}

/** Политика безопасности платежей — первая страница, перенесённая в новый фронт (GS-219). */
export default async function PaymentSecurityPolicyPage({ params }: Props) {
    const { locale } = await params;
    if (!isLocale(locale)) notFound();
    const t = await getTranslator(locale);

    return (
        <PublicShell locale={locale}>
            <div className="mx-auto flex max-w-[1920px] flex-col items-center justify-center pb-[100px] [@media(max-width:1200px)]:px-5">
                <PageBanner title={t("Политика безопасности платежей")} />
                {locale !== "ru" && <LegalTranslationNotice t={t} />}
                <section className="mt-[60px] flex w-full max-w-[1280px] flex-col">
                    <div className="flex flex-col gap-5">
                        <div className="flex flex-wrap items-center gap-6">
                            {PAYMENT_LOGOS[locale].map((logo) => (
                                // eslint-disable-next-line @next/next/no-img-element -- маленькие логотипы, как в старом фронте
                                <img key={logo.src} src={logo.src} alt={logo.alt} className="h-7 w-auto" />
                            ))}
                        </div>
                        {PAYMENT_SECURITY_TEXT[locale]}
                    </div>
                </section>
            </div>
        </PublicShell>
    );
}
