import React, { FC, memo } from "react";
import { ReactSVG } from "react-svg";

import { HostMember } from "@/entities/Host";

import deleteIcn from "@/shared/assets/icons/delete.svg";
import { Avatar } from "@/shared/ui/Avatar/Avatar";

import styles from "./TeamCard.module.scss";
import { getMediaContent } from "@/shared/lib/getMediaContent";

interface TeamCardProps {
    teamUser: HostMember;
    disableDeleteIcn?: boolean;
    onDeleteClick?: (id: number) => void;
}

export const TeamCard: FC<TeamCardProps> = memo(
    ({ teamUser, disableDeleteIcn, onDeleteClick }: TeamCardProps) => {
        const { id, profile } = teamUser;
        return (
            <div className={styles.wrapper}>
                <Avatar icon={getMediaContent(profile.image?.contentUrl)} text={profile.firstName} size="MEDIUM" />
                <div className={styles.userInfo}>
                    {/* <span className={styles.role}>{teamUser.role}</span> */}
                    <span className={styles.name}>
                        {profile.firstName}
                        {" "}
                        {profile.lastName}
                    </span>
                    <span className={styles.address}>
                        {profile.country}
                        ,
                        {profile.city}
                    </span>
                </div>
                {!disableDeleteIcn && (
                    <ReactSVG
                        src={deleteIcn}
                        className={styles.deleteIcn}
                        onClick={() => onDeleteClick?.(id)}
                    />
                )}
            </div>
        );
    },
);
