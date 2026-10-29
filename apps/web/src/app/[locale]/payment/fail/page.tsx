import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { PublicShell } from "@/components/layout/PublicShell";
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
    const { reason } = await searchParams;
    const t = await getTranslator(locale, "donation");
    const message = reason === "not_found" ? t("Платеж не найден") : reason === "cancelled" ? t("Оплата была отменена") : t("Произошла ошибка при обработке платежа");
    return (
        <PublicShell locale={locale} topGap>
            <div className="flex min-h-[60vh] items-center justify-center p-8">
                <div className="max-w-[600px] text-center">
                    <div aria-hidden className="mb-6 text-[4rem]">⚠️</div>
                    <h1 className="mb-4 text-[2rem] font-bold text-[#d32f2f]">{t("Ошибка оплаты")}</h1>
                    <p className="mb-4 text-[1.25rem] font-medium text-[#333]">{message}</p>
                    <p className="mb-8 text-[1rem] leading-6 text-[#666]">{t("Пожалуйста, попробуйте еще раз или обратитесь в службу поддержки, если проблема сохраняется")}.</p>
                    <div className="mt-8 flex justify-center">
                        <a href={routes.membership(locale)} className="flex items-center justify-center rounded-[10px] border border-primary bg-primary px-[100px] py-3 text-center text-[16px] leading-[120%] text-white transition-all duration-300 hover:bg-white hover:text-primary down-lg:w-full down-lg:px-[15px]">
                            {t("Вернуться на страницу членства")}
                        </a>
                    </div>
                </div>
            </div>
        </PublicShell>
    );
}
