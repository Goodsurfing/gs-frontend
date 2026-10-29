import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { LessonView } from "@/components/academy/LessonView";
import { PublicShell } from "@/components/layout/PublicShell";
import { isLocale } from "@/i18n/config";
import { getTranslator } from "@/i18n/dictionary";
import { getLessonReviews } from "@/lib/academy";
import { routes } from "@/lib/routes";
import { pageMetadata } from "@/lib/seo";

export const revalidate = 300;

type Props = { params: Promise<{ locale: string; id: string }> };

// Урок отдаётся только вошедшим — с сервера нечего показать, кроме общих описаний
export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { locale, id } = await params;
    if (!isLocale(locale)) return {};
    const t = await getTranslator(locale, "academy");
    return {
        ...pageMetadata({ locale, path: routes.academyLesson(locale, id), title: t("seo.lesson.title"), description: t("seo.lesson.description") }),
        keywords: t("seo.lesson.keywords"),
    };
}

/** Урок академии: видео, материалы, соседние уроки, отзывы (AcademyLessonPage старого фронта, GS-219) */
export default async function AcademyLessonPage({ params }: Props) {
    const { locale, id } = await params;
    if (!isLocale(locale)) notFound();
    const [t, tCommon, tOffer, reviews] = await Promise.all([
        getTranslator(locale, "academy"),
        getTranslator(locale),
        getTranslator(locale, "offer"),
        getLessonReviews(locale, id),
    ]);

    return (
        <PublicShell locale={locale} headerVariant="static">
            <LessonView
                lessonId={id}
                reviews={reviews}
                coursesHref={routes.academy(locale)}
                courseHref={routes.academyCourse(locale, "{id}")}
                lessonHref={routes.academyLesson(locale, "{id}")}
                signInHref={routes.signIn(locale)}
                volunteerHref={routes.volunteerPublicTemplate(locale)}
                labels={{
                    courses: t("Курсы"),
                    materials: t("Материалы к уроку"),
                    prev: t("Предыдущая лекция"),
                    next: t("Следующая лекция"),
                    videoForUsers: t("Видео доступно только для зарегистрированных пользователей"),
                    signIn: t("Авторизоваться"),
                    noVideo: t("Видео не было найдено"),
                    unsupported: tCommon("Неподдерживаемая ссылка на видео"),
                    loadError: tCommon("Произошла ошибка"),
                    count: t("комментариев"),
                    loginToReview: t("Чтобы оставить отзыв на курс нужно авторизоваться"),
                    write: t("Написать отзыв"),
                    placeholder: t("Ваш отзыв"),
                    rating: t("Ваш отзыв"),
                    empty: t("На данный момент отзывов нет"),
                    sendError: t("Не удалось отправить отзыв Попробуйте позже"),
                    reviewsError: t("Произошла ошибка загрузки отзывов"),
                    showNext: tOffer("personalOffer.Посмотреть следующие"),
                    anonymous: tCommon("Анонимный пользователь"),
                }}
            />
        </PublicShell>
    );
}
