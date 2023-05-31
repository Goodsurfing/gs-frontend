import cn from "classnames";
import React, { FC } from "react";

import styles from "./PictureReview.module.scss";
import { PictureReviewProps } from "./types";

const PictureReview: FC<PictureReviewProps> = ({ close, className, img }) => (
    <div className={cn(styles.wrapper, className)}>
        <img src={img} className={styles.img} alt="uploaded" />
        {close}
    </div>
);

export default PictureReview;
