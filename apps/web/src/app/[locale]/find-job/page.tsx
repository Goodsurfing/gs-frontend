import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { HowItWork } from "@/components/home/HowItWork";
import { PublicShell } from "@/components/layout/PublicShell";
import { OfferCard } from "@/components/offers/OfferCard";
import { OffersCarousel } from "@/components/offers/OffersCarousel";
import { isLocale } from "@/i18n/config";
import { getTranslator } from "@/i18n/dictionary";
import { categoryName } from "@/lib/categories";
import { getOffersByCategories } from "@/lib/offers";
import { routes } from "@/lib/routes";
import { pageMetadata } from "@/lib/seo";

// Слайдер вакансий обновляется раз в 5 минут
export const revalidate = 300;

// Категория «Оплачиваемая работа»: стабильного кода у категорий нет, только id (как в старом фронте)
const PAID_WORK_CATEGORY_ID = 13;

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { locale } = await params;
    if (!isLocale(locale)) return {};
    const t = await getTranslator(locale, "seo");
    return pageMetadata({
        locale,
        path: routes.findJob(locale),
        title: t("findJob.title"),
        description: t("findJob.description"),
    });
}

const sectionTitle = "text-center text-[1.5rem] font-bold";

/** «Найти работу»: сезонная оплачиваемая работа (GS-219). */
export default async function FindJobPage({ params }: Props) {
    const { locale } = await params;
    if (!isLocale(locale)) notFound();
    const [t, tCommon, offers] = await Promise.all([
        getTranslator(locale, "find-job"),
        getTranslator(locale),
        getOffersByCategories(locale, [PAID_WORK_CATEGORY_ID]),
    ]);

    return (
        <PublicShell locale={locale} topGap>
            <div className="mx-auto max-w-[1920px] pb-[120px]">
                <section className="box-border flex min-h-[624px] w-full flex-col items-center justify-center bg-[url(/web/images/find-job/header.webp)] bg-cover bg-center bg-no-repeat px-40 py-24 down-lg:min-h-[424px] down-lg:p-5">
                    <h1 className="max-w-[33rem] text-center text-[1.875rem] leading-12 font-bold text-white">{t("Совмещай работу и путешествие!")}</h1>
                    <h2 className="mt-10 text-center text-[1.5rem] font-normal text-white">{t("Выездная сезонная работа на море, в горах и на природе!")}</h2>
                    <div className="mt-[60px] flex gap-7">
                        <a
                            href={routes.offersMapCategory(locale, PAID_WORK_CATEGORY_ID)}
                            className="inline-block cursor-pointer rounded-[10px] bg-cta px-[100px] py-3 text-center text-label text-white no-underline transition-colors duration-300 hover:bg-cta-hover down-lg:px-[15px]"
                        >
                            {t("Найти работу")}
                        </a>
                    </div>
                </section>

                <div className="mx-auto flex max-w-[1180px] flex-col items-center justify-center pt-20">
                    <h2 className={sectionTitle}>{t("Как это работает?")}</h2>
                    <HowItWork locale={locale} className="mb-[120px] max-w-[1014px]" />
                    <h2 className={sectionTitle}>{t("Интересные вакансии")}</h2>
                    <OffersCarousel className="mb-[120px]" prevLabel={tCommon("slider.previous")} nextLabel={tCommon("slider.next")}>
                        {offers.map((offer) => <OfferCard key={offer.id} offer={offer} href={routes.offer(locale, offer.id)} category={categoryName(offer.categories[0]?.name, tCommon)} />)}
                    </OffersCarousel>
                </div>

                <section className="relative w-full">
                    <div className="absolute top-1/2 left-1/2 z-[2] flex w-full max-w-[980px] -translate-1/2 flex-col items-center justify-center px-5">
                        <h2 className="text-center text-[1.625rem] font-normal text-white">{t("Найти сотрудников")}</h2>
                        <p className="mt-[38px] text-center text-[0.875rem] leading-[1.135rem] font-medium text-white">
                            {t("Получайте помощь в своём деле и знакомьтесь с людьми со всего мира.")}
                        </p>
                        <a
                            href={routes.profileRole(locale)}
                            className="mt-[30px] flex items-center justify-center rounded-[10px] border border-cta bg-cta px-[100px] py-3 text-center text-label text-white transition-all duration-300 hover:bg-white hover:text-cta down-lg:w-full down-lg:px-[15px]"
                        >
                            {t("Разместить вакансию")}
                        </a>
                    </div>
                    <div className="box-border flex min-h-[346px] w-full flex-col items-center justify-center bg-[url(/web/images/find-job/find-offer.webp)] bg-cover bg-center bg-no-repeat brightness-30" />
                </section>

                <div className="mx-auto flex max-w-[1180px] flex-col items-center justify-center pt-20">
                    <div className="mx-auto max-w-[830px] text-center down-lg:px-5">
                        <h2 className={sectionTitle}>{t("Сезонная работа")}</h2>
                        <p className="mt-[30px]">{t("Сезонная работа за границей")}</p>
                    </div>
                </div>
            </div>
        </PublicShell>
    );
}
