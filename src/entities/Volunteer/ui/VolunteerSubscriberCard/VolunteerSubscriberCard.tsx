import React, { FC, memo } from "react";

import { Profile } from "@/entities/Profile";

import { Avatar } from "@/shared/ui/Avatar/Avatar";

import messageIcon from "@/shared/assets/icons/message_icon.svg";

import styles from "./VolunteerSubscriberCard.module.scss";

interface VolunteerSubscriberCardProps {
    profile: Profile;
}

export const VolunteerSubscriberCard: FC<VolunteerSubscriberCardProps> = memo(
    (props: VolunteerSubscriberCardProps) => {
        const {
            profile: {
                imageUuid, firstName, lastName, country, city,
            },
        } = props;
        return (
            <div>
                <Avatar icon={imageUuid} className={styles.avtar} />
                <div className={styles.info}>
                    <span className={styles.name}>
                        {firstName}
                        {" "}
                        {lastName}
                    </span>
                    <span className={styles.address}>
                        {city}
                        {" "}
                        {country}
                    </span>
                </div>
                <img src={messageIcon} alt="message icon" className={styles.messageIcon} />
            </div>
        );
    },
);
