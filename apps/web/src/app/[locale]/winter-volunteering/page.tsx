import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { PublicShell } from "@/components/layout/PublicShell";
import { OfferCard, offerCardLabels } from "@/components/offers/OfferCard";
import { isLocale } from "@/i18n/config";
import { getTranslator } from "@/i18n/dictionary";
import { categoryName } from "@/lib/categories";
import { getOpenOffers, type OfferCardData } from "@/lib/offers";
import { routes } from "@/lib/routes";
import { pageMetadata, siteUrl } from "@/lib/seo";
import { jsonLdGraph } from "@/lib/structuredData";
import { WINTER, winterSeason } from "@/lib/winterLanding";

// Как посадочные направлений: список обновляется раз в час
export const revalidate = 3600;

/** Сегодня по Москве, Y-m-d */
function moscowToday(): string {
    return new Intl.DateTimeFormat("en-CA", { timeZone: "Europe/Moscow", year: "numeric", month: "2-digit", day: "2-digit" }).format(new Date());
}

/** Только по-русски: «зима» ищут на русском — во внутреннем поиске сайта и в Яндексе */
export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
    const { locale } = await params;
    if (locale !== "ru") return {};
    const { label } = winterSeason(moscowToday());
    const meta = pageMetadata({
        locale,
        path: routes.winterVolunteering(locale),
        title: `Волонтёрство зимой ${label} — жильё и питание за помощь | Гудсёрфинг`,
        description: `Куда поехать волонтёром зимой ${label}: хостелы и турбазы в сезон, заповедники, фермы, зимний Байкал и тёплые страны. Проживание и питание — от организаторов.`,
    });
    const url = `${siteUrl()}${routes.winterVolunteering(locale)}`;
    return { ...meta, alternates: { canonical: url, languages: { ru: url, "x-default": url } } };
}

export default async function WinterVolunteeringPage({ params }: { params: Promise<{ locale: string }> }) {
    const { locale } = await params;
    if (!isLocale(locale) || locale !== "ru") notFound();
    const season = winterSeason(moscowToday());
    const [t, dated, withFullYear] = await Promise.all([
        getTranslator(locale),
        getOpenOffers(locale, { limit: 24, overlap: { ...season, fullYear: false }, what: "зимние вакансии" }),
        getOpenOffers(locale, { limit: 36, overlap: { ...season, fullYear: true }, what: "зимние и круглогодичные вакансии" }),
    ]);
    const datedIds = new Set(dated.offers.map((offer) => offer.id));
    const fullYear = withFullYear.offers.filter((offer) => !datedIds.has(offer.id)).slice(0, 12);
    const fullYearTotal = Math.max(0, withFullYear.total - dated.total);
    const faq = WINTER.faq;
    const structuredData = jsonLdGraph([
        {
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: faq.map((item) => ({ "@type": "Question", name: item.q, acceptedAnswer: { "@type": "Answer", text: item.a } })),
        },
    ]);
    const grid = (offers: OfferCardData[]) => (
        <ul className="m-0 mt-6 grid list-none grid-cols-3 gap-5 p-0 down-lg:grid-cols-2 down-sm:grid-cols-1">
            {offers.map((offer) => (
                <li key={offer.id} className="flex [&>a]:w-full">
                    <OfferCard offer={offer} href={routes.offer(locale, offer.id)} category={categoryName(offer.categories[0]?.name, t)} labels={offerCardLabels(t)} />
                </li>
            ))}
        </ul>
    );

    return (
        <PublicShell locale={locale} topGap>
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
            <div className="mx-auto w-full max-w-[1180px] px-5 pt-10 pb-24">
                <h1 className="text-[2rem] leading-[120%] font-bold text-ink down-md:text-[1.625rem]">Волонтёрство зимой {season.label}</h1>
                <div className="mt-5 flex max-w-[820px] flex-col gap-3 text-[16px] leading-[150%] text-ink-secondary">
                    {WINTER.intro.map((text) => <p key={text}>{text}</p>)}
                </div>
                <div className="mt-6">
                    <a href={routes.offersMap(locale)} className="inline-block rounded-[10px] bg-cta px-8 py-3 text-[16px] text-white no-underline transition-colors hover:bg-cta-hover">
                        Все вакансии на карте
                    </a>
                </div>

                <section className="mt-12" aria-labelledby="winter-dated">
                    <h2 id="winter-dated" className="text-[1.5rem] font-bold text-ink">С датами на зиму</h2>
                    <p className="mt-2 text-[14px] text-caption">Заезд с декабря по февраль{dated.total > 0 ? ` · вакансий: ${dated.total}` : ""}</p>
                    {dated.offers.length > 0 ? grid(dated.offers) : (
                        <p className="mt-6 text-[16px] text-caption">Зимних дат пока никто не указал — посмотрите проекты, которые принимают круглый год.</p>
                    )}
                </section>

                {fullYear.length > 0 && (
                    <section className="mt-14" aria-labelledby="winter-full-year">
                        <h2 id="winter-full-year" className="text-[1.5rem] font-bold text-ink">Принимают круглый год</h2>
                        <p className="mt-2 max-w-[820px] text-[14px] text-caption">
                            Организаторы ждут волонтёров в любое время — зимние даты и условия уточните в переписке{fullYearTotal > 0 ? ` · вакансий: ${fullYearTotal}` : ""}
                        </p>
                        {grid(fullYear)}
                    </section>
                )}

                <section className="mt-16 max-w-[820px]" aria-labelledby="winter-faq">
                    <h2 id="winter-faq" className="text-[1.5rem] font-bold text-ink">Частые вопросы</h2>
                    <div className="mt-4 flex flex-col gap-3">
                        {faq.map((item) => (
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
