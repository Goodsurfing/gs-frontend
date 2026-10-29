import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { PaymentResult, resultButton, resultLink } from "@/components/donation/PaymentResult";
import { PublicShell } from "@/components/layout/PublicShell";
import { isLocale } from "@/i18n/config";
import { getTranslator } from "@/i18n/dictionary";
import { routes } from "@/lib/routes";
import { pageMetadata } from "@/lib/seo";

type Props = {
    params: Promise<{ locale: string; id: string }>;
    searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { locale, id } = await params;
    if (!isLocale(locale)) return {};
    const t = await getTranslator(locale, "donation");
    return pageMetadata({ locale, path: routes.donationFail(locale, id), title: t("Платёж не прошёл"), description: t("Произошла ошибка при обработке платежа"), noindex: true });
}

/** Возврат с ЮKassa, если оплата не прошла; причина — в ?reason= (DonationPayFailPage старого фронта, GS-219) */
export default async function DonationFailPage({ params, searchParams }: Props) {
    const { locale, id } = await params;
    if (!isLocale(locale)) notFound();
    const { reason } = await searchParams;
    const t = await getTranslator(locale, "donation");
    const reasons: Record<string, string> = {
        error: t("Произошла ошибка при обработке платежа"),
        cancelled: t("Платёж был отменён"),
        not_found: t("Платёж не найден"),
    };
    const text = (typeof reason === "string" && reasons[reason]) || reasons.error!;
    return (
        <PublicShell locale={locale} topGap>
            <PaymentResult success={false} title={t("Платёж не прошёл")} text={text}>
                <a href={routes.donationPay(locale, id)} className={resultButton}>{t("Попробовать снова")}</a>
                <a href={routes.fundraise(locale, id)} className={resultLink}>{t("Вернуться к сбору")}</a>
            </PaymentResult>
        </PublicShell>
    );
}
