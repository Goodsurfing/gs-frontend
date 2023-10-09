import React from "react";

import { Rating } from "@mui/material";
import styles from "./Title.module.scss";

export const Title = () => (
    <div className={styles.wrapper}>
        <h1 className={styles.title}>Отзывы</h1>
        <div className={styles.ratingWrapper}>
            <span className={styles.ratingText}>Ваш рейтинг</span>
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
