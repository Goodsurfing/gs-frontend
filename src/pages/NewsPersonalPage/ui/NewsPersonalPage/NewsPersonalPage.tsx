import React from "react";

import { useLocale } from "@/app/providers/LocaleProvider";

import { MainPageLayout } from "@/widgets/MainPageLayout";

import {
    ArticleContent, ArticleHeader, ArticleShare, Navigation,
} from "@/features/Article";

import defaultImage from "@/shared/assets/images/personalCardMOCK.png";
import { getNewsPageUrl } from "@/shared/config/routes/AppUrls";

import styles from "./NewsPersonalPage.module.scss";
import { CommentWidget } from "@/widgets/Article";

const NewsPersonalPage = () => {
    const { locale } = useLocale();
    return (
        <MainPageLayout>
            <div className={styles.wrapper}>
                <Navigation
                    mainLink={getNewsPageUrl(locale)}
                    nameMain="Новости"
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
                    <ArticleContent className={styles.content} content="<span>Привет</span>" />
                    <ArticleShare className={styles.shareBlock} />
                </div>
                <div className={styles.commentWrapper}>
                    <CommentWidget />
                </div>
            </div>
        </MainPageLayout>
    );
};

export default NewsPersonalPage;
