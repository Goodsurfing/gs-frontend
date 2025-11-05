import cn from "classnames";
import React, {
    FC,
} from "react";
import { Link, useParams } from "react-router-dom";

import { getMessengerPageUrl } from "@/shared/config/routes/AppUrls";
import { Avatar } from "@/shared/ui/Avatar/Avatar";

import {
    ChatsList,
} from "../../model/types/messenger";
import styles from "./UserCard.module.scss";
import { getMediaContent } from "@/shared/lib/getMediaContent";
import { formatMessageDate } from "@/shared/lib/formatDate";
import { Locale } from "@/app/providers/LocaleProvider/ui/LocaleProvider";
import { getOfferStateColor } from "@/shared/lib/offerState";
import { useGetFullName } from "@/shared/lib/getFullName";
import { useGetProfileInfoByIdQuery } from "@/entities/Profile/api/profileApi";

interface UserCardProps {
    dataChat: ChatsList;
    className?: string;
    locale: Locale;
}

export const UserCard: FC<UserCardProps> = (props) => {
    const {
        dataChat, className, locale,
    } = props;
    const { id } = useParams();
    const { data: companionData } = useGetProfileInfoByIdQuery(dataChat.otherParticipants[0].id);
    const { getFullName } = useGetFullName();

    if (!companionData) {
        return null;
    }

    const {
        image, firstName, lastName,
    } = companionData;

    return (
        <Link
            to={`${getMessengerPageUrl(locale)}/${dataChat.id}`}
            className={cn(
                styles.wrapper,
                { [styles.newMess]: !!dataChat.countUnreadMessages },
                { [styles.active]: id === dataChat.id.toString() },
                className,
            )}
        >
            <Avatar icon={getMediaContent(image)} text={firstName} size="MEDIUM" />
            <div className={styles.content}>
                <div className={styles.nameDate}>
                    <span className={styles.name}>
                        {
                            getFullName(
                                firstName,
                                lastName,
                            )
                        }
                    </span>
                    <span className={styles.date}>
                        {formatMessageDate(
                            locale,
                            dataChat.lastMessage?.createdAt,
                        )}
                    </span>
                </div>
                <div className={styles.dateNewLastMess}>
                    <span className={styles.lastMessage}>{dataChat.lastMessage?.text ?? "Заявка"}</span>
                    {!!dataChat.countUnreadMessages && (
                        <div className={styles.newMessages}>
                            {dataChat.countUnreadMessages > 9 ? "9+" : dataChat.countUnreadMessages}
                        </div>
                    )}
                </div>
            </div>
            <div
                style={{ backgroundColor: getOfferStateColor(dataChat.applicationStatus ?? "new") }}
                className={styles.state}
            />
        </Link>
    );
};
