import React, { FC } from "react";

import cn from "classnames";

import closeIcon from "@/shared/assets/icons/offer-create/delete.svg";

import ExtraCloseButton from "@/shared/ui/ExtraCloseButton/ExtraCloseButton";

import { ExtraImagesItemButtonProps } from "./types";

import styles from "./ExtraImagesItemButton.module.scss";

const ExtraImagesItemButton: FC<ExtraImagesItemButtonProps> = ({
    className,
    imgClassName,
    onClick,
}) => {
    return (
        <ExtraCloseButton className={cn(className, styles.btn)} onClick={onClick}>
            <img className={styles.icon} src={closeIcon} alt="close" />
        </ExtraCloseButton>
    );
};

export default ExtraImagesItemButton;
