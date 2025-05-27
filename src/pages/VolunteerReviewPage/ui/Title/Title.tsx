import React, { FC } from "react";

import { Rating } from "@mui/material";
import { useTranslation } from "react-i18next";
import styles from "./Title.module.scss";

interface TitleProps {
    rating?: number;
}

export const Title: FC<TitleProps> = (props) => {
    const { rating } = props;
    const { t } = useTranslation("volunteer");
    return (
        <div className={styles.wrapper}>
            <h2 className={styles.title}>{t("volunteer-review.Отзывы")}</h2>
            {rating && (
                <div className={styles.ratingWrapper}>
                    <span className={styles.ratingText}>{t("volunteer-review.Ваш рейтинг")}</span>
                    <Rating
                        value={rating}
                        readOnly
                        sx={{
                            "& .MuiRating-iconFilled": {
                                color: "#FED81C",
                            },
                        }}
                    />
                    <span className={styles.ratingNum}>{rating}</span>
                </div>
            )}
        </div>
    );
};
