import React, { FC, useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";

import { useBenefitsData } from "./Benefits.data";
import BenefitItem from "../BenefitItem/BenefitItem";
import styles from "./BenefitsContainer.module.scss";

export const BenefitsContainer: FC = () => {
    const benefitsData = useBenefitsData();

    useEffect(() => {
        AOS.init({ duration: 1000, once: true });

        return () => {
            AOS.refreshHard();
        };
    }, []);

    return (
        <div className={styles.wrapper}>
            {benefitsData
                && benefitsData.map((item, index) => <BenefitItem key={index} dataAos={index % 2 === 0 ? "zoom-in" : "zoom-out"} {...item} />)}
        </div>
    );
};
