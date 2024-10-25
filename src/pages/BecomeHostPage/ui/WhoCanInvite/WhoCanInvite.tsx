import React from "react";
import { ReactSVG } from "react-svg";
import { whoCanInviteVolunteersData } from "../../data/becomeHost";
import styles from "./WhoCanInvite.module.scss";

export const WhoCanInvite = () => {
    const renderMarks = () => whoCanInviteVolunteersData.map((item) => (
        <div className={styles.markWrapper}>
            <ReactSVG src={item.image} className={styles.image} />
            <span>{item.text}</span>
        </div>
    ));

    return (
        <div className={styles.wrapper}>
            <h2>Кто может приглашать гудсёрферов</h2>
            <p>
                Хост – международный термин обозначающий сторону,
                которая принимает добровольных помощников у себя для реализации какого-либо проекта.
            </p>
            <div className={styles.container}>
                {renderMarks()}
            </div>
        </div>
    );
};
