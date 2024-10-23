import React from "react";

import { MainPageLayout } from "@/widgets/MainPageLayout";

import { MemberBanner } from "@/features/MemberBanner";

import { mockedArticlesData } from "@/entities/Article/model/data/mockedArticleData";

import { SearchInput } from "@/shared/ui/SearchInput/SearchInput";

import { ArticleFilter } from "../ArticleFilter/ArticleFilter";
import { ArticlesList } from "../ArticlesList/ArticlesList";
import { Category } from "../Category/Category";
import { Header } from "../Header/Header";
import styles from "./BlogPage.module.scss";

const BlogPage = () => (
    <MainPageLayout>
        <Header />
        <div className={styles.container}>
            <div className={styles.top}>
                <ArticleFilter className={styles.articleFilter} />
                <SearchInput className={styles.search} />
            </div>
            <div className={styles.content}>
                <ArticlesList
                    className={styles.articlesList}
                    data={mockedArticlesData}
                />
                <div className={styles.contentRight}>
                    <Category className={styles.category} />
                    <MemberBanner className={styles.memberBanner} />
                </div>
            </div>
        </div>
    </MainPageLayout>
);

export default BlogPage;
