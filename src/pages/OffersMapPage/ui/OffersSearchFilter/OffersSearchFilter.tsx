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

export const OffersSearchFilter = () => {
    const defaultFilterValues: DefaultValues<OffersFilterFields> = {
        offersSort: {
            showClosedOffers: false,
            sortValue: "novelty",
        },
        category: [],
        languages: [],
        participationPeriod: [7, 186],
        periods: { start: undefined, end: undefined },
        withChildren: false,
        provided: [],
    };

    const [isMapOpened, setMapOpened] = useState<boolean>(true);
    const [searchParams, setSearchParams] = useSearchParams();

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

    const { watch, setValue } = offerFilterForm;

    const [isSyncing, setIsSyncing] = useState(false);

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

    const handleMapOpen = useCallback(() => {
        setMapOpened((prev) => !prev);
    }, []);

    return (
        <FormProvider {...offerFilterForm}>
            <div className={styles.wrapper}>
                <OffersFilter className={styles.filter} />
                <div className={styles.wrapperOffersMap}>
                    <OffersList
                        onChangeMapOpen={handleMapOpen}
                        mapOpenValue={isMapOpened}
                        className={cn(styles.offersList, {
                            [styles.closed]: !isMapOpened,
                        })}
                    />
                    {isMapOpened && (
                        <OffersMap
                            className={styles.offersMap}
                            classNameMap={styles.offersMap}
                        />
                    )}
                </div>
                <OffersSearchFilterMobile className={styles.mobile} />
            </div>
        </FormProvider>
    );
};
