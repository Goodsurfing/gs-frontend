import AOS from "aos";
import "aos/dist/aos.css";
import React, { useEffect } from "react";
import { ReactSVG } from "react-svg";

import { whyUseItData } from "../../data/becomeHost";
import styles from "./WhyUseIt.module.scss";

export const WhyUseIt = () => {
    useEffect(() => {
        AOS.init({ duration: 1000, once: true });

        return () => {
            AOS.refreshHard();
        };
    }, []);

    const renderMarks = () => whyUseItData.map((mark, index) => (
        <div
            className={styles.mark}
            data-aos={index % 2 === 0 ? "fade-right" : "fade-left"}
            key={index}
        >
            <ReactSVG src={mark.image} />
            <span className={styles.title}>{mark.title}</span>
        </div>
    ));

    return (
        <div className={styles.wrapper}>
            <h2>Зачем пользоваться Гудсёрфингом</h2>
            <div className={styles.container}>{renderMarks()}</div>
        </div>
    );
};
