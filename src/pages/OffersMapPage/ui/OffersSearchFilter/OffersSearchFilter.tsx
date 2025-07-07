/* eslint-disable react-hooks/exhaustive-deps */
import cn from "classnames";
import React, { useCallback, useEffect, useState } from "react";
import { DefaultValues, FormProvider, useForm } from "react-hook-form";

import { useSearchParams } from "react-router-dom";
import { OffersList, OffersMap } from "@/widgets/OffersMap";

import { OffersFilterFields } from "../../model/types";
import { OffersFilter } from "../OffersFilter/OffersFilter";
import { OffersSearchFilterMobile } from "../OffersSearchFilterMobile/OffersSearchFilterMobile";
import { CategoryType, categoryValues } from "@/types/categories";
import styles from "./OffersSearchFilter.module.scss";
import { useLazyGetOffersQuery } from "@/entities/Offer";
import { offersFilterApiAdapter } from "../../lib/offersFilterAdapter";

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
    search: "",
};

const defaultFilterValues: DefaultValues<OffersFilterFields> = defaultValues;

export const OffersSearchFilter = () => {
    const [isMapOpened, setMapOpened] = useState<boolean>(true);
    const [searchParams, setSearchParams] = useSearchParams();
    const [fetchOffers, { data: offersData, isLoading }] = useLazyGetOffersQuery();

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
    }, [fetchOffers]);

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

    const onApplyFilters = handleSubmit((data: OffersFilterFields) => {
        const preparedData = offersFilterApiAdapter(data);
        fetchOffers(preparedData);
    });

    const onResetFilters = async () => {
        reset(defaultFilterValues);
        setSearchParams(new URLSearchParams());
        const preparedData = offersFilterApiAdapter(defaultValues);
        await fetchOffers(preparedData);
    };

    const handleMapOpen = useCallback(() => {
        setMapOpened((prev) => !prev);
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
                    <OffersList
                        data={offersData}
                        onSubmit={onApplyFilters}
                        isLoading={isLoading}
                        onChangeMapOpen={handleMapOpen}
                        mapOpenValue={isMapOpened}
                        className={cn(styles.offersList, {
                            [styles.closed]: !isMapOpened,
                        })}
                    />
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
                    isLoading={isLoading}
                    className={styles.mobile}
                    onSubmit={onApplyFilters}
                    onResetFilters={onResetFilters}
                />
            </div>
        </FormProvider>
    );
};
