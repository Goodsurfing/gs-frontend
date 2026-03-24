/* eslint-disable react-hooks/exhaustive-deps */
import cn from "classnames";
import React, {
    useCallback, useEffect, useRef, useState,
} from "react";
import { DefaultValues, FormProvider, useForm } from "react-hook-form";

import { useSearchParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { DonationsFilter } from "../DonationsFilter/DonationsFilter";
import {
    donationFilterApiAdapter, DonationFilterFields, donationMapFilterApiAdapter,
    useLazyGetDonationsMapQuery, useLazyGetDonationsQuery,
} from "@/entities/Donation";
import { AdminSort } from "@/entities/Admin";
import {
    DonationsList, DonationsMap, SearchDonations, SearchDonationsRef,
} from "@/widgets/Donation";
import { DonationsSearchFilterMobile } from "../DonationsSearchFilterMobile/DonationsSearchFilterMobile";
import styles from "./DonationSearchFilter.module.scss";

const defaultValues: DonationFilterFields = {
    sort: "urgency",
    showFinishedProjects: false,
    showSuccessProjects: false,
};

const defaultFilterValues: DefaultValues<DonationFilterFields> = defaultValues;

const PER_PAGE = 20;

export const DonationSearchFilter = () => {
    const [isMapOpened, setMapOpened] = useState<boolean>(true);
    const [searchParams, setSearchParams] = useSearchParams();
    const [fetchDonations, {
        data: donationsData,
        isLoading, isFetching,
    }] = useLazyGetDonationsQuery();
    const [fetchAllDonationsMap,
        {
            data: allDonationsMap = [], isLoading: isAllDonationsMapLoading,
            isFetching: isAllDonationsMapFetching,
        }] = useLazyGetDonationsMapQuery();
    const debounceTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    const { t } = useTranslation("donation");
    const searchRef = useRef<SearchDonationsRef>(null);

    const [currentPage, setCurrentPage] = useState<number>(1);
    const [initialSearchValue, setInitialSearchValue] = useState<string>();

    const initialCategories = ((searchParams.get("category") ?? "")
        .split(",")
        .map((str) => str.trim())
        .map(Number)
        .filter((id) => !Number.isNaN(id) && id > 0)?.[0]) ?? 0;

    const donationFilterForm = useForm<DonationFilterFields>({
        mode: "onChange",
        defaultValues: {
            ...defaultFilterValues,
            category: initialCategories,
        },
    });

    const {
        watch, setValue, reset, handleSubmit,
    } = donationFilterForm;

    const [isSyncing, setIsSyncing] = useState(false);

    useEffect(() => {
        const watchData = watch();
        const preparedData = donationFilterApiAdapter(watchData);
        fetchDonations({ ...preparedData, limit: PER_PAGE, page: currentPage });
    }, [currentPage]);

    useEffect(() => {
        const watchData = watch();
        const preparedData = donationMapFilterApiAdapter(watchData);
        fetchAllDonationsMap({ ...preparedData });
    }, []);

    useEffect(() => {
        const subscription = watch((value, { name }) => {
            if (!isSyncing && name === "category") {
                const newCategory = value.category ? String(value.category) : "";
                setSearchParams((prev) => {
                    const updated = new URLSearchParams(prev);
                    if (newCategory) {
                        updated.set("category", newCategory);
                    } else {
                        updated.delete("category");
                    }
                    return updated;
                });
            }
        });
        return () => subscription.unsubscribe();
    }, [watch, setSearchParams, isSyncing]);

    useEffect(() => {
        setIsSyncing(true);

        const categoryFromURL = searchParams.get("category") ?? "";
        const num = Number(categoryFromURL.trim());
        const parsedCategory = !Number.isNaN(num) && num > 0 ? num : 0;

        setValue("category", parsedCategory);
        setIsSyncing(false);
    }, [searchParams, setValue]);

    const onChangePage = useCallback((pageItem: number) => {
        setCurrentPage(pageItem);
    }, []);

    const onApplySearch = useCallback(async (search: string) => {
        setSearchParams(new URLSearchParams());
        fetchDonations({
            sort: AdminSort.EndDateDesc, name: search, limit: PER_PAGE, page: 1,
        });
        fetchAllDonationsMap({ name: search });
        reset(defaultValues);
        onChangePage(1);
    }, []);

    useEffect(() => {
        const searchParam = searchParams.get("search");
        if (searchParam) {
            onApplySearch(searchParam);
            setInitialSearchValue(searchParam);
        }
    }, [searchParams, onApplySearch]);

    const onApplyFilters = useCallback(handleSubmit(async (data: DonationFilterFields) => {
        const preparedData = donationFilterApiAdapter(data);
        fetchDonations({ ...preparedData, limit: PER_PAGE, page: 1 });
        fetchAllDonationsMap({ ...preparedData });
        onChangePage(1);
    }), []);

    const onResetFilters = useCallback(async () => {
        setSearchParams(new URLSearchParams());
        searchRef.current?.clearSearch();
        const preparedData = donationFilterApiAdapter(defaultValues);
        fetchDonations({ ...preparedData, limit: PER_PAGE, page: 1 });
        fetchAllDonationsMap({ ...preparedData });
        reset(defaultValues);
        onChangePage(1);
    }, []);

    const handleMapOpen = useCallback(() => {
        setMapOpened((prev) => !prev);
    }, []);

    useEffect(() => {
        const subscription = watch((value, { name, type }) => {
            if ((name === "sort") && type === "change") {
                if (debounceTimeoutRef.current) {
                    clearTimeout(debounceTimeoutRef.current);
                }

                debounceTimeoutRef.current = setTimeout(() => {
                    const preparedData = donationFilterApiAdapter(value as DonationFilterFields);
                    fetchDonations({ ...preparedData, limit: PER_PAGE, page: currentPage });
                    fetchAllDonationsMap({ ...preparedData });
                }, 300);
            }
        });

        return () => {
            subscription.unsubscribe();
            if (debounceTimeoutRef.current) {
                clearTimeout(debounceTimeoutRef.current);
            }
        };
    }, []);

    return (
        <FormProvider {...donationFilterForm}>
            <div className={styles.wrapper}>
                <DonationsFilter
                    onSubmit={onApplyFilters}
                    onResetFilters={onResetFilters}
                    className={styles.filter}
                />
                <div className={styles.wrapperOffersMap}>
                    <div className={cn(styles.searchOffersList, {
                        [styles.closed]: !isMapOpened,
                    })}
                    >
                        <SearchDonations
                            className={styles.searchWrapper}
                            onSubmit={onApplySearch}
                            onResetFilters={onResetFilters}
                            placeholder={t("Поиск")}
                            buttonText={t("Посмотреть все")}
                            ref={searchRef}
                            initialValue={initialSearchValue}
                        />
                        <DonationsList
                            data={donationsData?.data}
                            className={cn(styles.offersList)}
                            isLoading={isLoading || isFetching}
                            onChangeMapOpen={handleMapOpen}
                            mapOpenValue={isMapOpened}
                            currentPage={currentPage}
                            donationsPerPage={PER_PAGE}
                            onChangePage={onChangePage}
                            total={donationsData?.pagination.total ?? 0}
                        />
                    </div>
                    {isMapOpened && (
                        <DonationsMap
                            donationsData={allDonationsMap}
                            isDonationsLoading={isAllDonationsMapLoading
                                || isAllDonationsMapFetching}
                            className={styles.offersMap}
                            classNameMap={styles.offersMap}
                        />
                    )}
                </div>
                <DonationsSearchFilterMobile
                    data={donationsData?.data}
                    allDonationsMapData={allDonationsMap}
                    isLoadingAllDonationsMap={isAllDonationsMapLoading || isAllDonationsMapFetching}
                    isLoading={isLoading || isFetching}
                    className={styles.mobile}
                    onApplySearch={onApplySearch}
                    onSubmit={onApplyFilters}
                    onResetFilters={onResetFilters}
                    currentPage={currentPage}
                    donationsPerPage={PER_PAGE}
                    total={donationsData?.pagination.total ?? 0}
                    onChangePage={onChangePage}
                />
            </div>
        </FormProvider>
    );
};
