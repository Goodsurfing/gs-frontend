import React, { FC } from "react";
import styles from "./UserInfoCard.module.scss";
import { UserChatType } from "@/entities/Messenger";

interface UserInfoCardProps {
    user: UserChatType
}

export const UserInfoCard: FC<UserInfoCardProps> = (props) => {
    const { user } = props;

    return (
        <div className={styles.wrapper}>
            UserInfoCard
            {user.name}
        </div>
    );
};
