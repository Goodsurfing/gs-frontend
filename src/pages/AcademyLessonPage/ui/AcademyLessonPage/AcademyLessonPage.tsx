import React from "react";
import { MainPageLayout } from "@/widgets/MainPageLayout";
import { useLocale } from "@/app/providers/LocaleProvider";
import { Navigation } from "@/features/Article";
import { getAcademyCoursePageUrl, getAcademyMainPageUrl } from "@/shared/config/routes/AppUrls";
import { CommentWidget } from "@/widgets/Article";
import { LessonPersonal } from "@/widgets/Academy";
import styles from "./AcademyLessonPage.module.scss";

const AcademyLessonPage = () => {
    const { locale } = useLocale();
    return (
        <MainPageLayout>
            <div className={styles.wrapper}>
                <Navigation
                    breadcrumbs={[
                        { name: "Курсы", link: getAcademyMainPageUrl(locale) },
                        { name: "Волонтерский лагерь «онлайн»: как вести видео блог и управлять соцсетями", link: getAcademyCoursePageUrl(locale, "1") },
                        { name: "Волонтерский лагерь «онлайн». Часть 1. Зачем и как работать с соцсетями" },
                    ]}
                    className={styles.navigation}
                />
                <div className={styles.articleWrapper}>
                    <h1 className={styles.title}>
                        Волонтерский лагерь «онлайн».
                        Часть 1. Зачем и как работать с соцсетями
                    </h1>
                    <p className={styles.description}>
                        В первой части курса мы поговорим о том, зачем работать в формате соцсетей,
                        как правильно «упаковать» контент и выбрать площадку,
                        а также о частоте выхода постов.
                    </p>
                    <LessonPersonal className={styles.lessonPersonal} />
                </div>
                <div className={styles.commentWrapper}>
                    <CommentWidget />
                </div>
            </div>
        </MainPageLayout>
    );
};

export default AcademyLessonPage;
