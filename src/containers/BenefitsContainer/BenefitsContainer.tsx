import React, { FC, useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";

import BenefitItem from "@/containers/BenefitsContainer/BenefitItem/BenefitItem";
import { benefitsData } from "@/containers/BenefitsContainer/Benefits.data";

import styles from "./BenefitsContainer.module.scss";

const BenefitsContainer: FC = () => {
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

export default BenefitsContainer;
