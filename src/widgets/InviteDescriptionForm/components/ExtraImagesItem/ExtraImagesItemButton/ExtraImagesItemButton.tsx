import closeIcon from "@assets/icons/offer-create/delete.svg";
import cn from "classnames";
import React, { FC } from "react";

import ExtraCloseButton from "shared/ui/ExtraCloseButton/ExtraCloseButton";

import styles from "./ExtraImagesItemButton.module.scss";
import { ExtraImagesItemButtonProps } from "./types";

const ExtraImagesItemButton: FC<ExtraImagesItemButtonProps> = ({
  className,
  onClick,
}) => (
    <ExtraCloseButton className={cn(className, styles.btn)} onClick={onClick}>
        <img className={styles.icon} src={closeIcon} alt="close" />
    </ExtraCloseButton>
);

export default ExtraImagesItemButton;
