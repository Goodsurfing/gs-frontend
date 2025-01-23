import React from "react";
import { useNavigate } from "react-router-dom";
import { ReactSVG } from "react-svg";

import { useLocale } from "@/app/providers/LocaleProvider";

import { getProfilePageUrl } from "@/shared/config/routes/AppUrls";
import Button from "@/shared/ui/Button/Button";

import { betterProjectData } from "../../data/becomeHost";
import styles from "./ProjectBetter.module.scss";

export const ProjectBetter = () => {
    const { locale } = useLocale();

    const navigate = useNavigate();

    const navigateClick = () => {
        navigate(getProfilePageUrl(locale));
    };

    const renderMarks = () => betterProjectData.map((item) => {
        const renderList = () => item.marks.map((point) => <li>{point}</li>);

        return (
            <div className={styles.markWrapper}>
                <div className={styles.content}>
                    <ReactSVG src={item.image} className={styles.image} />
                    <span className={styles.title}>{item.title}</span>
                </div>
                <ul>{renderList()}</ul>
            </div>
        );
    });

    return (
        <div className={styles.wrapper}>
            <h2>Чтобы сделать ваш проект лучше</h2>
            <p>
                Гудсёрферы – это добровольные помощники, которые готовы приехать
                к вам из любых регионов и стран и приложить свои усилия для
                развития вашего проекта.
            </p>
            <div className={styles.container}>{renderMarks()}</div>
            <Button
                className={styles.button}
                color="BLUE"
                size="SMALL"
                variant="FILL"
                onClick={navigateClick}
            >
                Стать хостом
            </Button>
        </div>
    );
};
