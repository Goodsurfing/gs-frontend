import cn from "classnames";
import React, { useCallback, useState } from "react";
import { DefaultValues, FormProvider, useForm } from "react-hook-form";

import { OffersList, OffersMap } from "@/widgets/OffersMap";

import { OffersFilterFields, OffersSortFields } from "../../model/types";
import styles from "./OffersSearchFilter.module.scss";
import { OffersFilter } from "../OffersFilter/OffersFilter";
import useWindowDimensions from "@/shared/hooks/useWindowDimensions";

export const OffersSearchFilter = () => {
    const defaultSortValues: DefaultValues<OffersSortFields> = {
        showClosedOffers: false,
        sortValue: "novelty",
    };
    const defaultFilterValues: DefaultValues<OffersFilterFields> = {
        category: [],
        languages: [],
        participationPeriod: [7, 186],
        periods: { start: undefined, end: undefined },
        withChildren: false,
        provided: [],
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
    const { width } = useWindowDimensions();

    const handleMapOpen = useCallback(() => {
        setMapOpened((prev) => !prev);
    }, []);

    return (
        <div className={styles.wrapper}>
            <FormProvider {...offerFilterForm}>
                <OffersFilter />
            </FormProvider>
            <div className={styles.wrapperOffersMap}>
                <FormProvider {...offerSortForm}>
                    <OffersList
                        onChangeMapOpen={handleMapOpen}
                        mapOpenValue={isMapOpened}
                        className={cn(styles.offersList, {
                            [styles.closed]: !isMapOpened,
                        })}
                    />
                </FormProvider>

                {(isMapOpened && width > 992) && (
                    <OffersMap
                        className={styles.offersMap}
                        classNameMap={styles.offersMap}
                    />
                )}
            </div>
        </div>
    );
};
