import cn from "classnames";
import React, {
    FC, useEffect, useMemo, useState,
} from "react";
import { useAuth } from "@/routes/model/guards/AuthProvider";

import { Locale } from "@/app/providers/LocaleProvider/ui/LocaleProvider";

import { useGetChatListData } from "@/entities/Chat";
import { ChatsListWithOrganizations, ChatsListWithVolunteers, UserCard } from "@/entities/Messenger";

import { ListFilter } from "../ListFilter/ListFilter";
import styles from "./MessengerList.module.scss";

interface MessengerListProps {
    className?: string;
    onUserClick?: (value: string) => void;
    locale: Locale;
}

export const MessengerList: FC<MessengerListProps> = (props) => {
    const { className, onUserClick, locale } = props;
    const { token, mercureToken } = useAuth();
    const {
        chatsListWithOrganizations,
        chatsListWithVolunteers,
    } = useGetChatListData(token, mercureToken);
    const [filteredChatList,
        setFilteredChatList] = useState<(ChatsListWithVolunteers | ChatsListWithOrganizations)[]
    >([]);
    const [searchChats, setSearchChats] = useState<string>("");

    const handleTextChange = (text: string) => {
        setSearchChats(text);
    };

    useEffect(() => {
        if (searchChats) {
            const lowerSearch = searchChats.toLowerCase();

            const tempChatsListWithOrganizations = chatsListWithOrganizations.filter(
                (chatItem) => chatItem.organization.name.toLowerCase().includes(lowerSearch),
            );

            const tempChatsListWithVolunteers = chatsListWithVolunteers.filter(
                (chatItem) => {
                    const name = `${chatItem.volunteer.profile.lastName} ${chatItem.volunteer.profile.firstName}`;
                    return name.toLowerCase().includes(lowerSearch);
                },
            );

            setFilteredChatList([...tempChatsListWithOrganizations,
                ...tempChatsListWithVolunteers]);
        } else {
            setFilteredChatList([...chatsListWithOrganizations,
                ...chatsListWithVolunteers]);
        }
    }, [chatsListWithOrganizations, chatsListWithVolunteers, searchChats]);

    const renderUserCard = useMemo(
        () => filteredChatList.map(
            (chatItem) => (
                <div
                    onClick={() => onUserClick?.(chatItem.id.toString())}
                    key={chatItem.id.toString()}
                >
                    <UserCard dataChat={chatItem} locale={locale} />
                </div>
            ),
        ),
        [filteredChatList, locale, onUserClick],
    );

    return (
        <div className={cn(styles.layout, className)}>
            <div className={styles.topList}>
                <ListFilter value={searchChats} onChange={handleTextChange} />
            </div>
            <div className={cn(styles.wrapper)}>{renderUserCard}</div>
        </div>
    );
};
