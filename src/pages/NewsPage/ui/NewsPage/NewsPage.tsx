import React from "react";
import { MainPageLayout } from "@/widgets/MainPageLayout";
import { Header } from "../Header/Header";
import { ArticleFilter } from "../ArticleFilter/ArticleFilter";
import { SearchInput } from "@/features/Article";
import { NewsList } from "../NewsList/NewsList";
import { mockedArticlesData } from "@/entities/Article/model/data/mockedArticleData";
import { Category } from "../Category/Category";
import { MemberBanner } from "@/features/MemberBanner";
import styles from "./NewsPage.module.scss";

const NewsPage = () => (
    <MainPageLayout>
        <Header />
        <div className={styles.container}>
            <div className={styles.top}>
                <ArticleFilter />
                <SearchInput sx={{ maxWidth: "370px" }} />
            </div>
            <div className={styles.content}>
                <NewsList className={styles.newsList} data={mockedArticlesData} />
                <div style={{ display: "flex", flexDirection: "column", gap: "30px" }}>
                    <Category className={styles.category} />
                    <MemberBanner />
                </div>
            </div>
        </div>
    </MainPageLayout>
);

export default NewsPage;
