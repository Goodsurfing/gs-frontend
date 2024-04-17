import cn from "classnames";
import React, { useCallback, useState } from "react";
import { DefaultValues, FormProvider, useForm } from "react-hook-form";

import { OffersList, OffersMap } from "@/widgets/OffersMap";

import { OffersFilterFields, OffersSortFields } from "../../model/types";
import styles from "./OffersSearchFilter.module.scss";
import { OffersFilter } from "../OffersFilter/OffersFilter";

export const OffersSearchFilter = () => {
    const defaultSortValues: DefaultValues<OffersSortFields> = {
        showClosedOffers: false,
        sortValue: "novelty",
    };
    const defaultFilterValues: DefaultValues<OffersFilterFields> = {
        category: [],
        languages: [],
        participationPeriod: { from: 7, to: 186 },
        periods: { from: null, to: null },
    };

    const offerSortForm = useForm<OffersSortFields>({
        mode: "onChange",
        defaultValues: defaultSortValues,
    });

    const offerFilterForm = useForm<OffersFilterFields>({
        mode: "onChange",
        defaultValues: defaultFilterValues,
    });

    const [isMapOpened, setMapOpened] = useState<boolean>(true);

    const handleMapOpen = useCallback(() => {
        setMapOpened((prev) => !prev);
    }, []);

    return (
        <div className={styles.wrapperOffersMap}>
            <FormProvider {...offerFilterForm}>
                <OffersFilter />
            </FormProvider>
            <FormProvider {...offerSortForm}>
                <OffersList
                    onChangeMapOpen={handleMapOpen}
                    mapOpenValue={isMapOpened}
                    className={cn(styles.offersList, {
                        [styles.closed]: !isMapOpened,
                    })}
                />
            </FormProvider>

            {isMapOpened && (
                <OffersMap
                    className={styles.offersMap}
                    classNameMap={styles.offersMap}
                />
            )}
        </div>
    );
};
