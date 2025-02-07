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
        searchValue,
        statusValue,
        onChangeSearchValue,
        onChangeStatusValue,
    } = useGetChatListData(token, mercureToken);
    const [filteredChatList,
        setFilteredChatList] = useState<(ChatsListWithVolunteers | ChatsListWithOrganizations)[]
    >([]);

    const handleTextChange = (text: string) => {
        onChangeSearchValue(text);
    };

    useEffect(() => {
        setFilteredChatList([...chatsListWithOrganizations, ...chatsListWithVolunteers]);
    }, [chatsListWithOrganizations, chatsListWithVolunteers]);

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
                <ListFilter
                    value={searchValue}
                    valueStatus={statusValue}
                    onChange={handleTextChange}
                    onChangeStatus={onChangeStatusValue}
                />
            </div>
            <div className={cn(styles.wrapper)}>{renderUserCard}</div>
        </div>
    );
};
