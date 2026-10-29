import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { GalleryCarousel } from "@/components/gallery/GalleryCarousel";
import { PublicShell } from "@/components/layout/PublicShell";
import { isLocale } from "@/i18n/config";
import { getTranslator } from "@/i18n/dictionary";
import { getAboutProject } from "@/lib/aboutProject";
import { boldText } from "@/lib/boldText";
import { mediaUrl } from "@/lib/media";
import { routes } from "@/lib/routes";
import { pageMetadata } from "@/lib/seo";

// Тексты и цифры из админки обновляются раз в 5 минут
export const revalidate = 300;

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { locale } = await params;
    if (!isLocale(locale)) return {};
    const t = await getTranslator(locale, "about-project");
    return pageMetadata({ locale, path: routes.aboutProject(locale), title: t("seo.title"), description: t("seo.description") });
}

// Отступы секций как в старом фронте: 150 px по бокам (у «принципов» и «сегодня» — 300), уже 1200 px — 20
const SECTION = "mx-auto mt-[60px] box-border max-w-[1920px] px-[150px] [@media(max-width:1200px)]:px-5";
const SECTION_NARROW = "mx-auto mt-[60px] box-border max-w-[1920px] px-[300px] [@media(max-width:1200px)]:px-5";
const TEXT_TITLE = "text-center text-[1.625rem] font-normal";
const TITLE = "text-center text-[1.5rem] font-bold";
const TEXT = "w-full max-w-[720px] text-justify text-[0.875rem] leading-[1.6] break-words whitespace-pre-line";
// Синяя кнопка старого фронта (Button FILL BLUE MEDIUM): уже 992 px — во всю ширину
const BUTTON = "flex items-center justify-center rounded-[10px] border border-primary bg-primary py-3 text-center text-label text-white transition-all duration-300 hover:bg-white hover:text-primary down-lg:w-full";

/** «О проекте»: миссия, история, принципы, цифры, фото (GS-219). */
export default async function AboutProjectPage({ params }: Props) {
    const { locale } = await params;
    if (!isLocale(locale)) notFound();
    const [t, tCommon, data] = await Promise.all([
        getTranslator(locale, "about-project"),
        getTranslator(locale),
        getAboutProject(locale),
    ]);

    const today = data?.today;
    const stats = today ? [
        [today.volunteerCount, t("гудсёрферов")],
        [today.vacancyCountryCount, t("стран")],
        [today.vacancyCount, t("вакансий")],
        [today.reviewCount, t("отзывов")],
    ] as const : [];
    const gallery = (data?.galleryImages ?? []).map((image) => mediaUrl(image, "large")).filter((url): url is string => Boolean(url));

    return (
        <PublicShell locale={locale} topGap>
            <div className="pb-[100px]">
                <section className="mx-auto box-border flex min-h-[380px] w-full max-w-[1920px] items-center justify-center bg-[linear-gradient(rgba(0,0,0,0.35),rgba(0,0,0,0.35)),url(/web/images/about-project-header.webp)] bg-cover bg-center bg-no-repeat px-40 py-24 down-lg:min-h-[260px] down-lg:p-5">
                    <h1 className="text-center text-[2.5rem] font-semibold text-white [text-shadow:0_2px_8px_rgba(0,0,0,0.35)] down-lg:text-[1.75rem]">
                        {t("ГудСёрфинг – путешествие со смыслом")}
                    </h1>
                </section>

                {data?.mission && (
                    <section className={`${SECTION} flex w-full flex-col items-center justify-center gap-9`}>
                        <h2 className={TEXT_TITLE}>{t("Миссия ГудСёрфинга")}</h2>
                        <p className={TEXT}>{boldText(data.mission)}</p>
                        <a href={routes.npo(locale)} className={`${BUTTON} max-w-[380px] px-[70px]`}>{t("О некоммерческой организации")}</a>
                    </section>
                )}

                {data?.howAllStart && (
                    <section className={`${SECTION} flex w-full flex-col items-center justify-center gap-9`}>
                        <h2 className={TEXT_TITLE}>{t("Как всё началось")}</h2>
                        <p className={TEXT}>{boldText(data.howAllStart)}</p>
                    </section>
                )}

                {data && data.principles.length > 0 && (
                    <section className={SECTION_NARROW}>
                        <h2 className={TITLE}>{t("Принципы ГудСёрфинга")}</h2>
                        <div className="mt-9 flex flex-wrap justify-between gap-[30px] down-lg:justify-center">
                            {data.principles.map((item) => (
                                <div key={item.name} className="flex max-w-[180px] flex-col items-center justify-center gap-4">
                                    {/* eslint-disable-next-line @next/next/no-img-element -- картинка из админки */}
                                    <img src={mediaUrl(item.image, "medium") ?? ""} alt={item.name} className="h-[180px] w-[180px] rounded-full bg-accent-bg object-cover" />
                                    <span className="text-center text-[1.125rem] font-medium">{item.name}</span>
                                    <span className="text-center text-[0.875rem] font-medium">{item.description}</span>
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                <section className={SECTION_NARROW}>
                    <h2 className={TITLE}>{t("ГудСёрфинг сегодня")}</h2>
                    <div className="mt-9 flex flex-wrap justify-center gap-[30px] px-[100px] down-lg:px-0">
                        {stats.map(([value, label]) => (
                            <div key={label} className="flex max-w-[140px] flex-col gap-2.5">
                                <div className="flex h-[140px] w-[140px] items-center justify-center rounded-full bg-field">
                                    <span className="text-center text-[2.25rem] font-medium text-primary">{value}</span>
                                </div>
                                <span className="text-center text-[1.125rem] font-medium">{label}</span>
                            </div>
                        ))}
                    </div>
                    <a href={routes.membership(locale)} className={`${BUTTON} mx-auto mt-9 w-fit px-[100px] down-lg:px-[15px]`}>{t("Присоединиться")}</a>
                </section>

                {gallery.length > 0 && (
                    <section className={SECTION}>
                        <h2 className={TITLE}>{t("Фото со встреч и командной работы")}</h2>
                        <GalleryCarousel
                            className="mt-[30px]"
                            images={gallery}
                            labels={{
                                open: tCommon("gallery.open"),
                                photo: tCommon("gallery.photo"),
                                close: tCommon("Закрыть"),
                                prev: tCommon("slider.previous"),
                                next: tCommon("slider.next"),
                            }}
                        />
                    </section>
                )}
            </div>
        </PublicShell>
    );
}
