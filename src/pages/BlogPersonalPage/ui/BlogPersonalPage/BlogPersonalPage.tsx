import React from "react";

import { useLocale } from "@/app/providers/LocaleProvider";

import { CommentWidget } from "@/widgets/Article";
import { MainPageLayout } from "@/widgets/MainPageLayout";

import {
    ArticleContent,
    ArticleHeader,
    ArticleShare,
    Navigation,
} from "@/features/Article";

import defaultImage from "@/shared/assets/images/personalCardMOCK.png";
import { getBlogPageUrl } from "@/shared/config/routes/AppUrls";

import styles from "./BlogPersonalPage.module.scss";

const BlogPersonalPage = () => {
    const { locale } = useLocale();
    return (
        <MainPageLayout>
            <div className={styles.wrapper}>
                <Navigation
                    breadcrumbs={[
                        { name: "Блог", link: getBlogPageUrl(locale) },
                        { name: "Тестовая статья" },
                    ]}
                    className={styles.navigation}
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
                    <ArticleContent
                        className={styles.content}
                        content="<span>Привет</span>"
                    />
                    <ArticleShare className={styles.shareBlock} />
                </div>
                <div className={styles.commentWrapper}>
                    <CommentWidget />
                </div>
            </div>
        </MainPageLayout>
    );
};

export default BlogPersonalPage;
