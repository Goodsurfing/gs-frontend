import cn from "classnames";
import React, { FC, memo } from "react";
import { Link } from "react-router-dom";

import { useTranslation } from "react-i18next";
import flagIcon from "@/shared/assets/icons/donation/flag.svg";
import calendarIcon from "@/shared/assets/icons/donation/calendar.svg";
import checkIcon from "@/shared/assets/icons/donation/check.svg";
import { getDonationPersonalPage } from "@/shared/config/routes/AppUrls";
import { textSlice } from "@/shared/lib/textSlice";

import { Locale } from "@/entities/Locale";
import styles from "./DonationCard.module.scss";
import { DonationProgressBar } from "../DonationProgressBar/DonationProgressBar";

export interface DonationCardType {
    id: string;
    image?: string | null;
    title?: string | null;
    organizationName: string;
    description?: string | null;
    daysLeft: number;
    percentAmountCollect: number;
    isSuccess: boolean;
}

interface DonationCardProps {
    data: DonationCardType;
    className?: string;
    locale: Locale;
}

export const DonationCard: FC<DonationCardProps> = memo((props: DonationCardProps) => {
    const {
        data,
        className,
        locale,
    } = props;
    const {
        title, image, description,
        daysLeft, isSuccess, organizationName,
        percentAmountCollect,
    } = data;
    const { t } = useTranslation("donation");

    return (
        <Link
            to={getDonationPersonalPage(locale, data.id)}
            className={cn(styles.wrapper, className)}
        >
            <div className={styles.imageWrapper}>
                {image ? <img src={image} alt="donation-img" loading="lazy" /> : <div className={styles.imagePlaceholder} />}
                {isSuccess && (
                    <div className={styles.success}>{t("Успешный проект")}</div>
                )}
            </div>
            <div className={styles.content}>
                <DonationProgressBar
                    value={percentAmountCollect}
                    isSuccess={isSuccess}
                    className={styles.progressBar}
                />
                <p className={styles.title}>{textSlice(title, 50, "title")}</p>
                <div className={styles.subtitle}>
                    <p className={styles.organizationName}>{textSlice(organizationName, 25, "none")}</p>
                    <p className={styles.description}>{textSlice(description, 50, "description")}</p>
                </div>
                <div className={styles.stats}>
                    {isSuccess ? (
                        <div className={styles.iconWrapper}>
                            <img src={checkIcon} alt="check" />
                            <span>
                                {t("Проект собрал")}
                                {" "}
                                {percentAmountCollect}
                                {" "}
                                %
                            </span>
                        </div>
                    ) : (
                        <>
                            <div className={styles.iconWrapper}>
                                <img src={flagIcon} alt="flag" />
                                <span>
                                    {t("Собрано")}
                                    {" "}
                                    {percentAmountCollect}
                                    {" "}
                                    %
                                </span>
                            </div>
                            <div className={styles.iconWrapper}>
                                <img src={calendarIcon} alt="calendar" />
                                <span>
                                    {t("Осталось")}
                                    {" "}
                                    {daysLeft}
                                </span>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </Link>
    );
});
