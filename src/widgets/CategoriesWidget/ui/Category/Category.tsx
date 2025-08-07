import cn from "classnames";
import React, { FC, memo } from "react";

import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import threeDots from "@/shared/assets/icons/three-dots.svg";

import styles from "./Category.module.scss";
import { getVacancyText } from "@/shared/data/categories";
import { Locale } from "@/entities/Locale";

interface CategoryProps {
    title: string;
    image?: string;
    vacancyNumber: number;
    className?: string;
    link: string;
    locale: Locale;
}

export const Category: FC<CategoryProps> = memo((props: CategoryProps) => {
    const {
        title, image, className, vacancyNumber, link, locale,
    } = props;
    const { t } = useTranslation();
    const navigate = useNavigate();

    const navigateTo = () => {
        navigate(`/${locale}${link}`);
    };

    const translateLib: Record<string, string> = {
        вакансий: t("category-offer.вакансий"),
        вакансия: t("category-offer.вакансия"),
        вакансии: t("category-offer.вакансии"),
    };

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
                        {translateLib[getVacancyText(vacancyNumber)]}
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
            onClick={navigateTo}
        >
            <div>
                <span className={styles.title}>{title}</span>
                <br />
                <span className={styles.vacancy}>
                    {vacancyNumber}
                    {" "}
                    {translateLib[getVacancyText(vacancyNumber)]}
                </span>
            </div>
        </div>
    );
});
