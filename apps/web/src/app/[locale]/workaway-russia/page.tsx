import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { PublicShell } from "@/components/layout/PublicShell";
import { OfferCard, offerCardLabels } from "@/components/offers/OfferCard";
import { isLocale } from "@/i18n/config";
import { getTranslator } from "@/i18n/dictionary";
import { categoryName } from "@/lib/categories";
import { getPrices, TARIFF } from "@/lib/membershipPrices";
import { getOpenOffers } from "@/lib/offers";
import { routes } from "@/lib/routes";
import { pageMetadata, siteUrl } from "@/lib/seo";
import { jsonLdGraph } from "@/lib/structuredData";
import { WORKAWAY } from "@/lib/workawayLanding";

/** Направление «Международные» — проекты за рубежом; на странице про Россию их не показываем */
const INTERNATIONAL_CATEGORY = 14;

// Как посадочные направлений: список и число вакансий обновляются раз в час
export const revalidate = 3600;

const TITLE = "Как Workaway, но в России — волонтёрство за жильё и питание | Гудсёрфинг";
const DESCRIPTION = "Ищете Workaway в России? Гудсёрфинг: волонтёрские проекты по всей стране — фермы, заповедники, хостелы, экспедиции. Жильё и питание за помощь, оплата российской картой.";

/** Только по-русски: страницу ищут русскоязычные («workaway россия»), en/es-версии нет */
export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
    const { locale } = await params;
    if (locale !== "ru") return {};
    const meta = pageMetadata({ locale, path: routes.workawayRussia(locale), title: TITLE, description: DESCRIPTION });
    const url = `${siteUrl()}${routes.workawayRussia(locale)}`;
    return { ...meta, alternates: { canonical: url, languages: { ru: url, "x-default": url } } };
}

/**
 * «Как Workaway, но в России» (GS-280). Спрос: «workaway» в Яндексе — около 2 860 запросов в месяц
 * (Вордстат, ноябрь 2026), а у самого Workaway в России хозяев нет, и оплатить его российской картой
 * нельзя. Чужой бренд — только в заголовке и честном сравнении; цены Workaway — с их страницы
 * регистрации (lib/workawayLanding.ts, проверять раз в полгода).
 */
export default async function WorkawayRussiaPage({ params }: { params: Promise<{ locale: string }> }) {
    const { locale } = await params;
    if (!isLocale(locale) || locale !== "ru") notFound();
    const [t, prices, all, international] = await Promise.all([
        getTranslator(locale),
        getPrices(locale),
        // С запасом: зарубежные из подборки убираем, нужно 12 по России
        getOpenOffers(locale, { limit: 36, what: "вакансии для страницы «Как Workaway»" }),
        getOpenOffers(locale, { categoryIds: [INTERNATIONAL_CATEGORY], limit: 1, what: "зарубежные вакансии для страницы «Как Workaway»" }),
    ]);
    const offers = all.offers.filter((offer) => !offer.categories.some((category) => category.id === INTERNATIONAL_CATEGORY)).slice(0, 12);
    // Сравнение — про Россию: открытые вакансии без направления «Международные»
    const total = Math.max(0, all.total - international.total);
    const price = prices[TARIFF.volunteer] ?? 990;
    const rows = WORKAWAY.comparison(total, price);
    const structuredData = jsonLdGraph([
        {
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: WORKAWAY.faq(price).map((item) => ({ "@type": "Question", name: item.q, acceptedAnswer: { "@type": "Answer", text: item.a } })),
        },
    ]);

    return (
        <PublicShell locale={locale} topGap>
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
            <div className="mx-auto w-full max-w-[1180px] px-5 pt-10 pb-24">
                <h1 className="text-[2rem] leading-[120%] font-bold text-ink down-md:text-[1.625rem]">Как Workaway, но в России</h1>
                <div className="mt-5 flex max-w-[820px] flex-col gap-3 text-[16px] leading-[150%] text-ink-secondary">
                    {WORKAWAY.intro.map((text) => <p key={text}>{text}</p>)}
                </div>
                <div className="mt-6 flex flex-wrap items-center gap-4">
                    <a href={routes.offersMap(locale)} className="rounded-[10px] bg-cta px-8 py-3 text-[16px] text-white no-underline transition-colors hover:bg-cta-hover">
                        Смотреть вакансии
                    </a>
                    {total > 0 && <span className="text-[14px] text-caption">Открытых вакансий в России: {total}</span>}
                </div>

                <section className="mt-12 max-w-[820px]" aria-labelledby="workaway-compare">
                    <h2 id="workaway-compare" className="text-[1.5rem] font-bold text-ink">Чем отличается</h2>
                    <div className="mt-4 overflow-hidden rounded-[10px] border border-accent-bg">
                        <table className="w-full border-collapse text-left text-[15px] leading-[140%]">
                            <thead className="bg-field text-ink">
                                <tr>
                                    <th scope="col" className="w-[34%] px-4 py-3 font-medium down-sm:px-3"><span className="sr-only">Что сравниваем</span></th>
                                    <th scope="col" className="px-4 py-3 font-semibold down-sm:px-3">Гудсёрфинг</th>
                                    <th scope="col" className="px-4 py-3 font-medium text-ink-secondary down-sm:px-3">Workaway</th>
                                </tr>
                            </thead>
                            <tbody>
                                {rows.map((row) => (
                                    <tr key={row.what} className="border-t border-accent-bg align-top">
                                        <th scope="row" className="px-4 py-3 font-medium text-ink down-sm:px-3">{row.what}</th>
                                        <td className="px-4 py-3 text-ink down-sm:px-3">{row.us}</td>
                                        <td className="px-4 py-3 text-ink-secondary down-sm:px-3">{row.them}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    <p className="mt-2 text-[13px] text-caption">{WORKAWAY.checkedNote}</p>
                </section>

                <section className="mt-12" aria-labelledby="workaway-offers">
                    <h2 id="workaway-offers" className="text-[1.5rem] font-bold text-ink">Куда можно поехать сейчас</h2>
                    {offers.length > 0 ? (
                        <ul className="m-0 mt-6 grid list-none grid-cols-3 gap-5 p-0 down-lg:grid-cols-2 down-sm:grid-cols-1">
                            {offers.map((offer) => (
                                <li key={offer.id} className="flex [&>a]:w-full">
                                    <OfferCard offer={offer} href={routes.offer(locale, offer.id)} category={categoryName(offer.categories[0]?.name, t)} labels={offerCardLabels(t)} />
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className="mt-6 text-[16px] text-caption">Сейчас открытых вакансий нет — загляните чуть позже.</p>
                    )}
                    <div className="mt-8 flex flex-wrap gap-4">
                        <a href={routes.offersMap(locale)} className="rounded-[10px] bg-cta px-8 py-3 text-[16px] text-white no-underline transition-colors hover:bg-cta-hover">Все вакансии на карте</a>
                        <a href={routes.membership(locale)} className="rounded-[10px] border border-primary px-8 py-3 text-[16px] text-primary no-underline transition-colors hover:bg-primary hover:text-white">Членство за {price} ₽ в год</a>
                    </div>
                </section>

                <section className="mt-16 max-w-[820px]" aria-labelledby="workaway-faq">
                    <h2 id="workaway-faq" className="text-[1.5rem] font-bold text-ink">Частые вопросы</h2>
                    <div className="mt-4 flex flex-col gap-3">
                        {WORKAWAY.faq(price).map((item) => (
                            <details key={item.q} className="rounded-[10px] bg-field px-5 py-4">
                                <summary className="cursor-pointer text-[16px] font-semibold text-ink">{item.q}</summary>
                                <p className="mt-2 text-[15px] leading-[150%] text-ink-secondary">{item.a}</p>
                            </details>
                        ))}
                    </div>
                </section>
            </div>
        </PublicShell>
    );
}
