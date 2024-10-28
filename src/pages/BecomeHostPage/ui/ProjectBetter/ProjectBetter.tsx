import React from "react";
import { ReactSVG } from "react-svg";
import styles from "./ProjectBetter.module.scss";
import { betterProjectData } from "../../data/becomeHost";
import Button from "@/shared/ui/Button/Button";

export const ProjectBetter = () => {
    const renderMarks = () => betterProjectData.map((item) => {
        const renderList = () => item.marks.map((point) => <li>{point}</li>);

        return (
            <div className={styles.markWrapper}>
                <div className={styles.content}>
                    <ReactSVG src={item.image} className={styles.image} />
                    <span className={styles.title}>{item.title}</span>
                </div>
                <ul>
                    {renderList()}
                </ul>
            </div>
        );
    });

    return (
        <div className={styles.wrapper}>
            <h2>Чтобы сделать ваш проект лучше</h2>
            <p>
                Гудсёрферы – это добровольные помощники,
                которые готовы приехать к вам из любых регионов и
                стран и приложить свои усилия для развития вашего проекта.
            </p>
            <div className={styles.container}>
                {renderMarks()}
            </div>
            <Button className={styles.button} color="BLUE" size="SMALL" variant="FILL">Стать хостом</Button>
        </div>
    );
};
