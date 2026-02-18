import React from "react";

import { MainPageLayout } from "@/widgets/MainPageLayout";

import { MemberBanner } from "@/features/MemberBanner";

import { SearchInput } from "@/shared/ui/SearchInput/SearchInput";

import { ArticleFilter } from "../ArticleFilter/ArticleFilter";
import { ArticlesList } from "../ArticlesList/ArticlesList";
import { Category } from "../Category/Category";
import { Header } from "../Header/Header";
import styles from "./BlogPage.module.scss";
import { useLocale } from "@/app/providers/LocaleProvider";

const BlogPage = () => {
    const { locale } = useLocale();
    return (
        <MainPageLayout>
            <Header />
            <div className={styles.container}>
                <div className={styles.top}>
                    <ArticleFilter className={styles.articleFilter} />
                    <SearchInput className={styles.search} value="" onChange={() => {}} />
                </div>
                <div className={styles.content}>
                    <ArticlesList
                        className={styles.articlesList}
                        data={[]}
                    />
                    <div className={styles.contentRight}>
                        <Category className={styles.category} locale={locale} />
                        <MemberBanner className={styles.memberBanner} />
                    </div>
                </div>
            </div>
        </MainPageLayout>
    );
};

export default BlogPage;
