import cn from "classnames";
import React, {
    FC, useMemo,
} from "react";

import { UserCard } from "@/entities/Messenger";

import styles from "./MessengerList.module.scss";
import { ListFilter } from "../ListFilter/ListFilter";
import { useAuth } from "@/routes/model/guards/AuthProvider";
import { useGetChatListData } from "@/entities/Chat";

interface MessengerListProps {
    className?: string;
    onUserClick?: (value: string) => void;
}

export const MessengerList: FC<MessengerListProps> = (props) => {
    const { className, onUserClick } = props;
    const { token, mercureToken } = useAuth();
    const {
        chatsListWithOrganizations,
        chatsListWithVolunteers,
    } = useGetChatListData(token, mercureToken);

    const renderUserCard = useMemo(
        () => [...chatsListWithOrganizations, ...chatsListWithVolunteers].map((chatItem) => (
            <div onClick={() => onUserClick?.(chatItem.id.toString())} key={chatItem.id.toString()}>
                <UserCard dataChat={chatItem} />
            </div>
        )),
        [chatsListWithOrganizations, chatsListWithVolunteers, onUserClick],
    );

    return (
        <div
            className={cn(styles.layout, className)}
        >
            <div className={styles.topList}>
                <ListFilter />
            </div>
            <div
                className={cn(styles.wrapper)}
            >
                {renderUserCard}
            </div>
        </div>
    );
};
