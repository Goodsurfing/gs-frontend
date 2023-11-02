import React, { FC, memo } from "react";

import { GoodsItems } from "@/features/OfferConditions/model/types/conditionsData";

import IconComponent from "@/shared/ui/IconComponent/IconComponent";

import styles from "./FacilityCard.module.scss";

interface FacilityCardProps {
    facility: GoodsItems;
}

export const FacilityCard: FC<FacilityCardProps> = memo(
    (props: FacilityCardProps) => {
        const {
            facility: { icon, text },
        } = props;
        return (
            <div className={styles.wrapper}>
                <IconComponent className={styles.icon} icon={icon} alt={text} />
                <span className={styles.text}>{text}</span>
            </div>
        );
    },
);
