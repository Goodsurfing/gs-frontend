import React from "react";

import { Rating } from "@mui/material";
import { useTranslation } from "react-i18next";
import styles from "./Title.module.scss";

export const Title = () => {
    const { t } = useTranslation("host");
    return (
        <div className={styles.wrapper}>
            <h1 className={styles.title}>{t("hostReviews.Отзывы")}</h1>
            <div className={styles.ratingWrapper}>
                <span className={styles.ratingText}>{t("hostReviews.Ваш рейтинг")}</span>
                <Rating
                    value={3}
                    readOnly
                    sx={{
                        "& .MuiRating-iconFilled": {
                            color: "#FED81C",
                        },
                    }}
                />
                <span className={styles.ratingNum}>4.4</span>
            </div>
        </div>
    );
};
