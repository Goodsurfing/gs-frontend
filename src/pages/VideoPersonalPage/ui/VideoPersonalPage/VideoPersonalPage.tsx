import React from "react";

import { useLocale } from "@/app/providers/LocaleProvider";

import { CommentWidget } from "@/widgets/Article";
import { MainPageLayout } from "@/widgets/MainPageLayout";

import {
    ArticleHeader,
    ArticleShare,
    Navigation,
} from "@/features/Article";

import defaultImage from "@/shared/assets/images/personalCardMOCK.png";
import { getVideoPageUrl } from "@/shared/config/routes/AppUrls";

import { VideoContent } from "../VideoContent/VideoContent";
import styles from "./VideoPersonalPage.module.scss";

const VideoPersonalPage = () => {
    const { locale } = useLocale();
    return (
        <MainPageLayout>
            <div className={styles.wrapper}>
                <Navigation
                    breadcrumbs={[
                        { name: "Видео", link: getVideoPageUrl(locale) },
                        { name: "Япония, которая взрывает мозг. Большой выпуск" },
                    ]}
                    className={styles.navigation}
                />
                <div className={styles.articleWrapper}>
                    <ArticleHeader
                        className={styles.articleHeader}
                        title="Япония, которая взрывает мозг. Большой выпуск"
                        authorAvatar={defaultImage}
                        authorName="Алексей Петров"
                        category="Категория"
                        date="17 мая 2017"
                    />
                    <VideoContent className={styles.content} url="https://www.youtube.com/watch?v=Gb0TQ7VeApY" />
                    <ArticleShare className={styles.shareBlock} />
                </div>
                <div className={styles.commentWrapper}>
                    <CommentWidget />
                </div>
            </div>
        </MainPageLayout>
    );
};

export default VideoPersonalPage;
