/* eslint-disable jsx-a11y/img-redundant-alt */
import React, { FC } from "react";

import plusIcon from "@/shared/assets/icons/offer-create/plus.svg";

import styles from "./ExtraImagesItemBackground.module.scss";

interface ExtraImagesItemBackgroundProps {
    label: string;
}

const ExtraImagesItemBackground: FC<ExtraImagesItemBackgroundProps> = (
    props: ExtraImagesItemBackgroundProps,
) => {
    const { label } = props;

    return (
        <div className={styles.backgroundWrapper}>
            <img className={styles.backgroundImg} src={plusIcon} alt="photo" />
            <p className={styles.backgroundText}>{label}</p>
        </div>
    );
};

export default ExtraImagesItemBackground;
