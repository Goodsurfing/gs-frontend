import React, { useEffect } from "react";

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
import { useNewsFilters } from "@/shared/hooks/usePaginationParams";
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
    const {
        page, sort, category, search,
        setPage, setSort, setCategory, setSearch,
    } = useNewsFilters();

    const [getBlogList, { data, isLoading, isFetching }] = useLazyGetBlogListQuery();

    useEffect(() => {
        getBlogList({
            page,
            limit,
            sort: getSortByFilter(sort),
            lang: locale,
            name: search,
            blogCategoryId: category,
        });
    }, [page, locale, getBlogList, sort, search, category]);

    const totalPages = data?.pagination
        ? Math.ceil(data.pagination.total / data.pagination.limit)
        : 1;

    return (
        <MainPageLayout>
            <Header />
            <div className={styles.container}>
                <div className={styles.top}>
                    <ArticleFilter
                        className={styles.articleFilter}
                        value={sort}
                        onChange={setSort}
                    />
                    <SearchInput
                        className={styles.search}
                        value={search}
                        onChange={(value) => { setSearch(value); }}
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
                                    onPageChange={setPage}
                                />
                            </div>
                        )}

                    <div className={styles.contentRight}>
                        <Category
                            className={styles.category}
                            locale={locale}
                            value={category}
                            onChange={setCategory}
                        />
                        <MemberBanner className={styles.memberBanner} />
                    </div>
                </div>
            </div>
        </MainPageLayout>
    );
};

export default BlogPage;
