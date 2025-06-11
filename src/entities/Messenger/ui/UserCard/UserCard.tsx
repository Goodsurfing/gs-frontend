import cn from "classnames";
import React, { FC, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

import { HostApi } from "@/entities/Host";
import { VolunteerApi } from "@/entities/Volunteer";

import { getMessengerPageUrl } from "@/shared/config/routes/AppUrls";
import { Avatar } from "@/shared/ui/Avatar/Avatar";

import {
    ChatsListWithOrganizations,
    ChatsListWithVolunteers,
} from "../../model/types/messenger";
import styles from "./UserCard.module.scss";
import { useLazyGetVolunteerByIdQuery } from "@/entities/Volunteer/api/volunteerApi";
import { useLazyGetHostByIdQuery } from "@/entities/Host/api/hostApi";
import { getMediaContent } from "@/shared/lib/getMediaContent";
import { formatMessageDate } from "@/shared/lib/formatDate";
import { Locale } from "@/app/providers/LocaleProvider/ui/LocaleProvider";
import { getOfferStateColor } from "@/shared/lib/offerState";
import { useGetFullName } from "@/shared/lib/getFullName";

interface UserCardProps {
    dataChat: ChatsListWithVolunteers | ChatsListWithOrganizations;
    className?: string;
    locale: Locale;
}

export const UserCard: FC<UserCardProps> = (props) => {
    const { dataChat, className, locale } = props;
    const { id } = useParams();
    const [volunteerData, setVolunteerData] = useState<VolunteerApi>();
    const [hostData, setHostData] = useState<HostApi>();
    const { getFullName } = useGetFullName();

    const [getVolunteer] = useLazyGetVolunteerByIdQuery();
    const [getHost] = useLazyGetHostByIdQuery();

    const isVolunteerChat = (
        data: ChatsListWithVolunteers | ChatsListWithOrganizations,
    ): data is ChatsListWithVolunteers => (data as ChatsListWithVolunteers).volunteer !== undefined
        && (data as ChatsListWithVolunteers).countUnreadMessagesByOrganization !== undefined;

    useEffect(() => {
        const fetchData = async () => {
            if (isVolunteerChat(dataChat)) {
                setVolunteerData(dataChat.volunteer);
            } else {
                setHostData(dataChat.organization);
            }
        };

        fetchData();
    }, [dataChat, getHost, getVolunteer]);

    if (volunteerData && isVolunteerChat(dataChat)) {
        return (
            <Link
                to={`${getMessengerPageUrl(locale)}/${dataChat.id}`}
                className={cn(
                    styles.wrapper,
                    { [styles.newMess]: !!dataChat.countUnreadMessagesByOrganization },
                    { [styles.active]: id === dataChat.id.toString() },
                    className,
                )}
            >
                <Avatar icon={getMediaContent(volunteerData.profile.image)} text={volunteerData.profile.firstName} size="MEDIUM" />
                <div className={styles.content}>
                    <div className={styles.nameDate}>
                        <span className={styles.name}>
                            {
                                getFullName(
                                    volunteerData.profile.firstName,
                                    volunteerData.profile.lastName,
                                )
                            }
                        </span>
                        <span className={styles.date}>
                            {formatMessageDate(
                                locale,
                                dataChat.lastMessage.createdAt,
                            )}
                        </span>
                    </div>
                    <div className={styles.dateNewLastMess}>
                        <span className={styles.lastMessage}>{dataChat.lastMessage.text ?? "Заявка"}</span>
                        {!!dataChat.countUnreadMessagesByOrganization && (
                            <div className={styles.newMessages}>
                                {dataChat.countUnreadMessagesByOrganization > 9 ? "9+" : dataChat.countUnreadMessagesByOrganization}
                            </div>
                        )}
                    </div>
                </div>
                <div
                    style={{ backgroundColor: getOfferStateColor(dataChat.vacancyStatus ?? "new") }}
                    className={styles.state}
                />
            </Link>
        );
    }

    if (hostData && !isVolunteerChat(dataChat)) {
        return (
            <Link
                to={`${getMessengerPageUrl(locale)}/${dataChat.id}`}
                className={cn(
                    styles.wrapper,
                    { [styles.newMess]: !!dataChat.countUnreadMessagesByVolunteer },
                    { [styles.active]: id === dataChat.id.toString() },
                    className,
                )}
            >
                <Avatar icon={getMediaContent(hostData.avatar)} size="MEDIUM" />
                <div className={styles.content}>
                    <div className={styles.nameDate}>
                        <span className={styles.name}>{hostData.name}</span>
                        <span className={styles.date}>
                            {formatMessageDate(
                                locale,
                                dataChat.lastMessage.createdAt,
                            )}
                        </span>
                    </div>
                    <div className={styles.dateNewLastMess}>
                        <span className={styles.lastMessage}>{dataChat.lastMessage.text ?? "Заявка"}</span>
                        {!!dataChat.countUnreadMessagesByVolunteer && (
                            <div className={styles.newMessages}>
                                {dataChat.countUnreadMessagesByVolunteer > 9 ? "9+" : dataChat.countUnreadMessagesByVolunteer}
                            </div>
                        )}
                        {/* To do a number of Messages, backend issue */}
                    </div>
                </div>
                <div
                    style={{ backgroundColor: getOfferStateColor(dataChat.vacancyStatus ?? "new") }}
                    className={styles.state}
                />
            </Link>
        );
    }

    return null;
};
