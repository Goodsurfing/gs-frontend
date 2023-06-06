import React, { FC } from "react";

import cn from "classnames";

import { PictureReviewProps } from "./types";

import styles from "./PictureReview.module.scss";

const PictureReview: FC<PictureReviewProps> = ({ close, className, img }) => {
    return (
        <div className={cn(styles.wrapper, className)}>
            <img src={img} className={styles.img} alt="uploaded" />
            {close}
        </div>
    );
};

export default PictureReview;
