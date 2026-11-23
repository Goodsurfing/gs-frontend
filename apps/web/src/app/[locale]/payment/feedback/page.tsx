import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";

import { CheckoutFeedbackByLink } from "@/components/checkout-feedback/CheckoutFeedbackByLink";
import { PublicShell } from "@/components/layout/PublicShell";
import { isLocale } from "@/i18n/config";
import { getTranslator } from "@/i18n/dictionary";
import { checkoutFeedbackLabels } from "@/lib/checkoutFeedback";
import { routes } from "@/lib/routes";
import { pageMetadata } from "@/lib/seo";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { locale } = await params;
    if (!isLocale(locale)) return {};
    const t = await getTranslator(locale);
    return pageMetadata({ locale, path: routes.paymentFeedback(locale), title: `${t("checkoutFeedback.title")} — GoodSurfing`, description: t("checkoutFeedback.hint"), noindex: true });
}

/** Ответ «что помешало оплатить» по ссылке из письма «Оплата не завершилась» (GS-260); вход не нужен */
export default async function PaymentFeedbackPage({ params }: Props) {
    const { locale } = await params;
    if (!isLocale(locale)) notFound();
    const t = await getTranslator(locale);
    return (
        <PublicShell locale={locale} topGap>
            <main className="mx-auto w-full max-w-[560px] px-4 py-10">
                <Suspense>
                    <CheckoutFeedbackByLink labels={checkoutFeedbackLabels(t)} invalid={t("checkoutFeedback.invalid")} membershipHref={routes.membership(locale)} back={t("checkoutFeedback.back")} />
                </Suspense>
            </main>
        </PublicShell>
    );
}
