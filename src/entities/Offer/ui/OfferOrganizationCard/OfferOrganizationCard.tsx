import { Button } from "@mui/material";
import React, { FC, memo } from "react";

import organizationDefaultImage from "@/shared/assets/images/offers/organizationSmallMOCK.png";

import { OfferOrganization } from "../../model/types/offerOrganization";
import styles from "./OfferOrganizationCard.module.scss";

interface OfferOrganizationCardProps {
    organization: OfferOrganization;
}

export const OfferOrganizationCard: FC<OfferOrganizationCardProps> = memo(
    (props: OfferOrganizationCardProps) => {
        const {
            organization: { name, description },
        } = props;
        return (
            <div className={styles.wrapper}>
                <h3 className={styles.title}>Организация</h3>
                <div className={styles.container}>
                    <div className={styles.fullInfoContainer}>
                        <div className={styles.nameContainer}>
                            <img
                                className={styles.image}
                                src={organizationDefaultImage}
                                alt="organization"
                            />
                            <span className={styles.name}>{name}</span>
                        </div>
                        <p className={styles.description}>{description}</p>
                    </div>
                    <Button className={styles.button} variant="outlined">
                        Подробнее
                    </Button>
                </div>
            </div>
        );
    },
);
