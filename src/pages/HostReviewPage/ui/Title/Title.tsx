import React, { FC } from "react";

import { Rating } from "@mui/material";
import { useTranslation } from "react-i18next";
import styles from "./Title.module.scss";

interface TitleProps {
    rating?: number;
}

export const Title: FC<TitleProps> = (props) => {
    const { t } = useTranslation("host");
    const { rating } = props;

    return (
        <div className={styles.wrapper}>
            <h1 className={styles.title}>{t("hostReviews.Отзывы")}</h1>
            {rating && (
                <div className={styles.ratingWrapper}>
                    <span className={styles.ratingText}>{t("hostReviews.Ваш рейтинг")}</span>
                    <Rating
                        value={rating}
                        readOnly
                        sx={{
                            "& .MuiRating-iconFilled": {
                                color: "#FED81C",
                            },
                        }}
                    />
                    {rating && (
                        <span className={styles.ratingNum}>{Number(rating.toFixed(1))}</span>
                    )}
                </div>
            )}
        </div>
    );
};
