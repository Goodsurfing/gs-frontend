import React, { FC, useEffect } from "react";
import { useTranslation } from "react-i18next";

import { useLocale } from "@/app/providers/LocaleProvider";
import { useGetCourseLessonByIdQuery, useWatchLessonMutation } from "@/entities/Academy/api/courseApi";
import { LessonReview } from "@/features/Academy";
import { Navigation } from "@/features/Article";
import { getAcademyCoursePageUrl, getAcademyLessonPageUrl, getAcademyMainPageUrl } from "@/shared/config/routes/AppUrls";
import { getMediaContent } from "@/shared/lib/getMediaContent";
import { getSeoDescription, getSeoUrl } from "@/shared/lib/getSeoUrl";
import CustomLink from "@/shared/ui/Link/Link";
import { MiniLoader } from "@/shared/ui/MiniLoader/MiniLoader";
import { SeoHelmet } from "@/shared/ui/SeoHelmet";
import { LessonVideo } from "../LessonVideo/LessonVideo";
import styles from "./LessonPersonal.module.scss";

interface LessonPersonalProps {
    lessonId: string;
}

export const LessonPersonal: FC<LessonPersonalProps> = (props) => {
    const { lessonId } = props;
    const { locale } = useLocale();
    const { t, ready } = useTranslation("academy");
    const { data, isLoading } = useGetCourseLessonByIdQuery(lessonId);
    const [watchLesson] = useWatchLessonMutation();

    const prevLessonId = data?.prevVideoId ?? null;
    const nextLessonId = data?.nextVideoId ?? null;

    useEffect(() => {
        watchLesson(lessonId);
    }, [lessonId, watchLesson]);

    const seoTitle = data?.name || t("seo.lesson.title");
    const seoDescription = data?.description
        ? getSeoDescription(data.description) || t("seo.lesson.description")
        : t("seo.lesson.description");
    const seoUrl = getSeoUrl(getAcademyLessonPageUrl(locale, lessonId));
    // og:image: краулерам нужен оригинал
    // eslint-disable-next-line no-restricted-syntax
    const seoImage = getMediaContent(data?.image?.contentUrl);
    const seoKeywords = [
        data?.name,
        data?.course.name,
        t("seo.lesson.keywords"),
    ].filter(Boolean).join(", ");

    return (
        <div className={styles.wrapper}>
            {ready && data && (
                <SeoHelmet
                    title={seoTitle}
                    description={seoDescription}
                    canonicalUrl={seoUrl}
                    keywords={seoKeywords}
                    ogImage={seoImage}
                />
            )}
            {data && (
                <Navigation
                    breadcrumbs={[
                        { name: "Курсы", link: getAcademyMainPageUrl(locale) },
                        {
                            name: data.course.name,
                            link: getAcademyCoursePageUrl(locale, data.course.id),
                        },
                        { name: data.name },
                    ]}
                    className={styles.navigation}
                />
            )}
            <div className={styles.articleWrapper}>
                {isLoading ? <MiniLoader /> : (
                    <>
                        <h1 className={styles.title}>
                            {data?.name}
                        </h1>
                        <p className={styles.description}>
                            {data?.description}
                        </p>
                        <LessonVideo className={styles.lessonVideo} videoUrl={data?.url} />
                        {(() => {
                            const validFiles = (data?.files ?? []).filter((f) => f.contentUrl);
                            if (!validFiles.length) return null;
                            return (
                                <div className={styles.filesSection}>
                                    <h3 className={styles.filesTitle}>Материалы к уроку</h3>
                                    <ul className={styles.filesList}>
                                        {validFiles.map((file) => {
                                            // скачивание файла: нужен оригинал
                                            // eslint-disable-next-line no-restricted-syntax
                                            const url = getMediaContent(file.contentUrl);
                                            const fileName = file.contentUrl.split("/").pop() || "Файл";
                                            return (
                                                <li key={file.id} className={styles.filesItem}>
                                                    <a
                                                        href={url}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className={styles.filesLink}
                                                    >
                                                        {"📎 "}
                                                        {fileName}
                                                    </a>
                                                </li>
                                            );
                                        })}
                                    </ul>
                                </div>
                            );
                        })()}
                    </>
                )}
                <div className={styles.buttons}>
                    {prevLessonId && (
                        <CustomLink
                            to={getAcademyLessonPageUrl(locale, prevLessonId)}
                            variant="DEFAULT"
                        >
                            🠐 Предыдущая лекция
                        </CustomLink>
                    )}
                    {nextLessonId && (
                        <CustomLink
                            to={getAcademyLessonPageUrl(locale, nextLessonId)}
                            variant="DEFAULT"
                            style={{ marginLeft: prevLessonId === null ? "auto" : 0 }}
                        >
                            Следующая лекция 🠒
                        </CustomLink>
                    )}
                </div>
            </div>
            <div className={styles.commentWrapper}>
                <LessonReview lessonId={lessonId} locale={locale} canReview={data?.isCanReview} />
            </div>
        </div>
    );
};
