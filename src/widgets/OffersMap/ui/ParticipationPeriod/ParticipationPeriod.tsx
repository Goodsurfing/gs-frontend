import React, { FC } from "react";

import { OfferWhenSlider } from "@/features/Offer";

import styles from "./ParticipationPeriod.module.scss";

interface ParticipationPeriodProps {
    value: number[];
    onChange: (value: number[]) => void;
    isOpen: boolean;
    isMobile?: boolean;
}

export const ParticipationPeriod: FC<ParticipationPeriodProps> = (
    props: ParticipationPeriodProps,
) => {
    const {
        value, onChange, isOpen, isMobile,
    } = props;
    return (
        isOpen ? (
            <div className={styles.wrapper}>
                <OfferWhenSlider
                    value={value}
                    onChange={onChange}
                    className={styles.slider}
                    isMobile={isMobile}
                />
            </div>
        ) : null
    );
};
