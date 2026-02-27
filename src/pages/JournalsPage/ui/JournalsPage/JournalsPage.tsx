import React, { useEffect, useState } from "react";

import { MainPageLayout } from "@/widgets/MainPageLayout";

import { Header } from "../Header/Header";
import { JournalFilter } from "../JournalFilter/JournalFilter";
import { JournalsList } from "../JournalsList/JournalsList";
import { useLocale } from "@/app/providers/LocaleProvider";
import { TagsOption } from "@/features/Article";
import { AdminSort } from "@/entities/Admin";
import { journalCardAdapter, useLazyGetJournalListQuery } from "@/entities/Journal";
import { MiniLoader } from "@/shared/ui/MiniLoader/MiniLoader";
import { OfferPagination } from "@/widgets/OffersMap";
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
    const [filterValue, setFilterValue] = useState<TagsOption>("new");
    const [page, setPage] = useState(1);

    const [getNews, { data, isLoading, isFetching }] = useLazyGetJournalListQuery();

    useEffect(() => {
        getNews({
            page,
            limit,
            sort: getSortByFilter(filterValue),
        });
    }, [page, filterValue, locale, getNews]);

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
                    <JournalFilter value={filterValue} onChange={setFilterValue} />
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
                                onPageChange={handlePageChange}
                            />
                        </div>
                    )}
                </div>
            </div>
        </MainPageLayout>
    );
};

export default JournalsPage;
