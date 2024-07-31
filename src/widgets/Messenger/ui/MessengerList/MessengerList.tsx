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
    const { token } = useAuth();
    const { users } = useGetChatListData(token);

    const renderUserCard = useMemo(
        () => users.map((user) => (
            <div onClick={() => onUserClick?.(user.id)} key={user.id}>
                <UserCard data={user} />
            </div>
        )),
        [users, onUserClick],
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
