/* eslint-disable react-hooks/exhaustive-deps */
import cn from "classnames";
import React, {
    useCallback, useEffect, useRef, useState,
} from "react";
import { DefaultValues, FormProvider, useForm } from "react-hook-form";

import { useSearchParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { OffersList, OffersMap } from "@/widgets/OffersMap";

import { OffersFilterFields } from "../../model/types";
import { OffersFilter } from "../OffersFilter/OffersFilter";
import { OffersSearchFilterMobile } from "../OffersSearchFilterMobile/OffersSearchFilterMobile";
import { OfferSort, useLazyGetAllOffersMapQuery, useLazyGetOffersQuery } from "@/entities/Offer";
import { getCategoryIdsFromUrlParam, getCategoryUrlParamFromIds } from "../../lib/categoryUrlParams";
import { offersFilterApiAdapter } from "../../lib/offersFilterAdapter";
import { SearchOffers, SearchOffersRef } from "@/widgets/OffersMap/ui/SearchOffers/SearchOffers";
import styles from "./OffersSearchFilter.module.scss";

const defaultValues: OffersFilterFields = {
    offersSort: {
        showClosedOffers: true,
        sortValue: "novelty",
    },
    category: [],
    languages: [],
    participationPeriod: [1, 190],
    periods: { start: undefined, end: undefined },
    withChildren: false,
    provided: [],
};

const defaultFilterValues: DefaultValues<OffersFilterFields> = defaultValues;

const OFFERS_PER_PAGE = 20;

export const OffersSearchFilter = () => {
    const [isMapOpened, setMapOpened] = useState<boolean>(true);
    const [searchParams, setSearchParams] = useSearchParams();
    const [fetchOffers, { data: offersData, isLoading, isFetching }] = useLazyGetOffersQuery();
    const [fetchAllOffersMap,
        {
            data: allOffersMap = [], isLoading: isAllOffersMapLoading,
            isFetching: isAllOffersMapFetching,
        }] = useLazyGetAllOffersMapQuery();
    const debounceTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    const { t } = useTranslation("offers-map");
    const searchRef = useRef<SearchOffersRef>(null);

    const [currentPage, setCurrentPage] = useState<number>(1);
    const [initialSearchValue, setInitialSearchValue] = useState<string>();

    const initialCategories = getCategoryIdsFromUrlParam(searchParams.get("category") ?? "");

    const offerFilterForm = useForm<OffersFilterFields>({
        mode: "onChange",
        defaultValues: {
            ...defaultFilterValues,
            category: initialCategories,
        },
    });

    const {
        watch, setValue, reset, handleSubmit,
    } = offerFilterForm;

    const isSyncingRef = useRef(false);
    const isInternalCategoryPushRef = useRef(false);
    const previousCategoryParamRef = useRef(searchParams.get("category"));
    const currentSearchRef = useRef<string>("");

    useEffect(() => {
        if (currentSearchRef.current) {
            fetchOffers({
                sort: OfferSort.UpdatedDesc,
                search: currentSearchRef.current,
                limit: OFFERS_PER_PAGE,
                page: currentPage,
            });
        } else {
            const watchData = watch();
            const preparedData = offersFilterApiAdapter(watchData);
            fetchOffers({ ...preparedData, limit: OFFERS_PER_PAGE, page: currentPage });
        }
    }, [currentPage]);

    useEffect(() => {
        const watchData = watch();
        const preparedData = offersFilterApiAdapter(watchData);
        fetchAllOffersMap({ ...preparedData });
    }, []);

    useEffect(() => {
        const subscription = watch((value, { name }) => {
            if (!isSyncingRef.current && name === "category") {
                const newCategory = getCategoryUrlParamFromIds(value.category);
                isInternalCategoryPushRef.current = true;
                setSearchParams((prev) => {
                    const updated = new URLSearchParams(prev);
                    if (newCategory) {
                        updated.set("category", newCategory);
                    } else {
                        updated.delete("category");
                    }
                    return updated;
                }, { replace: true });
            }
        });
        return () => subscription.unsubscribe();
    }, [watch, setSearchParams]);

    useEffect(() => {
        isSyncingRef.current = true;

        const categoryParam = searchParams.get("category");
        const parsedCategories = getCategoryIdsFromUrlParam(categoryParam ?? "");
        setValue("category", parsedCategories);

        const categoryParamChanged = categoryParam !== previousCategoryParamRef.current;
        previousCategoryParamRef.current = categoryParam;

        // A category change that we didn't push ourselves (e.g. the "Все вакансии"
        // nav link, a Back/Forward navigation, or a shared URL) means the visible
        // list needs to be re-applied immediately, same as clicking "Применить" —
        // otherwise the URL/form reset but the displayed results stay stale.
        const isExternalCategoryChange = categoryParamChanged
            && !isInternalCategoryPushRef.current
            && !currentSearchRef.current;

        if (isExternalCategoryChange) {
            const preparedData = offersFilterApiAdapter({ ...watch(), category: parsedCategories });
            fetchOffers({ ...preparedData, limit: OFFERS_PER_PAGE, page: 1 });
            fetchAllOffersMap({ ...preparedData });
            setCurrentPage(1);
        }
        isInternalCategoryPushRef.current = false;

        isSyncingRef.current = false;
    }, [searchParams, setValue]);

    const onChangePage = useCallback((pageItem: number) => {
        setCurrentPage(pageItem);
    }, []);

    const onApplySearch = useCallback(async (search: string) => {
        currentSearchRef.current = search;
        const params = new URLSearchParams();
        if (search) {
            params.set("search", search);
        }
        setSearchParams(params);
        fetchOffers({
            sort: OfferSort.UpdatedDesc, search, limit: OFFERS_PER_PAGE, page: 1,
        });
        fetchAllOffersMap({ search });
        reset(defaultValues);
        onChangePage(1);
    }, []);

    useEffect(() => {
        const searchParam = searchParams.get("search");
        if (searchParam) {
            onApplySearch(searchParam);
            setInitialSearchValue(searchParam);
        }
        // Only restore search from the URL on initial load — onApplySearch itself
        // keeps the URL in sync afterwards, so re-running this on every
        // searchParams change would re-trigger the same search and push
        // duplicate history entries.
    }, []);

    const onApplyFilters = useCallback(handleSubmit(async (data: OffersFilterFields) => {
        currentSearchRef.current = "";
        const preparedData = offersFilterApiAdapter(data);
        fetchOffers({ ...preparedData, limit: OFFERS_PER_PAGE, page: 1 });
        fetchAllOffersMap({ ...preparedData });
        onChangePage(1);
    }), []);

    const onResetFilters = useCallback(async () => {
        currentSearchRef.current = "";
        setSearchParams(new URLSearchParams());
        searchRef.current?.clearSearch();
        const preparedData = offersFilterApiAdapter(defaultValues);
        fetchOffers({ ...preparedData, limit: OFFERS_PER_PAGE, page: 1 });
        fetchAllOffersMap({ ...preparedData });
        reset(defaultValues);
        onChangePage(1);
    }, []);

    const handleMapOpen = useCallback(() => {
        setMapOpened((prev) => !prev);
    }, []);

    useEffect(() => {
        const subscription = watch((value, { name, type }) => {
            if ((name === "offersSort.showClosedOffers" || name === "offersSort.sortValue") && type === "change") {
                if (debounceTimeoutRef.current) {
                    clearTimeout(debounceTimeoutRef.current);
                }

                debounceTimeoutRef.current = setTimeout(() => {
                    const preparedData = offersFilterApiAdapter(value as OffersFilterFields);
                    if (currentSearchRef.current) {
                        fetchOffers({
                            ...preparedData,
                            search: currentSearchRef.current,
                            limit: OFFERS_PER_PAGE,
                            page: currentPage,
                        });
                        fetchAllOffersMap({ ...preparedData, search: currentSearchRef.current });
                    } else {
                        fetchOffers({ ...preparedData, limit: OFFERS_PER_PAGE, page: currentPage });
                        fetchAllOffersMap({ ...preparedData });
                    }
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
        <FormProvider {...offerFilterForm}>
            <div className={styles.wrapper}>
                <OffersFilter
                    onSubmit={onApplyFilters}
                    onResetFilters={onResetFilters}
                    className={styles.filter}
                />
                <div className={styles.wrapperOffersMap}>
                    <div className={cn(styles.searchOffersList, {
                        [styles.closed]: !isMapOpened,
                    })}
                    >
                        <SearchOffers
                            className={styles.searchWrapper}
                            onSubmit={onApplySearch}
                            onResetFilters={onResetFilters}
                            placeholder={t("Поиск")}
                            buttonText={t("Посмотреть все")}
                            ref={searchRef}
                            initialValue={initialSearchValue}
                        />
                        <OffersList
                            data={offersData?.data}
                            isLoading={isLoading || isFetching}
                            className={cn(styles.offersList)}
                            onChangeMapOpen={handleMapOpen}
                            mapOpenValue={isMapOpened}
                            currentPage={currentPage}
                            offersPerPage={OFFERS_PER_PAGE}
                            onChangePage={onChangePage}
                            total={offersData?.pagination.total ?? 0}
                        />
                    </div>
                    {isMapOpened && (
                        <OffersMap
                            offersData={allOffersMap}
                            isOffersLoading={isAllOffersMapLoading || isAllOffersMapFetching}
                            className={styles.offersMap}
                            classNameMap={styles.offersMap}
                        />
                    )}
                </div>
                <OffersSearchFilterMobile
                    data={offersData?.data}
                    allOffersMapData={allOffersMap}
                    isLoadingAllOffersMap={isAllOffersMapLoading || isAllOffersMapFetching}
                    isLoading={isLoading || isFetching}
                    className={styles.mobile}
                    onApplySearch={onApplySearch}
                    onSubmit={onApplyFilters}
                    onResetFilters={onResetFilters}
                    currentPage={currentPage}
                    offersPerPage={OFFERS_PER_PAGE}
                    total={offersData?.pagination.total ?? 0}
                    onChangePage={onChangePage}
                />
            </div>
        </FormProvider>
    );
};
