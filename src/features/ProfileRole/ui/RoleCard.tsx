import React, { FC } from "react";
import { Button } from "@mui/material";

import styles from "./RoleCard.module.scss";

interface RoleCardProps {
    imageRole: string;
    titleRole: string;
    descriptionRole: string;
    buttonText: string;
    buttonDisabled?: boolean;
    onClick?: () => void;
}

export const RoleCard: FC<RoleCardProps> = ({
    imageRole,
    titleRole,
    descriptionRole,
    buttonText,
    buttonDisabled = false,
    onClick,
}) => (
    <div className={styles.wrapper}>
        <img src={imageRole} alt="" />
        <span className={styles.title}>{titleRole}</span>
        <span className={styles.description}>{descriptionRole}</span>
        <Button className={styles.button} color="primary" onClick={onClick} disabled={buttonDisabled}>
            {buttonText}
        </Button>
    </div>
);
