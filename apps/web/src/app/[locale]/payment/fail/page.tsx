import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";

import { PublicShell } from "@/components/layout/PublicShell";
import { PaymentFailFeedback } from "@/components/checkout-feedback/PaymentFailFeedback";
import { checkoutFeedbackLabels } from "@/lib/checkoutFeedback";
import { isLocale } from "@/i18n/config";
import { getTranslator } from "@/i18n/dictionary";
import { routes } from "@/lib/routes";
import { pageMetadata } from "@/lib/seo";

type Props = {
    params: Promise<{ locale: string }>;
    searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { locale } = await params;
    if (!isLocale(locale)) return {};
    const t = await getTranslator(locale, "donation");
    return pageMetadata({ locale, path: routes.paymentFail(locale), title: t("Ошибка оплаты"), description: t("Произошла ошибка при обработке платежа"), noindex: true });
}

/**
 * Возврат с ЮKassa, если оплата членства не прошла; причина — в ?reason=
 * (PaymentFailPage старого фронта, GS-219). Входа не требует: в старом
 * фронте гостя уводило на вход, хотя на странице нет ничего личного.
 */
export default async function PaymentFailPage({ params, searchParams }: Props) {
    const { locale } = await params;
    if (!isLocale(locale)) notFound();
    const { reason, tariff } = await searchParams;
    const [t, tCommon] = await Promise.all([getTranslator(locale, "donation"), getTranslator(locale)]);
    const message = reason === "not_found" ? t("Платеж не найден") : reason === "cancelled" ? t("Оплата была отменена") : t("Произошла ошибка при обработке платежа");
    // «Попробовать ещё раз» — сразу к оплате того же тарифа; тариф неизвестен — к странице членства
    const retryHref = typeof tariff === "string" && /^[a-z0-9_]{1,40}$/.test(tariff) ? `${routes.payment(locale)}?tariff=${tariff}` : routes.membership(locale);
    return (
        <PublicShell locale={locale} topGap>
            <div className="flex min-h-[60vh] items-center justify-center p-8 down-sm:px-5 down-sm:py-6">
                <div className="w-full max-w-[600px] text-center">
                    <div aria-hidden className="mb-4 text-[3rem] down-sm:mb-2 down-sm:text-[2.5rem]">⚠️</div>
                    <h1 className="mb-3 text-[2rem] font-bold text-[#d32f2f] down-sm:text-[1.625rem]">{t("Ошибка оплаты")}</h1>
                    <p className="mb-2 text-[1.25rem] font-medium text-[#333] down-sm:text-[1.0625rem]">{message}</p>
                    <p className="mb-6 text-[1rem] leading-6 text-[#666] down-sm:text-[0.9375rem]">{t("Пожалуйста, попробуйте еще раз или обратитесь в службу поддержки, если проблема сохраняется")}.</p>
                    {/* GS-333: крупная «Попробовать ещё раз», под ней — одной строкой «Что помешало?» */}
                    <a href={retryHref} className="mx-auto flex w-full max-w-[360px] items-center justify-center rounded-[10px] border border-cta bg-cta px-6 py-4 text-[1.125rem] font-semibold text-white no-underline transition-all duration-300 hover:bg-white hover:text-cta">
                        {t("fail-retry")}
                    </a>
                    {/* Что помешало оплатить (GS-260) — только вошедшему и только по своему платежу */}
                    <Suspense>
                        <PaymentFailFeedback labels={checkoutFeedbackLabels(tCommon)} />
                    </Suspense>
                    <a href={routes.membership(locale)} className="mt-6 inline-block text-[0.9375rem] text-primary underline">{t("fail-to-membership")}</a>
                </div>
            </div>
        </PublicShell>
    );
}
