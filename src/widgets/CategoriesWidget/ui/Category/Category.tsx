import cn from "classnames";
import React, { FC, memo } from "react";

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
                        {getVacancyText(vacancyNumber)}
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
                    {getVacancyText(vacancyNumber)}
                </span>
            </div>
        </div>
    );
});
