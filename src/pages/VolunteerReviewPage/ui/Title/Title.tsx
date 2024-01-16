import React from "react";

import { Rating } from "@mui/material";
import { useTranslation } from "react-i18next";
import styles from "./Title.module.scss";

export const Title = () => {
    const { t } = useTranslation("volunteer");
    return (
        <div className={styles.wrapper}>
            <h2 className={styles.title}>{t("volunteer-review.Отзывы")}</h2>
            <div className={styles.ratingWrapper}>
                <span className={styles.ratingText}>{t("volunteer-review.Ваш рейтинг")}</span>
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
