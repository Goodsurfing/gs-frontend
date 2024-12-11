import cn from "classnames";
import React, { FC, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

import { useLocale } from "@/app/providers/LocaleProvider";

import { Host } from "@/entities/Host";
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

interface UserCardProps {
    dataChat: ChatsListWithVolunteers | ChatsListWithOrganizations;
    className?: string;
}

export const UserCard: FC<UserCardProps> = (props) => {
    const { dataChat, className } = props;
    const { id } = useParams();
    const { locale } = useLocale();
    const [volunteerData, setVolunteerData] = useState<VolunteerApi>();
    const [hostData, setHostData] = useState<Host>();

    const [getVolunteer] = useLazyGetVolunteerByIdQuery();
    const [getHost] = useLazyGetHostByIdQuery();

    const isVolunteerChat = (
        data: ChatsListWithVolunteers | ChatsListWithOrganizations,
    ): data is ChatsListWithVolunteers => (data as ChatsListWithVolunteers).volunteer !== undefined;

    useEffect(() => {
        const fetchData = async () => {
            if (isVolunteerChat(dataChat)) {
                try {
                    const volunteerId = dataChat.volunteer.split("/").pop();
                    const volunteerResult = await getVolunteer(volunteerId as string).unwrap();
                    setVolunteerData(volunteerResult);
                } catch {
                    setVolunteerData(undefined);
                }
            } else {
                try {
                    const hostId = dataChat.organization.split("/").pop();
                    const hostResult = await getHost(hostId as string).unwrap();
                    setHostData(hostResult);
                } catch {
                    setHostData(undefined);
                }
            }
        };

        fetchData();
    }, [dataChat, getHost, getVolunteer]);

    if (volunteerData) {
        return (
            <Link
                to={`${getMessengerPageUrl(locale)}/${dataChat.id}`}
                className={cn(
                    styles.wrapper,
                    { [styles.newMess]: !dataChat.lastMessage.viewed },
                    { [styles.active]: id === dataChat.id.toString() },
                    className,
                )}
            >
                <Avatar icon={getMediaContent(volunteerData.profile.image)} text={volunteerData.profile.firstName} size="MEDIUM" />
                <div className={styles.content}>
                    <div className={styles.nameDate}>
                        <span className={styles.name}>{`${volunteerData.profile.lastName} ${volunteerData.profile.firstName}`}</span>
                        <span className={styles.date}>
                            {formatMessageDate(
                                dataChat.lastMessage.createdAt,
                            )}
                        </span>
                    </div>
                    <div className={styles.dateNewLastMess}>
                        <span className={styles.lastMessage}>{dataChat.lastMessage.text ?? "Заявка"}</span>
                        {/* {isHaveNewMessages && (
                            <div className={styles.newMessages}>{newMessages}</div>
                        )} */}
                        {/* To do a number of Messages, backend issue */}
                    </div>
                </div>
                <div
                    // style={{ backgroundColor: getOfferStateColor(state) }}
                    // {To do state color, backend issue}
                    className={styles.state}
                />
            </Link>
        );
    }

    if (hostData) {
        return (
            <Link
                to={`${getMessengerPageUrl(locale)}/${dataChat.id}`}
                className={cn(
                    styles.wrapper,
                    { [styles.newMess]: !dataChat.lastMessage.viewed },
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
                                dataChat.lastMessage.createdAt,
                            )}
                        </span>
                    </div>
                    <div className={styles.dateNewLastMess}>
                        <span className={styles.lastMessage}>{dataChat.lastMessage.text ?? "Заявка"}</span>
                        {/* {isHaveNewMessages && (
                            <div className={styles.newMessages}>{newMessages}</div>
                        )} */}
                        {/* To do a number of Messages, backend issue */}
                    </div>
                </div>
                <div
                    // style={{ backgroundColor: getOfferStateColor(state) }}
                    // {To do state color, backend issue}
                    className={styles.state}
                />
            </Link>
        );
    }

    return null;
};
