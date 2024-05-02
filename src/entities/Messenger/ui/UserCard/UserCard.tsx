import cn from "classnames";
import React, { FC } from "react";
import { useParams } from "react-router-dom";

import { Avatar } from "@/shared/ui/Avatar/Avatar";

import { UserType } from "../../model/types/messenger";
import styles from "./UserCard.module.scss";
import { getOfferStateColor } from "@/shared/lib/offerState";

interface UserCardProps {
    data: UserType;
    className?: string;
}

export const UserCard: FC<UserCardProps> = (props) => {
    const {
        data: {
            avatar,
            date,
            id: userId,
            lastMessage,
            name,
            newMessages,
            state,
        },
        className,
    } = props;
    const { id } = useParams();

    return (
        <div
            className={cn(
                styles.wrapper,
                className,
                { [styles.newMess]: newMessages !== 0 },
                { [styles.active]: id === userId },
            )}
        >
            <Avatar icon={avatar} text={name} size="MEDIUM" />
            <div className={styles.content}>
                <div className={styles.nameLast}>
                    <span className={styles.name}>{name}</span>
                    <span className={styles.lastMessage}>{lastMessage}</span>
                </div>
                <div className={styles.dateNewMess}>
                    <span className={styles.date}>{date}</span>
                    <div className={styles.newMessages}>{newMessages}</div>
                </div>
            </div>
            <div style={{ backgroundColor: getOfferStateColor(state) }} className={styles.state} />
        </div>
    );
};
