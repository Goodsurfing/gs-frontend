import cn from "classnames";
import React, {
    FC, useMemo,
} from "react";

import { mockedUsers, UserCard } from "@/entities/Messenger";

import styles from "./MessengerList.module.scss";
import { ListFilter } from "../ListFilter/ListFilter";

interface MessengerListProps {
    className?: string;
    onUserClick?: (value: string) => void;
}

export const MessengerList: FC<MessengerListProps> = (props) => {
    const { className, onUserClick } = props;

    const renderUserCard = useMemo(
        () => mockedUsers.map(
            (user) => (
                <div onClick={() => onUserClick?.(user.id)}>
                    <UserCard
                        data={user}
                        key={user.id}
                    />
                </div>
            ),
        ),
        [onUserClick],
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
