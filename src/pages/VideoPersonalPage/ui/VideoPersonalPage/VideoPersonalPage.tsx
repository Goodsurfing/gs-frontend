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
                    mainLink={getVideoPageUrl(locale)}
                    nameMain="Видео"
                    nameArticle="Тестовая статья"
                />
                <div className={styles.articleWrapper}>
                    <ArticleHeader
                        className={styles.articleHeader}
                        title="Тестовая статья"
                        authorAvatar={defaultImage}
                        authorName="Алексей Петров"
                        category="Категория"
                        date="17 мая 2017"
                    />
                    <VideoContent className={styles.content} url="https://www.youtube.com/watch?v=ANzbvzojNjU" />
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
