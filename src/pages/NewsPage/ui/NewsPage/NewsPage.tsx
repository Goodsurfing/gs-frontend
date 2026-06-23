import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";

import { useLocale } from "@/app/providers/LocaleProvider";
import { AdminSort } from "@/entities/Admin";
import { useLazyGetNewsListQuery } from "@/entities/News";
import { TagsOption } from "@/features/Article";
import { MainPageLayout } from "@/widgets/MainPageLayout";
import { OfferPagination } from "@/widgets/OffersMap";

import { MemberBanner } from "@/features/MemberBanner";

import { getNewsPageUrl } from "@/shared/config/routes/AppUrls";
import { useNewsFilters } from "@/shared/hooks/usePaginationParams";
import { getSeoUrl } from "@/shared/lib/getSeoUrl";
import { MiniLoader } from "@/shared/ui/MiniLoader/MiniLoader";
import { SearchInput } from "@/shared/ui/SearchInput/SearchInput";
import { SeoHelmet } from "@/shared/ui/SeoHelmet";

import { ArticleFilter } from "../ArticleFilter/ArticleFilter";
import { Category } from "../Category/Category";
import { Header } from "../Header/Header";
import { NewsList } from "../NewsList/NewsList";
import styles from "./NewsPage.module.scss";

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
    const { t, ready } = useTranslation("news");
    const {
        page, sort, search, category, setPage,
        setSort, setSearch, setCategory,
    } = useNewsFilters();

    const [getNews, { data, isLoading, isFetching }] = useLazyGetNewsListQuery();

    useEffect(() => {
        getNews({
            page,
            limit,
            sort: getSortByFilter(sort),
            lang: locale,
            name: search,
            categoryId: category,
        });
    }, [page, locale, getNews, sort, search, category]);

    const totalPages = data?.pagination
        ? Math.ceil(data.pagination.total / data.pagination.limit)
        : 1;

    const handlePageChange = (newPage: number) => {
        setPage(newPage);
    };

    return (
        <MainPageLayout headerVariant="static">
            {ready && (
                <SeoHelmet
                    title={t("seo.title")}
                    description={t("seo.description")}
                    canonicalUrl={getSeoUrl(getNewsPageUrl(locale))}
                    keywords={t("seo.keywords")}
                    ogTitle={t("seo.ogTitle")}
                    ogDescription={t("seo.ogDescription")}
                />
            )}
            <Header />
            <div className={styles.container}>
                <div className={styles.top}>
                    <ArticleFilter value={sort} onChange={setSort} />
                    <SearchInput
                        sx={{ maxWidth: "370px" }}
                        value={search}
                        onChange={(value) => { setSearch(value); }}
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

export default NewsPage;
