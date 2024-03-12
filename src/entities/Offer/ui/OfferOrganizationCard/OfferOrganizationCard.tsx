import { Button } from "@mui/material";
import React, { FC, memo } from "react";
import cn from "classnames";

import organizationDefaultImage from "@/shared/assets/images/offers/organizationSmallMOCK.png";

import styles from "./OfferOrganizationCard.module.scss";

interface OfferOrganizationCardProps {
    className?: string;
}

export const OfferOrganizationCard: FC<OfferOrganizationCardProps> = memo(
    (props: OfferOrganizationCardProps) => {
        const {
            className,
        } = props;
        return (
            <div className={cn(className, styles.wrapper)}>
                <h3 className={styles.title}>Организация</h3>
                <div className={styles.container}>
                    <div className={styles.fullInfoContainer}>
                        <div className={styles.nameContainer}>
                            <img
                                className={styles.image}
                                src={organizationDefaultImage}
                                alt="organization"
                            />
                            <span className={styles.name}>Название организации</span>
                        </div>
                        <p className={styles.description}>Описание</p>
                    </div>
                    <Button className={styles.button} variant="outlined">
                        Подробнее
                    </Button>
                </div>
            </div>
        );
    },
);
