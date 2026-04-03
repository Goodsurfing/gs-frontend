import React, { useEffect } from "react";

import { MainPageLayout } from "@/widgets/MainPageLayout";

import { useLocale } from "@/app/providers/LocaleProvider";
import { TagsOption } from "@/features/Article";
import { AdminSort } from "@/entities/Admin";
import { journalCardAdapter, useLazyGetJournalListQuery } from "@/entities/Journal";
import { MiniLoader } from "@/shared/ui/MiniLoader/MiniLoader";
import { OfferPagination } from "@/widgets/OffersMap";
import { useNewsFilters } from "@/shared/hooks/usePaginationParams";
import { JournalsList } from "../JournalsList/JournalsList";
import { JournalFilter } from "../JournalFilter/JournalFilter";
import { Header } from "../Header/Header";
import styles from "./JournalsPage.module.scss";

const limit = 9;

const getSortByFilter = (filter: TagsOption): AdminSort => {
    switch (filter) {
    case "popular":
        return AdminSort.LikeNewsDesc;
    case "new":
    default:
        return AdminSort.CreatedDesc;
    }
};

const JournalsPage = () => {
    const { locale } = useLocale();
    const {
        page, sort, setPage, setSort,
    } = useNewsFilters();

    const [getNews, { data, isLoading, isFetching }] = useLazyGetJournalListQuery();

    useEffect(() => {
        getNews({
            page,
            limit,
            sort: getSortByFilter(sort),
        });
    }, [page, sort, locale, getNews]);

    const totalPages = data?.pagination
        ? Math.ceil(data.pagination.total / data.pagination.limit)
        : 1;

    return (
        <MainPageLayout>
            <Header />
            <div className={styles.container}>
                <div className={styles.top}>
                    <JournalFilter value={sort} onChange={setSort} />
                </div>
                <div className={styles.content}>
                    {(isLoading || isFetching) ? <MiniLoader /> : (
                        <div className={styles.journalListWrapper}>
                            <JournalsList
                                className={styles.journalsList}
                                data={journalCardAdapter(data?.data ?? [])}
                            />
                            <OfferPagination
                                currentPage={page}
                                totalPages={totalPages}
                                onPageChange={setPage}
                            />
                        </div>
                    )}
                </div>
            </div>
        </MainPageLayout>
    );
};

export default JournalsPage;
