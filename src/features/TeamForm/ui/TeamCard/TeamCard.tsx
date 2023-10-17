import React, { FC, memo } from "react";

import deleteIcn from "@/shared/assets/icons/delete.svg";
import defaultAvatarImage from "@/shared/assets/images/default-avatar.jpg";

import { sliceFirstLetter } from "../../lib/avatarUtils";
import { TeamUser } from "../../model/types/team";
import styles from "./TeamCard.module.scss";

interface TeamCardProps {
    teamUser: TeamUser;
    disableDeleteIcn?: boolean;
}

export const TeamCard: FC<TeamCardProps> = memo(({ teamUser, disableDeleteIcn }: TeamCardProps) => (
    <div className={styles.wrapper}>
        {teamUser.avatar ? (
        // avatar with image
            <img
                src={defaultAvatarImage}
                className={styles.avatar}
                alt="AVATAR"
            />
        ) : (
        // avatar without image
            <div className={styles.avatarNoImg}>
                {sliceFirstLetter(teamUser.name)}
            </div>
        )}
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
