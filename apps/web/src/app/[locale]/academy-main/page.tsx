import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { CourseCard } from "@/components/academy/AcademyCards";
import { AcademySection } from "@/components/academy/AcademySection";
import { ScrollToButton } from "@/components/academy/ScrollToButton";
import { HowItWork } from "@/components/home/HowItWork";
import { PublicShell } from "@/components/layout/PublicShell";
import { Pagination } from "@/components/list/Pagination";
import { isLocale } from "@/i18n/config";
import { getTranslator } from "@/i18n/dictionary";
import { ACADEMY_PAGE_SIZE, getCourses } from "@/lib/academy";
import { listHref, listParams } from "@/lib/listParams";
import { mediaUrl } from "@/lib/media";
import { routes } from "@/lib/routes";
import { pageMetadata } from "@/lib/seo";

type Props = {
    params: Promise<{ locale: string }>;
    searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { locale } = await params;
    if (!isLocale(locale)) return {};
    const t = await getTranslator(locale, "academy");
    return {
        ...pageMetadata({ locale, path: routes.academy(locale), title: t("seo.main.title"), description: t("seo.main.description") }),
        keywords: t("seo.main.keywords"),
    };
}

/** «Академия»: обложка, «Как это работает?», курсы постранично (AcademyMainPage старого фронта, GS-219) */
export default async function AcademyMainPage({ params, searchParams }: Props) {
    const { locale } = await params;
    if (!isLocale(locale)) notFound();
    const { page } = listParams(await searchParams);
    const [t, tCommon, courses] = await Promise.all([getTranslator(locale, "academy"), getTranslator(locale), getCourses(locale, page)]);
    const pages = Math.ceil((courses?.total ?? 0) / ACADEMY_PAGE_SIZE);
    const base = routes.academy(locale);

    return (
        <PublicShell locale={locale} headerVariant="static">
            <div className="mx-auto flex min-h-[380px] w-full max-w-[1920px] items-center justify-center bg-[url(/web/images/academy-header.webp)] bg-cover bg-center bg-no-repeat down-lg:px-5">
                <div className="flex w-full max-w-[720px] flex-col items-center justify-center gap-[30px] text-center text-white">
                    <h1 className="text-[2em] font-bold">{t("Учитесь гудсёрфингу вместе с нами!")}</h1>
                    <p>{t("Goodsurfing — способ путешествовать недорого, занимаясь интересным и важным делом с помощью волонтёрства или экспедиций")}</p>
                    <ScrollToButton target="courses" label={t("Выбрать курс")} />
                </div>
            </div>
            <AcademySection title={t("Как это работает?")}>
                <HowItWork locale={locale} showButton={false} />
            </AcademySection>
            <AcademySection title={t("Курсы")} id="courses" className="down-lg:pt-[30px]">
                <p className="mt-5 text-center">
                    {t("Авторские курсы от экспертов помогут вам научиться новому в путешествиях и волонтерстве Смотрите, выполняйте домашние задания, получайте сертификацию")}
                </p>
                <div className="flex w-full flex-col gap-[30px] py-[60px] down-lg:items-center down-lg:justify-center">
                    {!courses && <div>{t("Ошибка загрузки курсов")}</div>}
                    {courses?.items.length === 0 && <div>{t("На данный момент нет ни одного курса")}</div>}
                    {courses?.items.map((course) => (
                        <CourseCard
                            key={course.id}
                            href={routes.academyCourse(locale, course.id)}
                            title={course.name}
                            cover={mediaUrl(course.image, "medium")}
                            videos={course.videoCount}
                            duration={course.duration}
                            rating={Number(course.averageRating)}
                            author={course.authorName}
                            description={course.description}
                            labels={{ videos: t("видео"), author: t("Автор"), open: t("Пройти курс") }}
                        />
                    ))}
                    {pages > 1 && (
                        <Pagination
                            page={page}
                            count={pages}
                            href={(target) => listHref(base, { page: target })}
                            labels={{ prev: tCommon("pagination.prev"), next: tCommon("pagination.next"), page: tCommon("pagination.label") }}
                        />
                    )}
                </div>
            </AcademySection>
        </PublicShell>
    );
}
