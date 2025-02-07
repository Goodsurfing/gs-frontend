import React from "react";

import { MainPageLayout } from "@/widgets/MainPageLayout";

import { MemberBanner } from "@/features/MemberBanner";

import { mockedArticlesData } from "@/entities/Article/model/data/mockedArticleData";

import { SearchInput } from "@/shared/ui/SearchInput/SearchInput";

import { ArticleFilter } from "../ArticleFilter/ArticleFilter";
import { Category } from "../Category/Category";
import { Header } from "../Header/Header";
import { NewsList } from "../NewsList/NewsList";
import styles from "./NewsPage.module.scss";

const NewsPage = () => (
    <MainPageLayout>
        <Header />
        <div className={styles.container}>
            <div className={styles.top}>
                <ArticleFilter />
                <SearchInput sx={{ maxWidth: "370px" }} value="" onChange={() => {}} />
            </div>
            <div className={styles.content}>
                <NewsList
                    className={styles.newsList}
                    data={mockedArticlesData}
                />
                <div
                    className={styles.contentRight}
                >
                    <Category className={styles.category} />
                    <MemberBanner className={styles.memberBanner} />
                </div>
            </div>
        </div>
    </MainPageLayout>
);

export default NewsPage;
