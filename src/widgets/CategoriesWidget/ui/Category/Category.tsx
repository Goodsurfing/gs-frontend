import cn from "classnames";
import React, { FC, memo } from "react";

import { useTranslation } from "react-i18next";
import threeDots from "@/shared/assets/icons/three-dots.svg";

import styles from "./Category.module.scss";
import { getVacancyText } from "@/shared/data/categories";

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
    const { t } = useTranslation();

    if (!image) {
        return (
            <div className={cn(styles.wrapper, styles.other)}>
                <img src={threeDots} alt="" className={styles.threeDots} />
                <div>
                    <span className={cn(styles.title, styles.otherTitle)}>
                        {title}
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
                <span className={styles.title}>{title}</span>
                <br />
                <span className={styles.vacancy}>
                    {vacancyNumber}
                    {" "}
                    {t(`category-offer.${getVacancyText(vacancyNumber)}`)}
                </span>
            </div>
        </div>
    );
});
