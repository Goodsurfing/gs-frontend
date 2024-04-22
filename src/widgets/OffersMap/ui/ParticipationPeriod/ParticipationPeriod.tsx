import React, { FC } from "react";

import { ParticipationPeriod as ParticipationPeriodType } from "@/pages/OffersMapPage/model/types";

import styles from "./ParticipationPeriod.module.scss";

interface ParticipationPeriodProps {
    value: ParticipationPeriodType;
    onChange: (value: ParticipationPeriodType) => void;
    isOpen: boolean;
}

export const ParticipationPeriod: FC<ParticipationPeriodProps> = (props) => {
    const { value, onChange, isOpen } = props;
    return isOpen && (
        <div className={styles.wrapper}>ParticipationPeriod</div>
    );
};
