import React from "react";
import { whoCanInviteVolunteersData } from "../../data/becomeHost";
import styles from "./WhoCanInvite.module.scss";

export const WhoCanInvite = () => {
    const renderMarks = () => whoCanInviteVolunteersData.map((item) => (
        <div className={styles.markWrapper} />
    ));
    return (
        <div className={styles.wrapper}>
            <h2>Кто может приглашать гудсёрферов</h2>
            <p>
                Хост – международный термин обозначающий сторону,
                которая принимает добровольных помощников у себя для реализации какого-либо проекта.
            </p>
            {
                renderMarks()
            }
        </div>
    );
};
