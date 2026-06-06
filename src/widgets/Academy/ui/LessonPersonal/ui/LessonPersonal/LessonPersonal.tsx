import React, { FC, useEffect } from "react";
import { Navigation } from "@/features/Article";
import { getAcademyCoursePageUrl, getAcademyLessonPageUrl, getAcademyMainPageUrl } from "@/shared/config/routes/AppUrls";
import { useLocale } from "@/app/providers/LocaleProvider";
import { useGetCourseLessonByIdQuery, useWatchLessonMutation } from "@/entities/Academy/api/courseApi";
import { MiniLoader } from "@/shared/ui/MiniLoader/MiniLoader";
import { LessonVideo } from "../LessonVideo/LessonVideo";
import { LessonReview } from "@/features/Academy";
import CustomLink from "@/shared/ui/Link/Link";
import { getMediaContent } from "@/shared/lib/getMediaContent";
import styles from "./LessonPersonal.module.scss";

interface LessonPersonalProps {
    lessonId: string;
}

export const LessonPersonal: FC<LessonPersonalProps> = (props) => {
    const { lessonId } = props;
    const { locale } = useLocale();
    const { data, isLoading } = useGetCourseLessonByIdQuery(lessonId);
    const [watchLesson] = useWatchLessonMutation();

    const prevLessonId = data?.prevVideoId ?? null;
    const nextLessonId = data?.nextVideoId ?? null;

    useEffect(() => {
        watchLesson(lessonId);
    }, [lessonId, watchLesson]);

    return (
        <div className={styles.wrapper}>
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
                        {data?.files && data.files.length > 0 && (
                            <div className={styles.filesSection}>
                                <h3 className={styles.filesTitle}>Материалы к уроку</h3>
                                <ul className={styles.filesList}>
                                    {data.files.map((file) => {
                                        const url = getMediaContent(file.contentUrl);
                                        const fileName = file.contentUrl.split("/").pop() || "Файл";
                                        return url ? (
                                            <li key={file.id} className={styles.filesItem}>
                                                <a
                                                    href={url}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    download
                                                    className={styles.filesLink}
                                                >
                                                    {"📎 "}
                                                    {fileName}
                                                </a>
                                            </li>
                                        ) : null;
                                    })}
                                </ul>
                            </div>
                        )}
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
