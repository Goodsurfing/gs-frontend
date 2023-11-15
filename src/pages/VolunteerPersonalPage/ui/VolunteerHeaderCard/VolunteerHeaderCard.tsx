import React, { FC, memo } from "react";

import Button from "@/shared/ui/Button/Button";

import { Avatar } from "@/shared/ui/Avatar/Avatar";
import { Volunteer } from "@/entities/Volunteer";
import memberIcon from "@/shared/assets/icons/select-check.svg";
import styles from "./HostlHeaderCard.module.scss";

interface VolunteerHeaderCardProps {
    id: string;
    volunteer: Volunteer;
}

export const VolunteerlHeaderCard: FC<VolunteerHeaderCardProps> = memo(
    (props: VolunteerHeaderCardProps) => {
        const {
            volunteer: {
                firstName, imageUuid, isMember, country, city, birthDate,
            },
        } = props;
        return (
            <div className={styles.wrapper}>
                <Avatar size="LARGE" icon={imageUuid} className={styles.image} alt="avatar" />
                <div className={styles.containerInfo}>
                    <span className={styles.birthDate}>
                        Волонтёр,
                        {" "}
                        {birthDate}
                    </span>
                    {isMember && <img src={memberIcon} alt="goodsurfing member" />}
                    <h3 className={styles.name}>{firstName}</h3>
                    <span className={styles.address}>
                        {country}
                        ,
                        {" "}
                        {city}
                    </span>
                </div>
                <div className={styles.btnMedalsContainer}>
                    <span>MEDALS</span>
                    <Button color="BLUE" size="SMALL" variant="FILL">
                        Редактировать профиль
                    </Button>
                </div>
            </div>
        );
    },
);
