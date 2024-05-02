import React, { FC } from "react";

import { OfferWhenSlider } from "@/features/OfferWhen";

import styles from "./ParticipationPeriod.module.scss";

interface ParticipationPeriodProps {
    value: number[];
    onChange: (value: number[]) => void;
    isOpen: boolean;
}

export const ParticipationPeriod: FC<ParticipationPeriodProps> = (
    props: ParticipationPeriodProps,
) => {
    const { value, onChange, isOpen } = props;
    return (
        isOpen ? (
            <div className={styles.wrapper}>
                <OfferWhenSlider
                    value={value}
                    onChange={onChange}
                    className={styles.slider}
                />
            </div>
        ) : null
    );
};
