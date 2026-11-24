import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { PublicShell } from "@/components/layout/PublicShell";
import { isLocale, type Locale } from "@/i18n/config";
import { getTranslator } from "@/i18n/dictionary";
import { categoryName } from "@/lib/categories";
import { routes } from "@/lib/routes";
import { pageMetadata } from "@/lib/seo";
import { specialLandingLinks } from "@/lib/specialLandings";
import { TOPIC_LANDINGS } from "@/lib/topicLandings";
import { VOLUNTEERING_LANDINGS } from "@/lib/volunteeringLandings";

// Только ссылки и тексты — пересборка раз в сутки
export const revalidate = 86400;

/** Название категории по-русски — ключ словаря категорий (как в [slug]/page.tsx) */
const CATEGORY_RU: Record<number, string> = {
    1: "Работа в хостеле", 2: "Заповедники и нац. парки", 3: "Работа на ферме", 4: "Работа с животными", 5: "Преподавание",
    6: "Работа с детьми", 7: "Благотворительность", 8: "Спорт", 9: "Искусство", 10: "Археология", 12: "Онлайн", 13: "Оплачиваемая работа", 14: "Международные",
};

const COPY: Record<Locale, { title: string; h1: string; description: string; intro: string; directions: string; topics: string; regions: string; special: string; foreigners?: string }> = {
    ru: {
        title: "Куда поехать волонтёром — направления, экспедиции, регионы | Гудсёрфинг",
        h1: "Куда поехать волонтёром",
        description: "Все направления волонтёрства на Гудсёрфинге: фермы, хостелы, заповедники и экспедиции, работа с животными и детьми, а также Байкал, Алтай, Карелия, Крым и Кавказ.",
        intro: "Выберите, чем хочется заниматься или куда поехать, — на каждой странице открытые вакансии, условия и ответы на частые вопросы. Проживание, а часто и питание, организаторы дают в обмен на помощь.",
        directions: "Чем заняться",
        topics: "Экспедиции",
        regions: "Куда поехать",
        special: "Подборки",
    },
    en: {
        title: "Where to volunteer — all categories | Goodsurfing",
        h1: "Where to volunteer",
        description: "All volunteering categories on Goodsurfing: farms, hostels, nature reserves, animals, teaching and more — free accommodation in exchange for help.",
        intro: "Pick what you'd like to do: each page lists open opportunities, conditions and answers to common questions. Hosts offer accommodation, and often meals, in exchange for help.",
        directions: "Categories",
        topics: "",
        regions: "",
        special: "",
        foreigners: "Coming from abroad? Volunteer in Russia",
    },
    es: {
        title: "Dónde hacer voluntariado — todas las categorías | Goodsurfing",
        h1: "Dónde hacer voluntariado",
        description: "Todas las categorías de voluntariado en Goodsurfing: granjas, hostales, reservas naturales, animales, enseñanza y más, con alojamiento a cambio de ayuda.",
        intro: "Elige qué te gustaría hacer: cada página muestra oportunidades abiertas, condiciones y respuestas a preguntas frecuentes. Los anfitriones ofrecen alojamiento, y a menudo comida, a cambio de ayuda.",
        directions: "Categorías",
        topics: "",
        regions: "",
        special: "",
    },
};

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
    const { locale } = await params;
    if (!isLocale(locale)) return {};
    const copy = COPY[locale];
    return pageMetadata({ locale, path: routes.volunteeringHub(locale), title: copy.title, description: copy.description });
}

const chip = "block rounded-[10px] border border-accent-bg px-5 py-4 no-underline transition-colors hover:border-primary";

/**
 * Хаб посадочных страниц (`/volunteering`): все направления, а по-русски — ещё экспедиции, регионы
 * и подборки («зимой», «как Workaway»). Раньше адрес отвечал 404, а поисковику и человеку
 * нужна одна страница, откуда видны все посадочные.
 */
export default async function VolunteeringHubPage({ params }: { params: Promise<{ locale: string }> }) {
    const { locale } = await params;
    if (!isLocale(locale)) notFound();
    const copy = COPY[locale];
    const t = await getTranslator(locale);
    const ru = locale === "ru";
    const topics = ru ? TOPIC_LANDINGS.filter((item) => item.kind === "topic") : [];
    const regions = ru ? TOPIC_LANDINGS.filter((item) => item.kind === "region") : [];
    const special = specialLandingLinks(locale);

    return (
        <PublicShell locale={locale} topGap>
            <div className="mx-auto w-full max-w-[1180px] px-5 pt-10 pb-24">
                <h1 className="text-[2rem] leading-[120%] font-bold text-ink down-md:text-[1.625rem]">{copy.h1}</h1>
                <p className="mt-5 max-w-[820px] text-[16px] leading-[150%] text-ink-secondary">{copy.intro}</p>
                {copy.foreigners && (
                    <p className="mt-4"><a href={routes.volunteerInRussia(locale)} className="text-[16px] text-primary hover:underline">{copy.foreigners} →</a></p>
                )}

                <section className="mt-10" aria-labelledby="hub-directions">
                    <h2 id="hub-directions" className="text-[1.5rem] font-bold text-ink">{copy.directions}</h2>
                    <ul className="m-0 mt-4 grid list-none grid-cols-3 gap-4 p-0 down-lg:grid-cols-2 down-sm:grid-cols-1">
                        {topics.map((item) => (
                            <li key={item.slug}>
                                <a href={routes.volunteering(locale, item.slug)} className={chip}>
                                    <span className="block text-[16px] font-semibold text-ink">{item.h1}</span>
                                    <span className="mt-1 block text-[14px] leading-[140%] text-caption">{item.description}</span>
                                </a>
                            </li>
                        ))}
                        {VOLUNTEERING_LANDINGS.map((item) => (
                            <li key={item.slug}>
                                <a href={routes.volunteering(locale, item.slug)} className={chip}>
                                    <span className="block text-[16px] font-semibold text-ink">{ru ? item.ru.h1 : categoryName(CATEGORY_RU[item.categoryId], t) ?? item.ru.h1}</span>
                                    {ru && <span className="mt-1 block text-[14px] leading-[140%] text-caption">{item.ru.description}</span>}
                                </a>
                            </li>
                        ))}
                    </ul>
                </section>

                {[{ id: "hub-regions", title: copy.regions, items: regions }].map((group) => group.items.length > 0 && (
                    <section key={group.id} className="mt-12" aria-labelledby={group.id}>
                        <h2 id={group.id} className="scroll-mt-28 text-[1.5rem] font-bold text-ink">{group.title}</h2>
                        <ul className="m-0 mt-4 grid list-none grid-cols-3 gap-4 p-0 down-lg:grid-cols-2 down-sm:grid-cols-1">
                            {group.items.map((item) => (
                                <li key={item.slug}>
                                    <a href={routes.volunteering(locale, item.slug)} className={chip}>
                                        <span className="block text-[16px] font-semibold text-ink">{item.h1}</span>
                                        <span className="mt-1 block text-[14px] leading-[140%] text-caption">{item.description}</span>
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </section>
                ))}

                {special.length > 0 && (
                    <section className="mt-12" aria-labelledby="hub-special">
                        <h2 id="hub-special" className="text-[1.5rem] font-bold text-ink">{copy.special}</h2>
                        <ul className="m-0 mt-4 flex list-none flex-wrap gap-2.5 p-0">
                            {special.map((item) => (
                                <li key={item.href}>
                                    <a href={item.href} className="block rounded-full border border-accent-bg px-4 py-2 text-[14px] text-ink-secondary no-underline transition-colors hover:border-primary hover:text-primary">{item.title}</a>
                                </li>
                            ))}
                        </ul>
                    </section>
                )}
            </div>
        </PublicShell>
    );
}
