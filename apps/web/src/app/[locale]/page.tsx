import type { Metadata } from "next";
import { notFound } from "next/navigation";
import type { ReactNode } from "react";

import { CommunityNews } from "@/components/home/CommunityNews";
import { HeroSlider } from "@/components/home/HeroSlider";
import { HomeSearch } from "@/components/home/HomeSearch";
import { HowItWork } from "@/components/home/HowItWork";
import { PersonalOffers } from "@/components/home/PersonalOffers";
import { ReviewsShowcase } from "@/components/home/ReviewsShowcase";
import { PublicShell } from "@/components/layout/PublicShell";
import { OfferCard } from "@/components/offers/OfferCard";
import { Reveal } from "@/components/ui/Reveal";
import { isLocale } from "@/i18n/config";
import { getTranslator } from "@/i18n/dictionary";
import { getAboutProject } from "@/lib/aboutProject";
import { categoryLabels, categoryName } from "@/lib/categories";
import { getFeaturedOffers, getFeaturedReviews, getHomeCategories, getLatestArticles, getMainBanner } from "@/lib/home";
import { mediaUrl } from "@/lib/media";
import { formatStatNumber, roundStat } from "@/lib/formatStat";
import { routes } from "@/lib/routes";
import { pageMetadata, siteUrl } from "@/lib/seo";

// Подборки и баннер меняются в админке — страница пересобирается раз в 5 минут
export const revalidate = 300;

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { locale } = await params;
    if (!isLocale(locale)) return {};
    const t = await getTranslator(locale, "main");
    const meta = pageMetadata({ locale, path: routes.main(locale), title: t("seo.title"), description: t("seo.description") });
    return {
        ...meta,
        keywords: t("seo.keywords"),
        openGraph: { ...meta.openGraph, title: t("seo.ogTitle"), description: t("seo.ogDescription") },
    };
}


/** Заголовок секции главной (Section + SectionTitle старого фронта) */
function Section({ title, children, className = "" }: { title?: string; children: ReactNode; className?: string }) {
    return (
        <section className="pt-20">
            <div className={`mx-auto w-[1180px] max-[1180px]:w-[992px] down-lg:w-[768px] down-md:w-[480px] down-xs:w-[320px] ${className}`}>
                {title && <h2 className="text-center text-[1.625rem] leading-[123%] font-normal text-ink-secondary">{title}</h2>}
                <div>{children}</div>
            </div>
        </section>
    );
}

/** Главная (MainPage старого фронта, GS-219) */
export default async function HomePage({ params }: Props) {
    const { locale } = await params;
    if (!isLocale(locale)) notFound();
    const [t, tMain, categories, offers, reviews, articles, banner, about] = await Promise.all([
        getTranslator(locale),
        getTranslator(locale, "main"),
        getHomeCategories(locale),
        getFeaturedOffers(locale),
        getFeaturedReviews(locale),
        getLatestArticles(locale),
        getMainBanner(locale),
        getAboutProject(locale),
    ]);
    const labels = categoryLabels(t);
    const today = (about as { today?: { volunteerCount?: number; vacancyCount?: number } } | null)?.today;
    // «С нами уже более 23 000»: до тысяч от 10 000, до сотен ниже (1 706 → 1 700)
    const round = (value: number) => formatStatNumber(roundStat(value), locale);
    const structuredData = [
        { "@context": "https://schema.org", "@type": "WebSite", name: "GoodSurfing", url: `${siteUrl()}/`, inLanguage: locale, description: tMain("seo.description") },
        { "@context": "https://schema.org", "@type": "Organization", name: "GoodSurfing", url: siteUrl(), description: tMain("seo.description") },
        {
            "@context": "https://schema.org",
            "@type": "WebPage",
            name: tMain("seo.title"),
            description: tMain("seo.description"),
            url: `${siteUrl()}${routes.main(locale)}`,
            inLanguage: locale,
            about: ["volunteering", "travel", "expeditions"].map((key) => ({ "@type": "Thing", name: tMain(`geo.about.${key}`) })),
            isPartOf: { "@type": "WebSite", name: "GoodSurfing", url: `${siteUrl()}/` },
        },
    ];

    return (
        <PublicShell locale={locale}>
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
            {/* Первый экран: поиск и направления слева, слайдер справа; уже 1000 px — слайдер сверху */}
            <div className="flex min-h-screen border-b border-accent-bg max-[1000px]:flex-col-reverse">
                <div className="w-1/2 bg-white max-[1000px]:w-full">
                    <div className="flex h-full flex-col items-start overflow-visible px-12 py-7 max-[450px]:p-5">
                        <div className="flex h-full w-full flex-col pt-[100px] max-[1000px]:items-center">
                            <div className="mb-10 flex max-w-[713px] flex-col items-start max-[1000px]:items-center">
                                <h1 className="mb-10 text-left text-[4.5rem] leading-[100%] font-normal text-ink max-[1600px]:text-[48px] max-[1400px]:text-[32px] max-[1000px]:text-center max-[1000px]:text-[48px]! max-[450px]:text-[32px]!">
                                    {t("main.welcome.title")}
                                </h1>
                                <HomeSearch
                                    catalogHref={routes.offersMap(locale)}
                                    offerHref={routes.offer(locale, "{id}")}
                                    categories={labels}
                                    labels={{
                                        placeholder: t("Поиск"),
                                        search: t("Поиск вакансий"),
                                        find: t("Найти"),
                                        clear: t("Очистить"),
                                        showAll: t("Посмотреть все"),
                                        empty: t("Данные вакансии отсутсвуют"),
                                    }}
                                />
                            </div>
                            <div className="mb-[15px] flex max-w-[560px] flex-wrap gap-2.5 max-[1000px]:w-full max-[1000px]:max-w-none max-[1000px]:justify-center">
                                {categories.map((category) => (
                                    <a
                                        key={category.id}
                                        href={routes.offersMapCategory(locale, category.id)}
                                        style={category.image ? { backgroundImage: `url(${JSON.stringify(category.image)})` } : undefined}
                                        className="box-border flex h-[129px] w-[126px] items-end bg-cover bg-center bg-no-repeat p-2.5 transition-opacity duration-300 hover:opacity-80"
                                    >
                                        <p lang={locale} className="w-full hyphens-auto break-words text-white">{categoryName(category.name, t)}</p>
                                    </a>
                                ))}
                                <a
                                    href={routes.categories(locale)}
                                    style={{ backgroundImage: "url(/web/images/home/other-categories.png)" }}
                                    className="box-border flex h-[129px] w-[126px] items-end bg-cover bg-center bg-no-repeat p-2.5 transition-opacity duration-300 hover:opacity-80"
                                >
                                    <p lang={locale} className="w-full hyphens-auto break-words text-caption">{t("category-offer.Другие категории")}</p>
                                </a>
                            </div>
                            <div className="mt-auto max-[1000px]:flex max-[1000px]:flex-col max-[1000px]:items-center">
                                <h3 className="mb-5 max-w-[580px] text-[22px] leading-[150%] font-normal text-ink [@media(max-height:1000px)]:text-[18px] max-[1000px]:text-center">
                                    {t("main.welcome.activity-title")}
                                </h3>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="w-1/2 max-[1000px]:w-full">
                    <HeroSlider
                        bulletLabel="{{n}}"
                        slides={[
                            {
                                title: tMain("Путешествуй, помогай, меняй мир"),
                                text: tMain("Goodsurfing — способ путешествовать недорого, занимаясь интересным и важным делом с помощью волонтёрства или экспедиций"),
                                description: today?.volunteerCount
                                    ? tMain("slider.volunteerCount", { count: today.volunteerCount, displayCount: round(today.volunteerCount) })
                                    : tMain("С нами уже 90 000 путешественников со смыслом со всего мира"),
                                image: "/web/images/home/slide-1.webp",
                                descriptionHref: routes.signIn(locale),
                                button: { text: tMain("Присоединиться к сообществу"), href: routes.signIn(locale), signedInHref: routes.offersMap(locale) },
                            },
                            {
                                title: tMain("Примите тех, кто хочет помогать и делайте мир лучше вместе"),
                                text: tMain("Мы соединяем вас с людьми, готовыми приехать к вам и помочь на месте. Найдите помощников для задач на сезон, экспедицию или долгий проект."),
                                description: today?.vacancyCount
                                    ? tMain("slider.vacancyCount", { count: today.vacancyCount, displayCount: round(today.vacancyCount) })
                                    : tMain("С нами уже больше 1500 проектов"),
                                image: "/web/images/home/slide-2.webp",
                                descriptionHref: routes.signIn(locale),
                                button: { text: tMain("Стать хостом"), href: routes.becomeHost(locale) },
                            },
                        ]}
                    />
                </div>
            </div>

            <Section title={tMain("Как это работает?")}>
                <HowItWork locale={locale} />
            </Section>

            {banner && (
                <section
                    className="relative mt-20 flex items-center overflow-hidden rounded-[10px] bg-cover bg-center bg-no-repeat p-5 before:absolute before:inset-0 before:bg-black/40 down-md:min-h-[200px] down-md:rounded-2xl down-md:px-5 down-md:py-6"
                    style={banner.image ? { backgroundImage: `url(${JSON.stringify(banner.image)})` } : undefined}
                >
                    <div className="relative z-[1] flex w-full items-center justify-between gap-4">
                        <p className="text-[20px] leading-[1.25] font-bold text-white down-md:text-[22px]">{banner.description}</p>
                        <a href={banner.url} className="w-fit rounded-[10px] border border-white px-[50px] py-3.5 text-[1rem] leading-[1.375rem] text-white transition-colors hover:bg-white hover:text-primary">{t("Подробнее")}</a>
                    </div>
                </section>
            )}

            <Section title={tMain("Интересные вакансии")} className="down-md:w-full down-xs:w-full">
                <PersonalOffers offerHref={routes.offer(locale, "{id}")} categories={labels} labels={{ prev: t("slider.previous"), next: t("slider.next") }}>
                        {offers.map((offer) => (
                            <OfferCard key={offer.id} offer={offer} href={routes.offer(locale, offer.id)} category={categoryName(offer.categories[0]?.name, t)} />
                        ))}
                </PersonalOffers>
            </Section>

            <Section title={tMain("Наши преимущества")}>
                <div className="mt-5 flex w-full items-center justify-between down-md:flex-col">
                    {[
                        ["Прямой контакт", "Общайтесь с принимающей стороной напрямую: задавайте вопросы, уточняйте условия, договаривайтесь о датах и формате участия. Так проще понять, подходит ли вам проект, ещё до поездки"],
                        ["Больше возможностей", "Гудсёрфинг объединяет самые разные направления путешествия со смыслом: от волонтёрства на фермах до археологических экспедиций"],
                        ["Надёжно", "Все принимающие стороны проходят проверку и участвуют в рейтинге. Отзывы открыты для всех и каждый может рассказать о всех нюансах"],
                    ].map(([title = "", text = ""], index) => (
                        <Reveal key={title} from={index % 2 === 0 ? "zoom-in" : "zoom-out"} className="flex w-[32%] flex-col items-center text-center text-ink-secondary down-md:mb-10 down-md:w-full">
                            {/* eslint-disable-next-line @next/next/no-img-element -- иллюстрация */}
                            <img src={`/web/images/home/benefit${index + 1}.png`} alt={tMain(title)} loading="lazy" />
                            <h3 className="mt-10 mb-5 text-[1.125rem] leading-[122%] font-medium">{tMain(title)}</h3>
                            <p className="text-[0.875rem] leading-[157%]">{tMain(text)}</p>
                        </Reveal>
                    ))}
                </div>
            </Section>

            <section className="mt-[130px] box-border w-full bg-ink px-[50px] pt-[50px] pb-[160px]">
                <div className="flex flex-col items-center text-center">
                    <h2 className="text-[1.625rem] leading-[123%] font-normal text-accent-bg">{tMain("Стань волонтёром")}</h2>
                    <p className="mt-[50px] mb-[60px] max-w-[780px] text-[0.875rem] leading-[157%] text-[#82949F]">{tMain("Быть гудсёрфером")}</p>
                    <div className="mb-[60px] flex w-[1180px] flex-wrap items-center justify-between max-[1180px]:w-[992px] max-[1180px]:justify-center down-lg:w-[768px] down-md:w-[480px] down-xs:w-[320px]">
                        {["Поиск по карте", "Встречи с гудсёрферами", "Поиск попутчиков", "Общение на сервисе", "Отзывы волонтёров", "Система рейтинга", "Лист пожеланий"].map((title, index) => (
                            <Reveal key={title} from={index % 2 === 0 ? "up" : "down"} className="flex cursor-default items-center max-[1180px]:m-[30px]">
                                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#303A40] text-[1.125rem] font-semibold text-caption">{index + 1}</div>
                                <span className="ml-2.5 max-w-[90px] text-left text-[0.875rem] leading-[129%] font-semibold text-accent-bg">{tMain(title)}</span>
                            </Reveal>
                        ))}
                    </div>
                    <a href={routes.profileRole(locale)} className="rounded-[10px] border border-host bg-host px-[50px] py-3.5 text-center text-[1rem] leading-[1.375rem] text-white transition-colors hover:bg-white hover:text-host">
                        {tMain("Начать сейчас")}
                    </a>
                </div>
            </section>

            <section className="-mt-[5%] box-border flex w-full justify-center">
                <ReviewsShowcase
                    labels={{ prev: t("slider.previous"), next: t("slider.next") }}
                    reviews={reviews.map((review) => ({
                        id: String(review.id),
                        title: review.title,
                        text: review.description,
                        image: mediaUrl(review.images[0], "large") ?? "",
                        author: review.authorName,
                        avatar: mediaUrl(review.authorAvatar, "small"),
                        href: routes.offer(locale, review.vacancyId),
                    }))}
                />
            </section>

            <Section title={tMain("Новое из Сообщества")}>
                <div className="flex w-full flex-col items-center">
                    <p className="mt-[30px] mb-[35px] text-center">{tMain("Объединяет всех, кто увлечён путешествиями и готов поделиться своим опытом.")}</p>
                    <CommunityNews
                        labels={{ prev: t("slider.previous"), next: t("slider.next") }}
                        items={articles.map((article) => ({
                            id: String(article.id),
                            title: article.name,
                            date: article.created,
                            image: mediaUrl(article.image, "large"),
                            href: routes.blogArticle(locale, article.slug),
                        }))}
                    />
                </div>
            </Section>

            <section className="mt-[60px] flex w-full items-center justify-center bg-field pt-[65px] pb-[75px]">
                <div className="flex max-w-[780px] flex-col items-center">
                    <h2 className="text-center text-[1.625rem] leading-[123%] font-normal text-ink-secondary">{tMain("Прими гудсёрферов")}</h2>
                    <p className="mt-[30px] mb-10 max-w-[95%] text-center text-[0.875rem] leading-[157%] text-ink-secondary">{tMain("Получайте помощь")}</p>
                    <a href={routes.becomeHost(locale)} className="inline-block rounded-[10px] bg-primary px-[50px] py-3.5 text-center text-[1rem] leading-[1.375rem] text-white transition-colors hover:bg-primary-hover">
                        {tMain("Стать организатором")}
                    </a>
                </div>
            </section>
        </PublicShell>
    );
}
