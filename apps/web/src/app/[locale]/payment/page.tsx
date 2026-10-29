import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { PublicShell } from "@/components/layout/PublicShell";
import { MembershipCheckout } from "@/components/membership/MembershipCheckout";
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
    return pageMetadata({ locale, path: routes.payment(locale), title: t("Оплатить"), description: t("Сейчас вы будете перенаправлены на страницу оплаты"), noindex: true });
}

/** Оплата членства: тариф — в ?tariff= (PaymentPage старого фронта, GS-219) */
export default async function PaymentPage({ params, searchParams }: Props) {
    const { locale } = await params;
    if (!isLocale(locale)) notFound();
    const { tariff } = await searchParams;
    const tariffCode = (typeof tariff === "string" && tariff) || "volunteer_990";
    const t = await getTranslator(locale, "donation");
    return (
        <PublicShell locale={locale} topGap>
            <MembershipCheckout
                tariffCode={tariffCode}
                signInHref={`${routes.signIn(locale)}?next=payment&nextId=${encodeURIComponent(tariffCode)}`}
                membershipHref={routes.membership(locale)}
                labels={{
                    rubles: t("Списание средств происходит в российских рублях"),
                    conversion: t("Банк автоматически произведет конвертацию в валюту, используемой вами карты"),
                    redirect: t("Сейчас вы будете перенаправлены на страницу оплаты"),
                    notRedirected: t("Если это не произошло, нажмите на ссылку ниже"),
                    pay: t("Оплатить"),
                    error: t("Ошибка"),
                    back: t("Вернуться на страницу членства"),
                    noLink: t("Не удалось получить ссылку на оплату"),
                    linkUnavailable: t("Ссылка на оплату не доступна"),
                    alreadyActive: t("У вас уже есть активное членство"),
                    unavailable: t("Сервис оплаты временно недоступен Попробуйте позже"),
                    createError: t("Произошла ошибка при создании платежа"),
                }}
            />
        </PublicShell>
    );
}
