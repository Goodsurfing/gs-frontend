import React, { useState, useEffect } from "react";

import { MainPageLayout } from "@/widgets/MainPageLayout";

import { MemberBanner } from "@/features/MemberBanner";

import { SearchInput } from "@/shared/ui/SearchInput/SearchInput";

import { ArticleFilter } from "../ArticleFilter/ArticleFilter";
import { Category } from "../Category/Category";
import { Header } from "../Header/Header";
import { NewsList } from "../NewsList/NewsList";
import { TagsOption } from "@/features/Article";
import styles from "./NewsPage.module.scss";
import { useLazyGetNewsListQuery } from "@/entities/News";
import { MiniLoader } from "@/shared/ui/MiniLoader/MiniLoader";
import { OfferPagination } from "@/widgets/OffersMap";
import { useLocale } from "@/app/providers/LocaleProvider";
import { AdminSort } from "@/entities/Admin";

const limit = 10;

const getSortByFilter = (filter: TagsOption): AdminSort => {
    switch (filter) {
        case "popular":
            return AdminSort.LikeNewsDesc;
        case "new":
        default:
            return AdminSort.CreatedDesc;
    }
};

const NewsPage = () => {
    const { locale } = useLocale();
    const [filterValue, setFilterValue] = useState<TagsOption>("new");
    const [searchValue, setSearchValue] = useState<string>("");
    const [categoryValue, setCategoryValue] = useState<number | undefined>();
    const [page, setPage] = useState(1);

    const [getNews, { data, isLoading, isFetching }] = useLazyGetNewsListQuery();

    useEffect(() => {
        getNews({
            page,
            limit,
            sort: getSortByFilter(filterValue),
            lang: locale,
            name: searchValue,
            categoryId: categoryValue,
        });
    }, [page, filterValue, searchValue, locale, categoryValue, getNews]);

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
                    <ArticleFilter value={filterValue} onChange={setFilterValue} />
                    <SearchInput
                        sx={{ maxWidth: "370px" }}
                        value={searchValue}
                        onChange={(value) => { setSearchValue(value); }}
                    />
                </div>
                <div className={styles.content}>
                    {(isLoading || isFetching) ? <MiniLoader /> : (
                        <div className={styles.newsListWrapper}>
                            <NewsList
                                className={styles.newsList}
                                data={data?.data}
                            />
                            <OfferPagination
                                currentPage={page}
                                totalPages={totalPages}
                                onPageChange={handlePageChange}
                            />
                        </div>
                    )}
                    <div
                        className={styles.contentRight}
                    >
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

export default NewsPage;
