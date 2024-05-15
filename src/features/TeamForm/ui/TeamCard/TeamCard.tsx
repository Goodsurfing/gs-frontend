import React, { FC, memo } from "react";

import deleteIcn from "@/shared/assets/icons/delete.svg";

import { TeamUser } from "@/entities/Host";
import styles from "./TeamCard.module.scss";
import { Avatar } from "@/shared/ui/Avatar/Avatar";

interface TeamCardProps {
    teamUser: TeamUser;
    disableDeleteIcn?: boolean;
}

export const TeamCard: FC<TeamCardProps> = memo(({ teamUser, disableDeleteIcn }: TeamCardProps) => (
    <div className={styles.wrapper}>
        <Avatar icon={teamUser.avatar} text={teamUser.name} size="MEDIUM" />
        <div className={styles.userInfo}>
            <span className={styles.role}>{teamUser.role}</span>
            <span className={styles.name}>
                {teamUser.name}
                {" "}
                {teamUser.surname}
            </span>
            <span className={styles.address}>
                {teamUser.country}
                ,
                {" "}
                {teamUser.city}
            </span>
        </div>
        {!disableDeleteIcn && (
            <img
                src={deleteIcn}
                alt="DELETE"
                className={styles.deleteIcn}
            />
        )}
    </div>
));
