import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { PublicShell } from "@/components/layout/PublicShell";
import { OfferCard, offerCardLabels } from "@/components/offers/OfferCard";
import { isLocale } from "@/i18n/config";
import { getTranslator } from "@/i18n/dictionary";
import { categoryName } from "@/lib/categories";
import { getOpenOffers } from "@/lib/offers";
import { routes } from "@/lib/routes";
import { pageMetadata, siteUrl } from "@/lib/seo";
import { jsonLdGraph } from "@/lib/structuredData";

/** Направление «Международные» — проекты за рубежом; на странице про Россию их не показываем */
const INTERNATIONAL_CATEGORY = 14;

export const revalidate = 3600;

const TITLE = "Volunteer in Russia — free accommodation in exchange for help | Goodsurfing";
const DESCRIPTION = "Volunteer in Russia with Goodsurfing, a non-profit volunteer community: farms, nature reserves, hostels, expeditions and schools across the country. Hosts offer accommodation and often meals.";

const INTRO = [
    "Goodsurfing is a Russian non-profit volunteer community. Hosts all over the country — farms, nature reserves and national parks, hostels, expeditions and schools — invite volunteers and offer accommodation, and often meals, in exchange for a few hours of help a day.",
    "Listings are translated into English. Many hosts speak only Russian, but a translation app is usually enough to agree on dates and tasks in the chat on the site.",
];

const FAQ = [
    { q: "Do I need a visa?", a: "It depends on your citizenship and the length of your stay. Check the entry rules with the Russian consulate before you plan the trip, and tell the host your dates — they will say what they can help with." },
    { q: "Do I need to speak Russian?", a: "Not always. Some hosts speak English; with others a translation app works fine. If a project requires Russian, it is said in the «Who is needed» section of the listing." },
    { q: "How do I arrange a stay?", a: "Sign up, apply to a listing and write to the host right on the site to agree on dates and tasks. Accommodation (often with meals) is provided in exchange for help; travel is usually at your own expense — exact conditions are in each listing." },
];

/** Только по-английски: страницу ищут иностранцы («volunteer in Russia»), ru/es-версий нет */
export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
    const { locale } = await params;
    if (locale !== "en") return {};
    const meta = pageMetadata({ locale, path: routes.volunteerInRussia(locale), title: TITLE, description: DESCRIPTION });
    const url = `${siteUrl()}${routes.volunteerInRussia(locale)}`;
    return { ...meta, alternates: { canonical: url, languages: { en: url, "x-default": url } } };
}

/**
 * «Volunteer in Russia» — для иностранцев (банк идей, из разбора Volunteer World). Вакансии по России
 * с переводом на английский (vacancy_translation), без направления «Международные».
 */
export default async function VolunteerInRussiaPage({ params }: { params: Promise<{ locale: string }> }) {
    const { locale } = await params;
    if (!isLocale(locale) || locale !== "en") notFound();
    const [t, all, international] = await Promise.all([
        getTranslator(locale),
        getOpenOffers(locale, { limit: 36, what: "вакансии для страницы «Volunteer in Russia»" }),
        getOpenOffers(locale, { categoryIds: [INTERNATIONAL_CATEGORY], limit: 1, what: "зарубежные вакансии для страницы «Volunteer in Russia»" }),
    ]);
    const offers = all.offers.filter((offer) => !offer.categories.some((category) => category.id === INTERNATIONAL_CATEGORY)).slice(0, 12);
    const total = Math.max(0, all.total - international.total);
    const structuredData = jsonLdGraph([
        {
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: FAQ.map((item) => ({ "@type": "Question", name: item.q, acceptedAnswer: { "@type": "Answer", text: item.a } })),
        },
    ]);

    return (
        <PublicShell locale={locale} topGap>
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
            <div className="mx-auto w-full max-w-[1180px] px-5 pt-10 pb-24">
                <h1 className="text-[2rem] leading-[120%] font-bold text-ink down-md:text-[1.625rem]">Volunteer in Russia</h1>
                <div className="mt-5 flex max-w-[820px] flex-col gap-3 text-[16px] leading-[150%] text-ink-secondary">
                    {INTRO.map((text) => <p key={text}>{text}</p>)}
                </div>
                <div className="mt-6 flex flex-wrap items-center gap-4">
                    <a href={routes.offersMap(locale)} className="rounded-[10px] bg-cta px-8 py-3 text-[16px] text-white no-underline transition-colors hover:bg-cta-hover">See all opportunities</a>
                    {total > 0 && <span className="text-[14px] text-caption">Open opportunities in Russia: {total}</span>}
                </div>

                <section className="mt-12" aria-labelledby="russia-offers">
                    <h2 id="russia-offers" className="text-[1.5rem] font-bold text-ink">Where you can go now</h2>
                    {offers.length > 0 ? (
                        <ul className="m-0 mt-6 grid list-none grid-cols-3 gap-5 p-0 down-lg:grid-cols-2 down-sm:grid-cols-1">
                            {offers.map((offer) => (
                                <li key={offer.id} className="flex [&>a]:w-full">
                                    <OfferCard offer={offer} href={routes.offer(locale, offer.id)} category={categoryName(offer.categories[0]?.name, t)} labels={offerCardLabels(t)} />
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className="mt-6 text-[16px] text-caption">No open opportunities right now — please check back later.</p>
                    )}
                    <div className="mt-8">
                        <a href={routes.volunteeringHub(locale)} className="text-[16px] text-primary hover:underline">All volunteering categories →</a>
                    </div>
                </section>

                <section className="mt-16 max-w-[820px]" aria-labelledby="russia-faq">
                    <h2 id="russia-faq" className="text-[1.5rem] font-bold text-ink">FAQ</h2>
                    <div className="mt-4 flex flex-col gap-3">
                        {FAQ.map((item) => (
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
