import cn from "classnames";
import React, { useCallback, useState } from "react";
import { DefaultValues, FormProvider, useForm } from "react-hook-form";

import { OffersList, OffersMap } from "@/widgets/OffersMap";

import { OffersFilterFields } from "../../model/types";
import { OffersFilter } from "../OffersFilter/OffersFilter";
import styles from "./OffersSearchFilter.module.scss";
import { OffersSearchFilterMobile } from "../OffersSearchFilterMobile/OffersSearchFilterMobile";

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

    const offerFilterForm = useForm<OffersFilterFields>({
        mode: "onChange",
        defaultValues: defaultFilterValues,
    });

    const [isMapOpened, setMapOpened] = useState<boolean>(true);

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
                <FormProvider {...offerFilterForm}>
                    <OffersSearchFilterMobile className={styles.mobile} />
                </FormProvider>
            </div>
        </FormProvider>
    );
};
