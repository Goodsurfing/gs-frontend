import React, { FC } from "react";
import { useTranslation } from "react-i18next";

import { useLocale } from "@/app/providers/LocaleProvider";
import { useGetCourseByIdQuery } from "@/entities/Academy";
import { MainPageLayout } from "@/widgets/MainPageLayout";
import { getAcademyCoursePageUrl } from "@/shared/config/routes/AppUrls";
import { getMediaContent } from "@/shared/lib/getMediaContent";
import { getSeoDescription, getSeoUrl } from "@/shared/lib/getSeoUrl";
import Preloader from "@/shared/ui/Preloader/Preloader";
import { SeoHelmet } from "@/shared/ui/SeoHelmet";
import styles from "./CoursePersonal.module.scss";
import { CourseContent } from "../CourseContent/CourseContent";
import { Header } from "../Header/Header";

interface CoursePersonalProps {
    courseId: string;
}

export const CoursePersonal: FC<CoursePersonalProps> = (props) => {
    const { courseId } = props;
    const { locale } = useLocale();
    const { t, ready } = useTranslation("academy");
    const { data, isLoading } = useGetCourseByIdQuery(courseId);

    if (isLoading) {
        return (
            <Preloader />
        );
    }

    if (!data) {
        return (
            <MainPageLayout headerVariant="static">
                <div className={styles.wrapper}>
                    <p>Курс не был найден</p>
                </div>
            </MainPageLayout>
        );
    }

    const seoTitle = data.name || t("seo.course.title");
    const seoDescription = data.description
        ? getSeoDescription(data.description) || t("seo.course.description")
        : t("seo.course.description");
    const seoUrl = getSeoUrl(getAcademyCoursePageUrl(locale, courseId));
    const seoImage = getMediaContent(data.image?.contentUrl);
    const seoKeywords = [
        data.name,
        data.author?.firsName,
        data.author?.lastName,
        t("seo.course.keywords"),
    ].filter(Boolean).join(", ");

    return (
        <MainPageLayout headerVariant="static">
            {ready && (
                <SeoHelmet
                    title={seoTitle}
                    description={seoDescription}
                    canonicalUrl={seoUrl}
                    keywords={seoKeywords}
                    ogImage={seoImage}
                />
            )}
            <div className={styles.wrapper}>
                <Header course={data} />
                <CourseContent course={data} courseId={courseId} />
            </div>
        </MainPageLayout>
    );
};
