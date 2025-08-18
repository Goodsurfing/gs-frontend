/* eslint-disable react-hooks/exhaustive-deps */
import cn from "classnames";
import React, {
    useCallback, useEffect, useRef, useState,
    useTransition,
} from "react";
import { DefaultValues, FormProvider, useForm } from "react-hook-form";

import { useSearchParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { OffersList, OffersMap } from "@/widgets/OffersMap";

import { OffersFilterFields } from "../../model/types";
import { OffersFilter } from "../OffersFilter/OffersFilter";
import { OffersSearchFilterMobile } from "../OffersSearchFilterMobile/OffersSearchFilterMobile";
import { CategoryType, categoryValues } from "@/types/categories";
import styles from "./OffersSearchFilter.module.scss";
import { useLazyGetOffersQuery } from "@/entities/Offer";
import { offersFilterApiAdapter } from "../../lib/offersFilterAdapter";
import { SearchOffers, SearchOffersRef } from "@/widgets/OffersMap/ui/SearchOffers/SearchOffers";

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
    const debounceTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    const { t } = useTranslation("offers-map");
    const searchRef = useRef<SearchOffersRef>(null);

    const [isPending, startTransition] = useTransition();

    const [currentPage, setCurrentPage] = useState<number>(1);

    const initialCategories = searchParams.get("category")
        ?.split(",")
        .filter((cat) => categoryValues.includes(cat as CategoryType)) || [];

    const offerFilterForm = useForm<OffersFilterFields>({
        mode: "onChange",
        defaultValues: {
            ...defaultFilterValues,
            category: initialCategories as CategoryType[],
        },
    });

    const {
        watch, setValue, reset, handleSubmit,
    } = offerFilterForm;

    const [isSyncing, setIsSyncing] = useState(false);

    useEffect(() => {
        const watchData = watch();
        const preparedData = offersFilterApiAdapter(watchData);
        fetchOffers(preparedData);
    }, []);

    useEffect(() => {
        const subscription = watch((value, { name }) => {
            if (!isSyncing && name === "category") {
                const newCategory = (value.category || []).join(",");
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
        const categoriesFromURL = searchParams.get("category")
            ?.split(",")
            .filter((cat) => categoryValues.includes(cat as CategoryType)) || [];
        setValue("category", categoriesFromURL as CategoryType[]);
        setIsSyncing(false);
    }, [searchParams, setValue]);

    const onChangePage = useCallback((pageItem: number) => {
        setCurrentPage(pageItem);
    }, []);

    const onApplySearch = useCallback(async (search: string) => {
        setSearchParams(new URLSearchParams());
        await fetchOffers({ "order[updatedAt]": "desc", search });
        reset(defaultValues);
        onChangePage(1);
    }, []);

    const onApplyFilters = useCallback(handleSubmit(async (data: OffersFilterFields) => {
        const preparedData = offersFilterApiAdapter(data);
        await fetchOffers(preparedData);
        onChangePage(1);
    }), []);

    const onResetFilters = useCallback(async () => {
        setSearchParams(new URLSearchParams());
        searchRef.current?.clearSearch();
        const preparedData = offersFilterApiAdapter(defaultValues);
        await fetchOffers(preparedData);
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
                    fetchOffers(preparedData);
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
                        />
                        <OffersList
                            data={offersData}
                            isLoading={isLoading || isFetching}
                            className={cn(styles.offersList)}
                            onChangeMapOpen={handleMapOpen}
                            mapOpenValue={isMapOpened}
                            currentPage={currentPage}
                            offersPerPage={OFFERS_PER_PAGE}
                            onChangePage={onChangePage}
                        />
                    </div>
                    {isMapOpened && (
                        <OffersMap
                            offersData={offersData}
                            className={styles.offersMap}
                            classNameMap={styles.offersMap}
                        />
                    )}
                </div>
                <OffersSearchFilterMobile
                    data={offersData}
                    isLoading={isLoading || isFetching}
                    className={styles.mobile}
                    onApplySearch={onApplySearch}
                    onSubmit={onApplyFilters}
                    onResetFilters={onResetFilters}
                    currentPage={currentPage}
                    offersPerPage={OFFERS_PER_PAGE}
                    onChangePage={onChangePage}
                />
            </div>
        </FormProvider>
    );
};
