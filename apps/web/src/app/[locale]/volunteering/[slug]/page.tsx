import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { PublicShell } from "@/components/layout/PublicShell";
import { OfferCard, offerCardLabels } from "@/components/offers/OfferCard";
import { isLocale, type Locale } from "@/i18n/config";
import { getTranslator } from "@/i18n/dictionary";
import { categoryName } from "@/lib/categories";
import { getOpenOffers, getOpenOffersOfCategory } from "@/lib/offers";
import { offersFiltersQuery } from "@/lib/offersFilters";
import { specialLandingLinks } from "@/lib/specialLandings";
import { routes } from "@/lib/routes";
import { pageMetadata, siteUrl } from "@/lib/seo";
import { jsonLdGraph } from "@/lib/structuredData";
import { TOPIC_LANDINGS, topicBySlug } from "@/lib/topicLandings";
import { genericLanding, landingBySlug, VOLUNTEERING_LANDINGS } from "@/lib/volunteeringLandings";

// Список вакансий обновляется раз в час: страница — для поиска, не для живого каталога
export const revalidate = 3600;

type Props = { params: Promise<{ locale: string; slug: string }> };

// Не собираем при сборке: страница строится при первом заходе и кэшируется на час
// (как другие страницы с параметром — сбой API на сборке не должен попасть в кэш)
export function generateStaticParams() {
    return [];
}

type Resolved = {
    /** Тема или регион (только ru) — подписи без слова «направление» */
    topic?: boolean;
    copy: { title: string; h1: string; description: string; intro: string[]; faq: { q: string; a: string }[] };
    /** Выборка вакансий и ссылка «Все на карте» */
    query: { categoryIds?: number[]; search?: string };
};

async function texts(locale: Locale, slug: string): Promise<Resolved | null> {
    // Темы и регионы (экспедиции, Байкал…) — только по-русски
    const topic = topicBySlug(slug);
    if (topic) return locale === "ru" ? { copy: topic, query: topic.query, topic: true } : null;
    const landing = landingBySlug(slug);
    if (!landing) return null;
    const query = { categoryIds: [landing.categoryId] };
    if (locale === "ru") return { copy: landing.ru, query };
    const [t, tCommon] = await Promise.all([getTranslator(locale, "main"), getTranslator(locale)]);
    const name = categoryName(categoryRuName(landing.categoryId), tCommon) ?? landing.ru.h1;
    return { copy: genericLanding(name, t), query };
}

/** Карта с той же выборкой, что на странице */
function mapHref(locale: Locale, query: Resolved["query"]): string {
    if (query.categoryIds?.length === 1 && !query.search) return routes.offersMapCategory(locale, query.categoryIds[0]!);
    const filters = offersFiltersQuery({ categories: query.categoryIds ?? [], search: query.search ?? "" });
    return filters ? `${routes.offersMap(locale)}?${filters}` : routes.offersMap(locale);
}

/** Название категории по-русски — ключ словаря категорий (как в API) */
const CATEGORY_RU: Record<number, string> = {
    1: "Работа в хостеле", 2: "Заповедники и нац. парки", 3: "Работа на ферме", 4: "Работа с животными", 5: "Преподавание",
    6: "Работа с детьми", 7: "Благотворительность", 8: "Спорт", 9: "Искусство", 10: "Археология", 12: "Онлайн", 13: "Оплачиваемая работа", 14: "Международные",
};
const categoryRuName = (id: number) => CATEGORY_RU[id] ?? "";

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { locale, slug } = await params;
    if (!isLocale(locale)) return {};
    const result = await texts(locale, slug);
    if (!result) return {};
    return pageMetadata({ locale, path: routes.volunteering(locale, slug), title: result.copy.title, description: result.copy.description });
}

/**
 * Посадочная страница направления для поиска: «волонтёрство на ферме»,
 * «работа в хостеле за проживание» (src/lib/volunteeringLandings.ts).
 */
export default async function VolunteeringLandingPage({ params }: Props) {
    const { locale, slug } = await params;
    if (!isLocale(locale)) notFound();
    const result = await texts(locale, slug);
    if (!result) notFound();
    const { copy, query } = result;
    const [tCommon, tMain, { offers, total }] = await Promise.all([
        getTranslator(locale),
        getTranslator(locale, "main"),
        query.categoryIds?.length === 1 && !query.search
            ? getOpenOffersOfCategory(locale, query.categoryIds[0]!)
            : getOpenOffers(locale, { ...query, limit: 24, what: `вакансии посадочной страницы ${slug}` }),
    ]);
    const others = VOLUNTEERING_LANDINGS.filter((item) => item.slug !== slug);
    const topics = locale === "ru" ? TOPIC_LANDINGS.filter((item) => item.slug !== slug) : [];
    const structuredData = jsonLdGraph([
        {
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: copy.faq.map((item) => ({ "@type": "Question", name: item.q, acceptedAnswer: { "@type": "Answer", text: item.a } })),
        },
        {
            "@context": "https://schema.org",
            "@type": "CollectionPage",
            name: copy.h1,
            description: copy.description,
            url: `${siteUrl()}${routes.volunteering(locale, slug)}`,
            inLanguage: locale,
        },
    ]);

    return (
        <PublicShell locale={locale} topGap>
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
            <div className="mx-auto w-full max-w-[1180px] px-5 pt-10 pb-24">
                <h1 className="text-[2rem] leading-[120%] font-bold text-ink down-md:text-[1.625rem]">{copy.h1}</h1>
                <div className="mt-5 flex max-w-[820px] flex-col gap-3 text-[16px] leading-[150%] text-ink-secondary">
                    {copy.intro.map((text) => <p key={text}>{text}</p>)}
                </div>
                <div className="mt-6 flex flex-wrap items-center gap-4">
                    <a href={mapHref(locale, query)} className="rounded-[10px] bg-cta px-8 py-3 text-[16px] text-white no-underline transition-colors hover:bg-cta-hover">
                        {result.topic ? "Все эти вакансии на карте" : tMain("landing.allOnMap")}
                    </a>
                    {total > 0 && <span className="text-[14px] text-caption">{tMain("landing.openCount").replace("{n}", String(total))}</span>}
                </div>

                {offers.length > 0 ? (
                    <ul className="m-0 mt-10 grid list-none grid-cols-3 gap-5 p-0 down-lg:grid-cols-2 down-sm:grid-cols-1">
                        {offers.map((offer) => (
                            <li key={offer.id} className="flex [&>a]:w-full">
                                <OfferCard offer={offer} href={routes.offer(locale, offer.id)} category={categoryName(offer.categories[0]?.name, tCommon)} labels={offerCardLabels(tCommon)} />
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p className="mt-10 text-[16px] text-caption">{tMain("landing.empty")}</p>
                )}

                <section className="mt-16 max-w-[820px]" aria-labelledby="landing-faq">
                    <h2 id="landing-faq" className="text-[1.5rem] font-bold text-ink">{tMain("landing.faq")}</h2>
                    <div className="mt-4 flex flex-col gap-3">
                        {copy.faq.map((item) => (
                            <details key={item.q} className="rounded-[10px] bg-field px-5 py-4">
                                <summary className="cursor-pointer text-[16px] font-semibold text-ink">{item.q}</summary>
                                <p className="mt-2 text-[15px] leading-[150%] text-ink-secondary">{item.a}</p>
                            </details>
                        ))}
                    </div>
                </section>

                <nav className="mt-16" aria-labelledby="landing-more">
                    <h2 id="landing-more" className="text-[1.25rem] font-bold text-ink">{tMain("landing.more")}</h2>
                    <ul className="m-0 mt-4 flex list-none flex-wrap gap-2.5 p-0">
                        {others.map((item) => (
                            <li key={item.slug}>
                                <a href={routes.volunteering(locale, item.slug)} className="block rounded-full border border-accent-bg px-4 py-2 text-[14px] text-ink-secondary no-underline transition-colors hover:border-primary hover:text-primary">
                                    {locale === "ru" ? item.ru.h1 : categoryName(categoryRuName(item.categoryId), tCommon) ?? item.ru.h1}
                                </a>
                            </li>
                        ))}
                        {topics.map((item) => (
                            <li key={item.slug}>
                                <a href={routes.volunteering(locale, item.slug)} className="block rounded-full border border-accent-bg px-4 py-2 text-[14px] text-ink-secondary no-underline transition-colors hover:border-primary hover:text-primary">
                                    {item.h1}
                                </a>
                            </li>
                        ))}
                        {specialLandingLinks(locale).map((item) => (
                            <li key={item.href}>
                                <a href={item.href} className="block rounded-full border border-accent-bg px-4 py-2 text-[14px] text-ink-secondary no-underline transition-colors hover:border-primary hover:text-primary">
                                    {item.title}
                                </a>
                            </li>
                        ))}
                    </ul>
                </nav>
            </div>
        </PublicShell>
    );
}
