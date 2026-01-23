import React, { FC } from "react";

import cn from "classnames";
import { OfferWhenSlider } from "@/features/Offer";

import styles from "./ParticipationPeriod.module.scss";

interface ParticipationPeriodProps {
    value: number[];
    onChange: (value: number[]) => void;
    isMobile?: boolean;
}

export const ParticipationPeriod: FC<ParticipationPeriodProps> = (
    props: ParticipationPeriodProps,
) => {
    const {
        value, onChange, isMobile,
    } = props;
    return (
        <div className={cn(styles.wrapper)}>
            <OfferWhenSlider
                value={value}
                onChange={onChange}
                className={styles.slider}
                isMobile={isMobile}
            />
        </div>
    );
};
