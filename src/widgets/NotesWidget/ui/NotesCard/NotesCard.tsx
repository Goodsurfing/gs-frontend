import cn from "classnames";
import React, { FC, memo } from "react";

import { Offer } from "@/entities/Offer";

import { Avatar } from "@/shared/ui/Avatar/Avatar";

import styles from "./NotesCard.module.scss";
import Button from "@/shared/ui/Button/Button";

interface NotesCardProps {
    className?: string;
    offer: Offer;
}

export const NotesCard: FC<NotesCardProps> = memo((props: NotesCardProps) => {
    const {
        offer: {
            description: { titleImage, title },
            where: { address },
        },
        className,
    } = props;
    const truncateString = (str: string, length: number) => (str.length > length ? `${str.substring(0, length)}...` : str);

    return (
        <div className={cn(className, styles.wrapper)}>
            <div
                className={styles.status}
                style={{ backgroundColor: "#79C8FF" }}
            >
                новая
            </div>
            <div className={styles.mainInfo}>
                <Avatar
                    icon={titleImage}
                    alt="offer title image"
                    className={styles.avatar}
                />
                <div className={styles.infoContainer}>
                    <span className={styles.title}>{truncateString(title, 30)}</span>
                    <span className={styles.address}>{address ? truncateString(address, 23) : "Адрес не указан"}</span>
                    <span className={styles.tag}>Заповедники и нац. парки</span>
                </div>
            </div>
            <Button color="BLUE" variant="OUTLINE" size="SMALL">Сообщение</Button>
        </div>
    );
});
