import React, { FC, memo } from "react";
import { ReactSVG } from "react-svg";

import { useNavigate } from "react-router-dom";
import { HostMember } from "@/entities/Host";

import deleteIcn from "@/shared/assets/icons/delete.svg";
import { Avatar } from "@/shared/ui/Avatar/Avatar";

import styles from "./TeamCard.module.scss";
import { getMediaContent } from "@/shared/lib/getMediaContent";
import { Profile } from "@/entities/Profile";
import { getFullAddress, useGetFullName } from "@/shared/lib/getFullName";
import { getVolunteerPersonalPageUrl } from "@/shared/config/routes/AppUrls";
import { Locale } from "@/entities/Locale";

interface TeamCardProps {
    teamUser?: HostMember;
    profileData?: Profile;
    disableDeleteIcn?: boolean;
    onDeleteClick?: (id: number) => void;
    locale: Locale;
    isNavigate?: boolean;
}

export const TeamCard: FC<TeamCardProps> = memo(
    ({
        teamUser, profileData,
        disableDeleteIcn, onDeleteClick, locale,
        isNavigate = true,
    }: TeamCardProps) => {
        const navigate = useNavigate();
        const { getFullName } = useGetFullName();

        const navigateTo = (userId: string) => {
            if (userId && isNavigate) {
                navigate(getVolunteerPersonalPageUrl(locale, userId));
            }
        };

        if (teamUser) {
            const { id, profile } = teamUser;
            return (
                <div className={styles.wrapper} onClick={() => navigateTo(profile.id)}>
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
                image, firstName, lastName, country, city, id,
            } = profileData;
            return (
                <div className={styles.wrapper} onClick={() => navigateTo(id)}>
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
