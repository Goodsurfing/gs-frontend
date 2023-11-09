import React, { FC, memo } from "react";

import { Host } from "@/entities/Host";

import Button from "@/shared/ui/Button/Button";

import { Avatar } from "@/shared/ui/Avatar/Avatar";
import styles from "./HostlHeaderCard.module.scss";

interface HostlHeaderCardProps {
    host: Host;
}

export const HostlHeaderCard: FC<HostlHeaderCardProps> = memo(
    (props: HostlHeaderCardProps) => {
        const {
            host: { name, type, address },
        } = props;
        return (
            <div className={styles.wrapper}>
                <Avatar size="LARGE" className={styles.image} alt="avatar" />
                <div className={styles.containerInfo}>
                    <span className={styles.type}>
                        Организация/
                        {type}
                    </span>
                    <h3 className={styles.name}>{name}</h3>
                    <span className={styles.address}>{address}</span>
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
