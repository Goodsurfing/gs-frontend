import React from "react";
import { ReactSVG } from "react-svg";
import styles from "./ProjectBetter.module.scss";

export const ProjectBetter = () => {
    const renderMarks = () => whoCanInviteVolunteersData.map((item) => (
        <div className={styles.markWrapper}>
            <ReactSVG src={item.image} className={styles.image} />
            <span>{item.text}</span>
        </div>
    ));

    return (
        <div className={styles.wrapper}>ProjectBetter</div>
    );
};
