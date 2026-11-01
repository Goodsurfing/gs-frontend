import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { PaymentResult, resultButton } from "@/components/donation/PaymentResult";
import { PublicShell } from "@/components/layout/PublicShell";
import { isLocale } from "@/i18n/config";
import { getTranslator } from "@/i18n/dictionary";
import { routes } from "@/lib/routes";
import { pageMetadata } from "@/lib/seo";

type Props = { params: Promise<{ locale: string; id: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { locale, id } = await params;
    if (!isLocale(locale)) return {};
    const t = await getTranslator(locale, "donation");
    return pageMetadata({ locale, path: routes.donationSuccess(locale, id), title: t("Спасибо за пожертвование!"), description: t("Ваш платёж успешно обработан Благодарим вас за поддержку проекта"), noindex: true });
}

/** Возврат с ЮKassa после оплаты (DonationPaySuccessPage старого фронта, GS-219) */
export default async function DonationSuccessPage({ params }: Props) {
    const { locale, id } = await params;
    if (!isLocale(locale)) notFound();
    const t = await getTranslator(locale, "donation");
    return (
        <PublicShell locale={locale} topGap>
            <PaymentResult success title={t("Спасибо за пожертвование!")} text={t("Ваш платёж успешно обработан Благодарим вас за поддержку проекта")}>
                <a href={routes.fundraise(locale, id)} className={resultButton}>{t("Вернуться к сбору")}</a>
            </PaymentResult>
        </PublicShell>
    );
}
