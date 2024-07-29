import cn from "classnames";
import React, { FC } from "react";
import { useParams, Link } from "react-router-dom";

import { Avatar } from "@/shared/ui/Avatar/Avatar";

import { UserType } from "../../model/types/messenger";
import styles from "./UserCard.module.scss";
import { getOfferStateColor } from "@/shared/lib/offerState";
import { useLocale } from "@/app/providers/LocaleProvider";
import { getMessengerPageUrl } from "@/shared/config/routes/AppUrls";

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
    const { locale } = useLocale();
    const isHaveNewMessages = newMessages !== 0;

    return (
        <Link
            to={`${getMessengerPageUrl(locale)}/${userId}`}
            className={cn(
                styles.wrapper,
                { [styles.newMess]: isHaveNewMessages },
                { [styles.active]: id === userId },
                className,
            )}
        >
            <Avatar icon={avatar} text={name} size="MEDIUM" />
            <div className={styles.content}>
                <div className={styles.nameDate}>
                    <span className={styles.name}>{name}</span>
                    <span className={styles.date}>{date}</span>
                </div>
                <div className={styles.dateNewLastMess}>
                    <span className={styles.lastMessage}>{lastMessage}</span>
                    {isHaveNewMessages && <div className={styles.newMessages}>{newMessages}</div>}
                </div>
            </div>
            <div style={{ backgroundColor: getOfferStateColor(state) }} className={styles.state} />
        </Link>
    );
};
