import React, { FC, memo } from "react";
import { ReactSVG } from "react-svg";

import { HostMember } from "@/entities/Host";

import deleteIcn from "@/shared/assets/icons/delete.svg";
import { Avatar } from "@/shared/ui/Avatar/Avatar";

import styles from "./TeamCard.module.scss";
import { getMediaContent } from "@/shared/lib/getMediaContent";
import { Profile } from "@/entities/Profile";
import { getFullAddress, getFullName } from "@/shared/lib/getFullName";

interface TeamCardProps {
    teamUser?: HostMember;
    profileData?: Profile;
    disableDeleteIcn?: boolean;
    onDeleteClick?: (id: number) => void;
}

export const TeamCard: FC<TeamCardProps> = memo(
    ({
        teamUser, profileData,
        disableDeleteIcn, onDeleteClick,
    }: TeamCardProps) => {
        if (teamUser) {
            const { id, profile } = teamUser;
            return (
                <div className={styles.wrapper}>
                    <Avatar icon={getMediaContent(profile.image)} text={profile.firstName} size="MEDIUM" />
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
        }
        if (profileData) {
            const {
                image, firstName, lastName, country, city,
            } = profileData;
            return (
                <div className={styles.wrapper}>
                    <Avatar icon={getMediaContent(image)} text={firstName} size="MEDIUM" />
                    <div className={styles.userInfo}>
                        {/* <span className={styles.role}>{teamUser.role}</span> */}
                        <span className={styles.name}>
                            {getFullName(firstName, lastName)}
                        </span>
                        <span className={styles.address}>
                            {getFullAddress(country, city)}
                        </span>
                    </div>
                </div>
            );
        }

        return null;
    },
);
