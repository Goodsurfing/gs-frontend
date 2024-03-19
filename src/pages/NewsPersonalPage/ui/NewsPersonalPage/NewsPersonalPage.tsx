import React from "react";

import { useLocale } from "@/app/providers/LocaleProvider";

import { MainPageLayout } from "@/widgets/MainPageLayout";

import { ArticleHeader, Navigation } from "@/features/Article";

import defaultImage from "@/shared/assets/images/personalCardMOCK.png";
import { getNewsPageUrl } from "@/shared/config/routes/AppUrls";

import styles from "./NewsPersonalPage.module.scss";

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
                    title="Тестовая статья"
                    authorAvatar={defaultImage}
                    authorName="Алексей Петров"
                    category="Категория"
                    date="17 мая 2017"
                />
            </div>
        </MainPageLayout>
    );
};

export default NewsPersonalPage;
