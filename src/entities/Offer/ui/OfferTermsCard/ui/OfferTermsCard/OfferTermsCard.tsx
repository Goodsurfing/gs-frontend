import cn from "classnames";
import React, { FC, memo } from "react";

import { goodsItems } from "@/features/OfferConditions/model/data/conditionItems";
import { GoodsItems } from "@/features/OfferConditions/model/types/conditionsData";

import { Facilities } from "@/entities/Offer/model/types/offerConditions";

import { FacilityCard } from "../FacilityCard/FacilityCard";
import styles from "./OfferTermsCard.module.scss";

interface OfferTermsCardProps {
    facilities: Facilities[];
    className?: string;
}

export const OfferTermsCard: FC<OfferTermsCardProps> = memo(
    (props: OfferTermsCardProps) => {
        // eslint-disable-next-line no-empty-pattern
        const { facilities, className } = props;

        const renderTerms = (
            facilitiesData: GoodsItems[],
            facilitiesItems: Facilities[],
        ) => {
            const resultItems = facilitiesData.filter((item) => facilitiesItems.includes(item.id));

            return resultItems.map((item) => <FacilityCard facility={item} />);
        };

        return (
            <div className={cn(className, styles.wrapper)}>
                <h3 className={styles.title}>Условия</h3>
                <div className={styles.container}>
                    {renderTerms(goodsItems, facilities)}
                </div>
            </div>
        );
    },
);
