import React, { FC } from "react";

import cn from "classnames";

import { CircularProgress } from "@mui/material";
import { PictureReviewProps } from "./types";

import styles from "./PictureReview.module.scss";

const PictureReview: FC<PictureReviewProps> = ({
    close, className, img, isLoading,
}) => (
    <div className={cn(styles.wrapper, className)}>
        <img src={img} className={cn(styles.img, { [styles.loading]: isLoading })} alt="uploaded" />
        {close}
        {isLoading
        && (
            <div className={styles.loader}>
                <CircularProgress />
            </div>
        )}
    </div>
);

export default PictureReview;
