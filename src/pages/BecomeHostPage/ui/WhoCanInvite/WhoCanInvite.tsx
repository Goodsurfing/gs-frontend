import AOS from "aos";
import "aos/dist/aos.css";
import React, { useEffect } from "react";
import { ReactSVG } from "react-svg";
import { useTranslation } from "react-i18next";

import { whoCanInviteVolunteersData } from "../../data/becomeHost";
import styles from "./WhoCanInvite.module.scss";

export const WhoCanInvite = () => {
    const { t } = useTranslation("become-host");

    useEffect(() => {
        AOS.init({ duration: 500, once: true });

        return () => {
            AOS.refreshHard();
        };
    }, []);

    const renderMarks = () => whoCanInviteVolunteersData.map((item) => (
        <div className={styles.markWrapper} data-aos="zoom-in-up" key={item.text}>
            <ReactSVG src={item.image} className={styles.image} />
            <span>{t(item.text)}</span>
        </div>
    ));

    return (
        <div className={styles.wrapper}>
            <h2>{t("Кто может приглашать гудсёрферов")}</h2>
            <p>
                {t("Хост – международный термин обозначающий сторону, которая принимает добровольных помощников у себя для реализации какого-либо проекта.")}
            </p>
            <div className={styles.container}>{renderMarks()}</div>
        </div>
    );
};
