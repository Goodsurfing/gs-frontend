import cn from "classnames";
import React, { FC, memo } from "react";

import { useTranslation } from "react-i18next";
import threeDots from "@/shared/assets/icons/three-dots.svg";

import { getVacancyText } from "../../model/lib/getVacancyText";
import styles from "./Category.module.scss";

interface CategoryProps {
    title: string;
    image?: string;
    vacancyNumber: number;
    className?: string;
}

export const Category: FC<CategoryProps> = memo((props: CategoryProps) => {
    const {
        title, image, className, vacancyNumber,
    } = props;
    const { t } = useTranslation("translation");

    if (!image) {
        return (
            <div className={cn(styles.wrapper, styles.other)}>
                <img src={threeDots} alt="" className={styles.threeDots} />
                <div>
                    <span className={cn(styles.title, styles.otherTitle)}>
                        {t(`category-offer.${title}`)}
                    </span>
                    <br />
                    <span className={cn(styles.vacancy, styles.otherVacancy)}>
                        {vacancyNumber}
                        {" "}
                        {t(`category-offer.${getVacancyText(vacancyNumber)}`)}
                    </span>
                </div>
            </div>
        );
    }

    return (
        <div
            style={{
                backgroundImage: `url(${image})`,
            }}
            className={cn(className, styles.wrapper)}
        >
            <div>
                <span className={styles.title}>{t(`category-offer.${title}`)}</span>
                <br />
                <span className={styles.vacancy}>
                    {vacancyNumber}
                    {" "}
                    {getVacancyText(vacancyNumber)}
                </span>
            </div>
        </div>
    );
});
