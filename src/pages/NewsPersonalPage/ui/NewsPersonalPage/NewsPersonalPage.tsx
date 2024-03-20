import React from "react";

import { useLocale } from "@/app/providers/LocaleProvider";

import { MainPageLayout } from "@/widgets/MainPageLayout";

import {
    ArticleContent, ArticleHeader, ArticleShare, Navigation,
} from "@/features/Article";

import defaultImage from "@/shared/assets/images/personalCardMOCK.png";
import { getNewsPageUrl } from "@/shared/config/routes/AppUrls";

import styles from "./NewsPersonalPage.module.scss";
import { ShareBlock } from "@/shared/ui/ShareBlock/ShareBlock";

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
                <ArticleHeader
                    className={styles.articleHeader}
                    title="Тестовая статья"
                    authorAvatar={defaultImage}
                    authorName="Алексей Петров"
                    category="Категория"
                    date="17 мая 2017"
                />
                <ArticleContent className={styles.content} content="" />
                <ArticleShare className={styles.shareBlock} />
            </div>
        </MainPageLayout>
    );
};

export default NewsPersonalPage;
