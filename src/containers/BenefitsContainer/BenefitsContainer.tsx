import React, { FC } from "react";

import BenefitItem from "@/containers/BenefitsContainer/BenefitItem/BenefitItem";
import { benefitsData } from "@/containers/BenefitsContainer/Benefits.data";

import styles from "./BenefitsContainer.module.scss";

const BenefitsContainer: FC = () => (
    <div className={styles.wrapper}>
        {benefitsData
                && benefitsData.map((item, index) => <BenefitItem key={index} {...item} />)}
    </div>
);

export default BenefitsContainer;
