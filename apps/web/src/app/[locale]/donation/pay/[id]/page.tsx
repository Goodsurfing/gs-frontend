import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { DonationPayForm } from "@/components/donation/DonationPayForm";
import { PublicShell } from "@/components/layout/PublicShell";
import { isLocale } from "@/i18n/config";
import { getTranslator } from "@/i18n/dictionary";
import { getFundraise } from "@/lib/fundraise";
import { mediaUrl } from "@/lib/media";
import { PUBLIC_OFFER_PDF, routes } from "@/lib/routes";
import { pageMetadata } from "@/lib/seo";

export const revalidate = 300;

type Props = { params: Promise<{ locale: string; id: string }> };

// Служебная страница оплаты — в поиск не нужна
export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { locale, id } = await params;
    if (!isLocale(locale)) return {};
    const t = await getTranslator(locale, "donation");
    return pageMetadata({ locale, path: routes.donationPay(locale, id), title: t("Пожертвование"), description: t("Поддержите проект — любая сумма важна"), noindex: true });
}

/** Пожертвование в сбор: карточка сбора и форма суммы (DonationPayPage старого фронта, GS-219) */
export default async function DonationPayPage({ params }: Props) {
    const { locale, id } = await params;
    if (!isLocale(locale)) notFound();
    const [t, result] = await Promise.all([getTranslator(locale, "donation"), getFundraise(locale, id)]);
    const fundraise = result.kind === "ok" ? result.fundraise : null;
    const image = mediaUrl(fundraise?.image, "medium");
    // «…условия <1>публичной оферты</1> о заключении…» — ссылка внутри перевода
    const [offerBefore = "", offerLink = "", offerAfter = ""] = t("Нажимая кнопку, вы принимаете условия <1>публичной оферты</1> о заключении договора пожертвования").split(/<\/?1>/);

    return (
        <PublicShell locale={locale} topGap>
            <div className="mx-auto max-w-[1080px] px-4 pt-6 pb-12">
                <h1 className="text-[40px] leading-[1.2] font-bold text-[#0c2238] max-[900px]:text-[34px] max-[600px]:text-[28px]">{t("Пожертвование")}</h1>
                <p className="mt-2.5 mb-7 text-[18px] leading-[1.45] text-[#536a81] max-[600px]:text-[16px]">{t("Поддержите проект — любая сумма важна")}</p>
                {fundraise && (
                    <div className="mt-[18px] mb-5 grid grid-cols-[220px_1fr] gap-3.5 rounded-[18px] border border-[#dbe6ef] bg-white p-3.5 shadow-[0_8px_24px_rgb(16_44_74/6%)] max-[900px]:grid-cols-1 max-[600px]:rounded-[14px] max-[600px]:p-3">
                        {/* eslint-disable-next-line @next/next/no-img-element -- обложка из хранилища */}
                        {image && <img src={image} alt={fundraise.name} className="h-[148px] w-full rounded-[14px] object-cover max-[900px]:h-[180px] max-[600px]:h-40 max-[600px]:rounded-[10px]" />}
                        <div className="flex flex-col gap-1">
                            <span className="inline-flex self-start rounded-full bg-[rgb(10_102_194/10%)] px-2.5 py-[5px] text-[12px] font-bold text-[#0a66c2] uppercase">{t("Сбор пожертвований")}</span>
                            <h2 className="mt-0.5 text-[22px] leading-[1.25] font-bold text-[#0c2238] max-[600px]:text-[19px]">{fundraise.name}</h2>
                            <p className="text-[15px] font-bold text-[#3a5878]">{fundraise.organization.name}</p>
                        </div>
                    </div>
                )}
                <DonationPayForm
                    fundraiseId={id}
                    signInHref={`${routes.signIn(locale)}?next=donation&nextId=${id}`}
                    offerHref={PUBLIC_OFFER_PDF}
                    labels={{
                        amountTitle: t("Размер пожертвования"),
                        otherAmount: t("Другая сумма, ₽"),
                        settings: t("Настройки"),
                        anonymous: t("Анонимное пожертвование"),
                        creating: t("Создание платежа"),
                        // Сумму подставляет форма — шаблон передаётся с плейсхолдером
                        submit: t("Поддержать — {{amount}} ₽", { amount: "{{amount}}" }),
                        offerBefore,
                        offerLink,
                        offerAfter,
                        minAmount: t("Минимальная сумма пожертвования — 100 ₽"),
                        unavailable: t("Сервис оплаты временно недоступен Попробуйте позже"),
                        createError: t("Произошла ошибка при создании платежа"),
                    }}
                />
                <div className="mt-4">
                    <a href={routes.fundraise(locale, id)} className="inline-block text-center text-[16px] leading-[120%] text-caption hover:underline down-lg:w-full">
                        {t("Вернуться на страницу сбора")}
                    </a>
                </div>
            </div>
        </PublicShell>
    );
}
