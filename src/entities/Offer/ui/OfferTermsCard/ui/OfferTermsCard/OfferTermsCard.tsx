import React, { FC, memo } from "react";

import { goodsItems } from "@/features/OfferConditions/model/data/conditionItems";
import { GoodsItems } from "@/features/OfferConditions/model/types/conditionsData";

import { Facilities } from "@/entities/Offer/model/types/offerConditions";

import { FacilityCard } from "../FacilityCard/FacilityCard";
import styles from "./OfferTermsCard.module.scss";

export const OfferTermsCard: FC = memo((props) => {
    const {} = props;

    // data for test
    const mockedFacilities: Facilities[] = ["wi-fi", "bath"];

    const renderTerms = (
        facilitiesData: GoodsItems[],
        facilities: Facilities[],
    ) => {
        const resultItems = facilitiesData.filter((item) => facilities.includes(item.id));

        return resultItems.map((item) => <FacilityCard facility={item} />);
    };

    return (
        <div className={styles.wrapper}>
            <h3 className={styles.title}>Условия</h3>
            <div className={styles.container}>
                {renderTerms(goodsItems, mockedFacilities)}
            </div>
        </div>
    );
});
