import React, { useEffect, useState } from "react";

import { MainPageLayout } from "@/widgets/MainPageLayout";

import { MemberBanner } from "@/features/MemberBanner";

import { SearchInput } from "@/shared/ui/SearchInput/SearchInput";

import { ArticleFilter } from "../ArticleFilter/ArticleFilter";
import { ArticlesList } from "../ArticlesList/ArticlesList";
import { Category } from "../Category/Category";
import { Header } from "../Header/Header";
import { useLocale } from "@/app/providers/LocaleProvider";
import { AdminSort } from "@/entities/Admin";
import { TagsOption } from "@/features/Article";
import { blogArticleCardAdapter, useLazyGetBlogListQuery } from "@/entities/Blog";
import { OfferPagination } from "@/widgets/OffersMap";
import { MiniLoader } from "@/shared/ui/MiniLoader/MiniLoader";
import styles from "./BlogPage.module.scss";

const limit = 10;

const getSortByFilter = (filter: TagsOption): AdminSort => {
    switch (filter) {
        case "popular":
            return AdminSort.LikeBlogDesc;
        case "new":
        default:
            return AdminSort.CreatedDesc;
    }
};

const BlogPage = () => {
    const { locale } = useLocale();
    const [filterValue, setFilterValue] = useState<TagsOption>("new");
    const [searchValue, setSearchValue] = useState<string>("");
    const [categoryValue, setCategoryValue] = useState<number | undefined>();
    const [page, setPage] = useState(1);

    const [getBlogList, { data, isLoading, isFetching }] = useLazyGetBlogListQuery();

    useEffect(() => {
        getBlogList({
            page,
            limit,
            sort: getSortByFilter(filterValue),
            lang: locale,
            name: searchValue,
            blogCategoryId: categoryValue,
        });
    }, [page, filterValue, searchValue, locale, categoryValue, getBlogList]);

    const totalPages = data?.pagination
        ? Math.ceil(data.pagination.total / data.pagination.limit)
        : 1;

    const handlePageChange = (newPage: number) => {
        setPage(newPage);
    };

    return (
        <MainPageLayout>
            <Header />
            <div className={styles.container}>
                <div className={styles.top}>
                    <ArticleFilter
                        className={styles.articleFilter}
                        value={filterValue}
                        onChange={setFilterValue}
                    />
                    <SearchInput
                        className={styles.search}
                        value={searchValue}
                        onChange={(value) => { setSearchValue(value); }}
                    />
                </div>
                <div className={styles.content}>
                    {(isLoading || isFetching) ? (<MiniLoader className={styles.loader} />)
                        : (
                            <div className={styles.articleListWrapper}>
                                <ArticlesList
                                    className={styles.articlesList}
                                    data={blogArticleCardAdapter(data?.data || [])}
                                />
                                <OfferPagination
                                    currentPage={page}
                                    totalPages={totalPages}
                                    onPageChange={handlePageChange}
                                />
                            </div>
                        )}

                    <div className={styles.contentRight}>
                        <Category
                            className={styles.category}
                            locale={locale}
                            value={categoryValue}
                            onChange={setCategoryValue}
                        />
                        <MemberBanner className={styles.memberBanner} />
                    </div>
                </div>
            </div>
        </MainPageLayout>
    );
};

export default BlogPage;
