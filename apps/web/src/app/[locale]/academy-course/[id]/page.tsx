import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { LessonCard } from "@/components/academy/AcademyCards";
import { AcademySection } from "@/components/academy/AcademySection";
import { CourseProgress } from "@/components/academy/CourseProgress";
import { ScrollToButton } from "@/components/academy/ScrollToButton";
import { PublicShell } from "@/components/layout/PublicShell";
import { Pagination } from "@/components/list/Pagination";
import { TeamCard } from "@/components/team/TeamCard";
import { isLocale } from "@/i18n/config";
import { getTranslator } from "@/i18n/dictionary";
import { ACADEMY_PAGE_SIZE, getCourse, getLessons } from "@/lib/academy";
import { listHref, listParams } from "@/lib/listParams";
import { mediaUrl } from "@/lib/media";
import { routes } from "@/lib/routes";
import { pageMetadata, seoDescription } from "@/lib/seo";

type Props = {
    params: Promise<{ locale: string; id: string }>;
    searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { locale, id } = await params;
    if (!isLocale(locale)) return {};
    const [t, course] = await Promise.all([getTranslator(locale, "academy"), getCourse(locale, id)]);
    const path = routes.academyCourse(locale, id);
    if (!course) return pageMetadata({ locale, path, title: t("seo.course.title"), description: t("seo.course.description"), noindex: true });
    return {
        ...pageMetadata({
            locale,
            path,
            title: course.name || t("seo.course.title"),
            description: (course.description && seoDescription(course.description)) || t("seo.course.description"),
            image: mediaUrl(course.image),
        }),
        keywords: [course.name, course.author?.firstName, course.author?.lastName, t("seo.course.keywords")].filter(Boolean).join(", "),
    };
}

/** Раздел с текстом курса (TextCard старого фронта); пустой — не показывается */
function TextSection({ title, text }: { title: string; text?: string | null }) {
    if (!text) return null;
    return (
        <AcademySection title={title} innerClassName="flex flex-col gap-6 text-[16px] [overflow-wrap:break-word] whitespace-pre-line">
            <div>{text}</div>
        </AcademySection>
    );
}

/** Страница курса: шапка, описание, эксперты, прогресс, уроки (AcademyCoursePage старого фронта, GS-219) */
export default async function AcademyCoursePage({ params, searchParams }: Props) {
    const { locale, id } = await params;
    if (!isLocale(locale)) notFound();
    const { page } = listParams(await searchParams);
    const [t, tCommon, course, lessons] = await Promise.all([
        getTranslator(locale, "academy"),
        getTranslator(locale),
        getCourse(locale, id),
        getLessons(locale, id, page),
    ]);

    if (!course) {
        return (
            <PublicShell locale={locale} headerVariant="static">
                <p>{t("Курс не был найден")}</p>
            </PublicShell>
        );
    }

    const pages = Math.ceil((lessons?.total ?? 0) / ACADEMY_PAGE_SIZE);
    const base = routes.academyCourse(locale, id);
    const cover = mediaUrl(course.image, "large");

    return (
        <PublicShell locale={locale} headerVariant="static">
            <div className="flex w-full items-center justify-center bg-[linear-gradient(257deg,#65FFE3_-1.78%,#1064A0_103.74%)] p-10 max-[567px]:p-5">
                <div className="flex w-full max-w-[1180px] justify-between gap-10 down-lg:flex-col-reverse">
                    <div className="flex flex-col gap-[30px] pt-[30px] text-white down-lg:pt-0 max-[567px]:gap-5">
                        <h1 className="text-[26px] leading-[120%] font-normal max-[567px]:text-[22px]">{course.name}</h1>
                        <div className="flex items-center gap-5 text-[16px] leading-[125%] max-[567px]:flex-col max-[567px]:items-start">
                            <span>{course.videoCount} {t("уроков")}</span>
                            {course.duration !== "" && (
                                <>
                                    <div className="h-2.5 w-2.5 rounded-full bg-white max-[567px]:hidden" />
                                    <span>{course.duration} {t("на прохождение")}</span>
                                </>
                            )}
                            <div className="h-2.5 w-2.5 rounded-full bg-white max-[567px]:hidden" />
                            <div className="flex items-center gap-1.5">
                                {/* eslint-disable-next-line @next/next/no-img-element -- иконка */}
                                <img src="/web/icons/offer/star.svg" alt="star-icon" />
                                <span>{Number(course.averageRating)}</span>
                            </div>
                        </div>
                        <span>{t("Автор")}: {course.authorName}</span>
                        <ScrollToButton target="lessons" label={t("Начать обучение")} className="w-fit max-[567px]:mt-[30px] max-[567px]:w-full" />
                    </div>
                    {/* eslint-disable-next-line @next/next/no-img-element -- обложка из хранилища */}
                    {cover && <img src={cover} alt={course.name} className="h-full max-h-[300px] w-full max-w-[565px] object-cover" />}
                </div>
            </div>
            <div className="pb-[70px] [@media(max-width:1000px)]:pb-0">
                <TextSection title={t("О курсе")} text={course.description} />
                <TextSection title={t("Об авторе")} text={course.aboutAuthor} />
                <TextSection title={t("Для кого подходит курс")} text={course.courseFor} />
                {course.experts.length > 0 && (
                    <AcademySection title={t("Эксперты")} innerClassName="flex flex-col gap-6">
                        <div className="grid w-full grid-cols-2 gap-[30px] [@media(max-width:1000px)]:grid-cols-1">
                            {course.experts.map((expert, index) => (
                                <TeamCard
                                    key={`${expert.id}-${index}`}
                                    locale={locale}
                                    image={mediaUrl(expert.image, "medium")}
                                    name={`${expert.firstName || ""} ${expert.lastName || ""}`.trim()}
                                    description={expert.project ?? ""}
                                    address={[expert.country, expert.city].filter(Boolean).join(", ")}
                                />
                            ))}
                        </div>
                    </AcademySection>
                )}
                {course.videoCount > 0 && (
                    <AcademySection>
                        <CourseProgress
                            courseId={id}
                            total={course.videoCount}
                            title={t("Прогресс по курсу")}
                            lessonLabel="урок"
                            doneLabel={{ one: "урок пройдено", few: "урока пройдено", many: "уроков пройдено" }}
                        />
                    </AcademySection>
                )}
                <AcademySection title={t("Видео")} id="lessons" className="!pt-[60px] pb-[60px] [@media(max-width:1000px)]:pb-0">
                    <div className="flex w-full flex-col gap-[30px] py-10 down-lg:items-center down-lg:justify-center">
                        {!lessons && <div>{t("Ошибка загрузки уроков")}</div>}
                        {lessons?.items.length === 0 && <div>{t("На данный момент нет ни одного урока")}</div>}
                        {lessons?.items.map((lesson) => (
                            <LessonCard
                                key={lesson.id}
                                href={routes.academyLesson(locale, lesson.id)}
                                title={lesson.name}
                                cover={mediaUrl(lesson.image, "medium")}
                                duration={lesson.duration}
                                rating={Number(lesson.averageRating)}
                                description={lesson.description}
                                open={t("Смотреть лекцию")}
                            />
                        ))}
                        {pages > 1 && (
                            <Pagination
                                page={page}
                                count={pages}
                                href={(target) => `${listHref(base, { page: target })}#lessons`}
                                labels={{ prev: tCommon("pagination.prev"), next: tCommon("pagination.next"), page: tCommon("pagination.label") }}
                            />
                        )}
                    </div>
                </AcademySection>
            </div>
        </PublicShell>
    );
}
