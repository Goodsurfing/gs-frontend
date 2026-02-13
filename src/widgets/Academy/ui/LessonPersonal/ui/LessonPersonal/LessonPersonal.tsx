import React, { FC, useEffect } from "react";
import { Navigation } from "@/features/Article";
import { getAcademyCoursePageUrl, getAcademyMainPageUrl } from "@/shared/config/routes/AppUrls";
import { useLocale } from "@/app/providers/LocaleProvider";
import { useGetCourseLessonByIdQuery, useWatchLessonMutation } from "@/entities/Academy/api/courseApi";
import { MiniLoader } from "@/shared/ui/MiniLoader/MiniLoader";
import { LessonVideo } from "../LessonVideo/LessonVideo";
import { LessonReview } from "@/features/Academy";
import styles from "./LessonPersonal.module.scss";

interface LessonPersonalProps {
    lessonId: string;
}

export const LessonPersonal: FC<LessonPersonalProps> = (props) => {
    const { lessonId } = props;
    const { locale } = useLocale();
    const { data, isLoading } = useGetCourseLessonByIdQuery(lessonId);
    const [watchLesson] = useWatchLessonMutation();

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
                    </>
                )}
            </div>
            <div className={styles.commentWrapper}>
                <LessonReview lessonId={lessonId} locale={locale} canReview={data?.isCanReview} />
            </div>
        </div>
    );
};
