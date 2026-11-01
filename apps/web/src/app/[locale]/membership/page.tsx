import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { PublicShell } from "@/components/layout/PublicShell";
import { FaqAccordion } from "@/components/membership/FaqAccordion";
import { MembershipReviews } from "@/components/membership/MembershipReviews";
import { TariffCards } from "@/components/membership/TariffCards";
import { isLocale, type Locale } from "@/i18n/config";
import { getTranslator, type Translate } from "@/i18n/dictionary";
import { serverApi } from "@/lib/api";
import { getFeaturedReviews } from "@/lib/home";
import { mediaUrl } from "@/lib/media";
import { INTERNATIONAL_URL, routes } from "@/lib/routes";
import { pageMetadata, siteUrl } from "@/lib/seo";

export const revalidate = 300;

type Props = { params: Promise<{ locale: string }> };

// Коды тарифов и цены на случай, если API недоступен — как shared/constants/membership старого фронта
const TARIFF = { volunteer: "volunteer_990", host: "host_4990", international: "international_5000" } as const;
const FALLBACK_PRICE: Record<string, number> = { volunteer_990: 990, host_4990: 4990, international_5000: 5000 };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { locale } = await params;
    if (!isLocale(locale)) return {};
    const t = await getTranslator(locale, "membership");
    return {
        ...pageMetadata({ locale, path: routes.membership(locale), title: t("seo.title"), description: t("seo.description") }),
        keywords: t("seo.keywords"),
    };
}

async function getPrices(locale: Locale): Promise<Record<string, number>> {
    try {
        const { data } = await serverApi(locale).GET("/api/v1/membership/tariffs", {
            params: { query: { forRole: "BOTH" } },
            signal: AbortSignal.timeout(5000),
        });
        const prices = Object.fromEntries((data ?? []).map((tariff) => [tariff.code, (tariff as { priceRub?: number }).priceRub]));
        return Object.fromEntries(Object.entries(FALLBACK_PRICE).map(([code, price]) => [code, prices[code] ?? price]));
    } catch {
        return FALLBACK_PRICE;
    }
}

const faq = (t: Translate) => ["why-pay", "not-renew", "money"].map((key) => ({
    title: t(`questions.faq.${key}.question`),
    description: t(`questions.faq.${key}.answer`),
}));

const howItWorks = [
    ["flat-color-icons_planner", "1. Оплачиваете годовое членство"],
    ["flat-color-icons_ok", "2. Проходите верификацию сервисом и получаете специальный значок на свою страницу"],
    ["flat-color-icons_todo-list", "3. Выбираете хосты на сервисе без ограничений"],
    ["flat-color-icons_like", "4. Хосты смотрят на вашу верификацию и отдают вам предпочтения"],
    ["flat-color-icons_sms", "5. При необходимости пользуетесь чатом поддержки для планирования своего путешествия"],
    ["flat-color-icons_globe", "6. Делаете доброе дело и получаете незабываемые впечатления"],
] as const;

const greenButton = "inline-flex items-center justify-center rounded-lg border border-cta bg-cta px-7 py-3 text-[1rem] font-semibold text-white no-underline transition-all duration-300 hover:bg-white hover:text-cta";

/** «Членство» (MembershipPage старого фронта, GS-219): тарифы, международный клуб, поддержка, отзывы, вопросы */
export default async function MembershipPage({ params }: Props) {
    const { locale } = await params;
    if (!isLocale(locale)) notFound();
    const [t, tCommon, prices, featured] = await Promise.all([
        getTranslator(locale, "membership"),
        getTranslator(locale),
        getPrices(locale),
        getFeaturedReviews(locale),
    ]);
    const pay = (code: string) => `${routes.payment(locale)}?tariff=${code}`;
    const canonical = `${siteUrl()}${routes.membership(locale)}`;
    const structuredData = [
        {
            "@context": "https://schema.org",
            "@type": "WebPage",
            name: t("seo.title"),
            description: t("seo.description"),
            url: canonical,
            inLanguage: locale,
            about: ["membership", "volunteering", "travel"].map((key) => ({ "@type": "Thing", name: t(`geo.about.${key}`) })),
            isPartOf: { "@type": "WebSite", name: "GoodSurfing", url: `${siteUrl()}/` },
        },
        { "@context": "https://schema.org", "@type": "Organization", name: "GoodSurfing", url: siteUrl(), description: t("seo.description") },
        {
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: faq(t).map((item) => ({ "@type": "Question", name: item.title, acceptedAnswer: { "@type": "Answer", text: item.description } })),
        },
    ];
    const tariffLabels = (ns: "for-volunteer" | "for-host") => ({
        free: t(`${ns}.Без членства`),
        paid: t(`${ns}.Членство`),
        unit: t(`${ns}.price-unit`),
        signUp: t(`${ns}.Зарегистрироваться`),
        get: t(`${ns}.Получить членство`),
    });
    const list = (prefix: string, count: number) => Array.from({ length: count }, (_, index) => t(`${prefix}-${index + 1}`));

    return (
        <PublicShell locale={locale} topGap>
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
            <div className="mx-auto max-w-[1920px]">
                {/* Шапка: заголовок на оранжевых плашках, две кнопки-якоря */}
                <section className="box-border flex min-h-[480px] w-full items-center bg-[url(/web/images/membership/membership-header.webp)] bg-cover bg-center px-40 py-24 down-lg:px-8 down-lg:py-12 down-sm:min-h-0 down-sm:px-5 down-sm:py-10">
                    <div className="max-w-[760px]">
                        <h1 className="mb-6 text-[2rem] leading-[1.35] font-bold text-white down-lg:text-[1.625rem] down-sm:text-[1.375rem]">
                            {["header.title-line-1", "header.title-line-2", "header.title-line-3"].map((key, index) => (
                                <span key={key} className={`block w-fit bg-[#eea52d] px-2.5 ${index > 0 ? "mt-[0.45rem]" : ""}`}>{t(key)}</span>
                            ))}
                        </h1>
                        <p className="mb-3 text-[1.125rem] leading-[1.6] text-white/85 down-sm:text-[1rem]">{t("header.desc1")}</p>
                        <p className="mb-3 text-[1.125rem] leading-[1.6] text-white/85 down-sm:text-[1rem]">{t("header.desc2")}</p>
                        <div className="mt-10 flex flex-wrap items-center gap-4 down-sm:flex-col down-sm:items-stretch">
                            <a href="#tariffs" className={`${greenButton} down-sm:text-center`}>{t("header.cta-main")}</a>
                            <a href="#support" className="inline-flex items-center justify-center rounded-lg border border-white px-7 py-3 text-[1rem] font-medium text-white no-underline transition-all duration-300 hover:bg-white hover:text-primary down-sm:text-center">
                                {t("header.cta-secondary")}
                            </a>
                        </div>
                    </div>
                </section>

                {/* Зачем нужно членство */}
                <section className="bg-white">
                    <div className="mx-auto flex max-w-[1150px] items-center gap-12 px-5 py-[60px] down-md:flex-col-reverse down-md:gap-8 down-md:py-10">
                        <div className="min-w-0 flex-1">
                            <h2 className="mb-6 text-[1.75rem] leading-[1.3] font-bold text-[#1a1a1a] down-md:text-[1.375rem]">{t("why-membership.title")}</h2>
                            <p className="mb-4 text-[1.0625rem] leading-[1.7] text-[#424242]">{t("why-membership.p1")}</p>
                            <p className="mb-4 text-[1.0625rem] leading-[1.7] text-[#424242]">{t("why-membership.p2")}</p>
                            <p className="mt-2 border-l-[3px] border-cta pl-4 text-[1.0625rem] leading-[1.7] font-semibold text-cta">{t("why-membership.p3")}</p>
                        </div>
                        <div className="flex min-h-[280px] min-w-0 flex-1 items-center justify-center overflow-hidden rounded-xl down-md:min-h-[200px] down-md:w-full">
                            {/* eslint-disable-next-line @next/next/no-img-element -- иллюстрация */}
                            <img src="/web/images/membership/why.webp" alt={t("Волонтёры Гудсёрфинга")} className="block h-full w-full rounded-xl object-cover" />
                        </div>
                    </div>
                </section>

                <TariffCards
                    id="tariffs"
                    background
                    title={t("for-volunteer.section-title")}
                    free={list("for-volunteer.free-feature", 3)}
                    paid={list("for-volunteer.paid-feature", 6)}
                    price={prices[TARIFF.volunteer]!}
                    payHref={pay(TARIFF.volunteer)}
                    signUpHref={routes.signUp(locale)}
                    hostNote={{ text: t("for-volunteer.host-note"), link: t("for-volunteer.host-note-link") }}
                    labels={tariffLabels("for-volunteer")}
                />

                {/* Как это работает */}
                <section className="mt-20">
                    <div className="mx-auto max-w-[1150px] px-5 py-[52px] text-center">
                        <h2 className="mb-3 text-[1.625rem] font-bold down-md:text-[1.375rem]">{t("how-it-works.Как это работает")}</h2>
                        <p className="mx-auto mb-10 max-w-[700px] text-[1rem] leading-[1.6]">
                            {t("how-it-works.С оформленным членством Гудсёрфинга вы можете пользоваться всеми возможностями нашего сервиса без каких-либо ограничений.")}
                        </p>
                        <div className="grid grid-cols-3 gap-6 down-md:grid-cols-2 down-md:gap-5 down-xs:grid-cols-1">
                            {howItWorks.map(([icon, text]) => (
                                <div key={icon} className="flex flex-col items-center gap-3 text-center">
                                    <div className="flex h-[114px] w-[114px] items-center justify-center rounded-full bg-accent-bg">
                                        {/* eslint-disable-next-line @next/next/no-img-element -- иконка */}
                                        <img src={`/web/images/membership/${icon}.svg`} alt="" aria-hidden className="h-12 w-12 shrink-0" />
                                    </div>
                                    <p className="text-[0.9375rem] leading-[1.5] text-ink-secondary">{t(`how-it-works.${text}`)}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Международный клуб — между личным членством и членством для организаторов (правка бизнеса) */}
                <section id="international" aria-labelledby="international-club-title" className="mt-20 bg-[#edf3f6] text-[#242424]">
                    <div className="mx-auto max-w-[1150px] px-5 pt-[60px] pb-12 down-md:pt-12 down-md:pb-10 down-xs:px-4 down-xs:pt-10 down-xs:pb-9">
                        <header className="mx-auto mb-7 text-center">
                            <h2 id="international-club-title" className="mb-4 text-[1.75rem] leading-[1.3] font-bold text-balance down-md:text-[1.5rem]">{t("international-club.title")}</h2>
                            <p className="mb-5 text-[1.25rem] leading-[1.4] font-semibold down-xs:text-[1.125rem]">{t("international-club.subtitle")}</p>
                            <p className="mx-auto max-w-[920px] text-[0.9375rem] leading-[1.55]">{t("international-club.description")}</p>
                        </header>
                        <div className="grid grid-cols-2 items-stretch gap-6 down-md:grid-cols-1">
                            <div className="flex flex-col rounded-lg border-2 border-[#38a9ef] bg-white p-7 down-xs:px-5 down-xs:py-6">
                                <h3 className="mb-4 text-[1.25rem] leading-[1.35] font-bold">{t("international-club.includes-title")}</h3>
                                <span className="mb-4 self-start rounded-[10px] bg-[#f5f8fa] px-6 py-2 text-[1.375rem] font-bold whitespace-nowrap text-[#212121]">
                                    {prices[TARIFF.international]!.toLocaleString("ru-RU")} <span className="text-[0.875rem] font-normal">{t("international-club.price-unit")}</span>
                                </span>
                                <ul className="mb-6 flex list-disc flex-col gap-2 pl-5 text-[0.9375rem] leading-[1.45]">
                                    {list("international-club.benefit", 7).map((benefit) => <li key={benefit}>{benefit}</li>)}
                                </ul>
                                <a href={pay(TARIFF.international)} className="mt-auto inline-block self-start rounded-[10px] bg-primary px-[50px] py-3.5 text-center text-[1rem] leading-[1.375rem] text-white transition-colors duration-300 hover:bg-primary-hover down-xs:w-full">
                                    {t("international-club.join-button")}
                                </a>
                            </div>
                            <div className="min-h-[360px] overflow-hidden rounded-lg bg-[#dfe7eb] down-md:min-h-[280px] down-xs:min-h-[220px]">
                                {/* eslint-disable-next-line @next/next/no-img-element -- иллюстрация */}
                                <img src="/web/images/membership/international-club.png" alt={t("international-club.image-alt")} loading="lazy" className="block h-full w-full object-cover outline-1 -outline-offset-1 outline-black/6" />
                            </div>
                        </div>
                        <div className="mx-auto mt-7 max-w-[720px] text-center">
                            <h3 className="mb-3.5 text-[1.375rem] leading-[1.35] font-bold">{t("international-club.contribution-title")}</h3>
                            <p className="mb-3.5 text-[0.9375rem] leading-[1.5]">{t("international-club.contribution-description")}</p>
                            <ul className="mx-auto mb-6 flex max-w-[640px] list-none flex-col gap-2 p-0 text-left">
                                {list("international-club.contribution", 4).map((item) => (
                                    <li key={item} className="flex items-start gap-3 text-[0.9375rem] leading-[1.45]">
                                        {/* eslint-disable-next-line @next/next/no-img-element -- иконка */}
                                        <img src="/web/images/membership/check.svg" alt="" aria-hidden className="h-6 w-6 flex-[0_0_24px]" />
                                        <span>{item}</span>
                                    </li>
                                ))}
                            </ul>
                            <a href={INTERNATIONAL_URL} className="mx-auto inline-block rounded-[10px] border border-host bg-host px-[50px] py-3.5 text-center text-[1rem] leading-[1.375rem] text-white transition-all duration-300 hover:bg-white hover:text-host down-xs:w-full">
                                {t("international-club.learn-more-button")}
                            </a>
                        </div>
                    </div>
                </section>

                <TariffCards
                    id="host"
                    title={t("for-host.section-title")}
                    free={list("for-host.free-feature", 3)}
                    paid={list("for-host.paid-feature", 9)}
                    price={prices[TARIFF.host]!}
                    payHref={pay(TARIFF.host)}
                    signUpHref={routes.signUp(locale)}
                    labels={tariffLabels("for-host")}
                />

                {/* Поддержать без членства и как ещё помочь */}
                <div id="support" className="mt-20">
                    <section className="bg-[#f5f7f5]">
                        <div className="mx-auto flex max-w-[1150px] items-start gap-12 px-5 py-[60px] max-[900px]:flex-col">
                            <div className="flex flex-[0_0_300px] flex-col gap-5 max-[900px]:w-full max-[900px]:flex-none">
                                <h2 className="text-[1.75rem] leading-[1.3] font-bold text-[#1a1a1a] max-[600px]:text-[1.375rem]">{t("donation.title")}</h2>
                                <p className="text-[1rem] leading-[1.6] text-[#616161]">{t("donation.subtitle")}</p>
                                <a href={pay(TARIFF.volunteer)} className={`${greenButton} text-center`}>{t("donation.cta")}</a>
                            </div>
                            <div className="min-w-0 flex-1">
                                <h3 className="mb-3 text-[1.25rem] font-bold text-[#1a1a1a]">{t("donation.funds-title")}</h3>
                                <p className="mb-4 text-[0.9375rem] leading-[1.6] text-[#424242]">{t("donation.funds-intro")}</p>
                                <ul className="mb-6 flex list-none flex-col gap-2.5">
                                    {list("donation.funds", 5).map((item) => (
                                        <li key={item} className="flex gap-2.5 text-[0.9375rem] leading-[1.5] text-[#424242]">
                                            <span className="shrink-0 font-bold text-[#4CAF50]">✓</span>
                                            <span>{item}</span>
                                        </li>
                                    ))}
                                </ul>
                                <div className="flex flex-col gap-3 border-t border-[#e0e0e0] pt-5">
                                    <p className="text-[0.9375rem] leading-[1.6] text-[#616161]">{t("donation.why-p1")}</p>
                                    <p className="text-[0.9375rem] leading-[1.6] font-semibold text-[#1a5c33]">{t("donation.why-p2")}</p>
                                    <a href={routes.npo(locale)} className="text-[0.875rem] font-semibold text-[#4CAF50] no-underline hover:underline">{t("donation.reports-link")}</a>
                                </div>
                            </div>
                        </div>
                    </section>
                    <section className="bg-white">
                        <div className="mx-auto max-w-[1150px] px-5 py-[60px]">
                            <h2 className="mb-8 text-center text-[1.75rem] font-bold text-[#1a1a1a] max-[600px]:text-[1.375rem]">{t("donation.help-title")}</h2>
                            <div className="grid grid-cols-3 gap-6 max-[900px]:grid-cols-1">
                                {[1, 2, 3].map((index) => (
                                    <div key={index} className={`flex flex-col gap-4 rounded-xl px-6 py-8 text-white ${index === 3 ? "bg-[#2e7d53]" : "bg-[#1565C0]"}`}>
                                        <div aria-hidden className="flex h-10 w-10 items-center justify-center rounded-full bg-white/25 text-[1.5rem] font-bold text-white">+</div>
                                        <h3 className="text-[1.125rem] leading-[1.3] font-bold text-white">{t(`donation.help-${index}-title`)}</h3>
                                        <p className="text-[0.9375rem] leading-[1.6] text-white/85">{t(`donation.help-${index}-text`)}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </section>
                </div>

                {/* Что делает Гудсёрфинг: текст поверх затемнённой фотографии */}
                <section className="relative mt-20 w-full">
                    <div className="absolute top-1/2 left-1/2 z-[2] flex w-full max-w-[980px] -translate-x-1/2 -translate-y-1/2 flex-col items-center justify-center down-lg:p-5">
                        <h2 className="text-center text-[1.625rem] font-normal text-white">
                            {t("what-is-goodsurfing.Что делает Гудсёрфинг и как он помогает развиваться сообществу")}
                        </h2>
                        <p className="mt-[38px] text-center text-[.875rem] leading-[1.135rem] font-medium text-white">
                            {t("what-is-goodsurfing.Миссия Гудсёрфинга – развитие выездного добровольчества в России и мире с помощью создания удобного веб-сервиса и распространения информации о подобных возможностях. В рамках этой миссии мы постоянно занимаемся развитием технологической части сервиса, готовим и распространяем полезный контент, формируем образовательные программы.")}
                            <br />
                            {t("what-is-goodsurfing.Мы уверены, что тысячи людей разделят с нами наши ценности в путешествиях со смыслом и готовы поддержать нас, оформив членство в сообществе. А мы в свою очередь сделаем для них всё возможное, чтобы их путешествия со смыслом были комфортными, полезными для общества и не забываемыми.")}
                        </p>
                        <a href={routes.profileRole(locale)} className="mt-[30px] flex items-center justify-center rounded-[10px] border border-primary bg-primary px-[100px] py-3 text-center text-[16px] leading-[120%] text-white transition-all duration-300 hover:bg-white hover:text-primary down-lg:w-full down-lg:max-w-[220px] down-lg:px-[15px]">
                            {t("what-is-goodsurfing.Начать сейчас")}
                        </a>
                    </div>
                    <div aria-hidden className="box-border min-h-[624px] w-full bg-[url(/web/images/membership/back.webp)] bg-cover bg-center bg-no-repeat brightness-[30%]" />
                </section>

                <MembershipReviews
                    title={t("review.Отзывы")}
                    reviews={featured.map((review) => ({
                        id: String(review.id),
                        title: review.title ?? "",
                        text: review.description ?? "",
                        image: mediaUrl(review.images?.[0], "large") ?? "",
                        author: review.authorName ?? "",
                        avatar: mediaUrl(review.authorAvatar, "small"),
                    }))}
                    labels={{ prev: tCommon("slider.previous"), next: tCommon("slider.next"), textPrev: tCommon("slider.previous"), textNext: tCommon("slider.next") }}
                />

                <div className="mx-auto mt-20 w-full max-w-[980px] down-lg:px-5">
                    <h2 className="mx-auto w-full text-center text-[1.5em] font-bold">
                        {t("questions.Остались вопросы?")}
                        <br />
                        {t("questions.Сейчас ответим")}
                    </h2>
                    <FaqAccordion items={faq(t)} />
                </div>
            </div>
        </PublicShell>
    );
}
