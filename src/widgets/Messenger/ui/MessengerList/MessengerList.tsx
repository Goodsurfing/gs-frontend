import React, { FC, useMemo } from "react";
import cn from "classnames";
import { mockedUsers } from "@/entities/Messenger/model/data/mockedUsers";
import { UserCard } from "@/entities/Messenger/ui/UserCard/UserCard";

import styles from "./MessengerList.module.scss";

interface MessengerListProps {
    className?: string;
}

export const MessengerList: FC<MessengerListProps> = (props) => {
    const { className } = props;
    const renderUserCard = useMemo(
        () => mockedUsers.map((user) => <UserCard data={user} key={user.id} />),
        [],
    );

    return <div className={cn(styles.wrapper, className)}>{renderUserCard}</div>;
};
