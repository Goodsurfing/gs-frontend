import cn from "classnames";
import React, { FC, memo } from "react";

import { HandySvg } from "@handy-ones/handy-svg";
import { Profile } from "@/entities/Profile";

import deleteIcon from "@/shared/assets/icons/delete.svg";
import messageIcon from "@/shared/assets/icons/message_icon.svg";
import { Avatar } from "@/shared/ui/Avatar/Avatar";

import styles from "./VolunteerSubscriberCard.module.scss";

interface VolunteerSubscriberCardProps {
    profile: Profile;
    className?: string;
}

export const VolunteerSubscriberCard: FC<VolunteerSubscriberCardProps> = memo(
    (props: VolunteerSubscriberCardProps) => {
        const {
            profile: {
                image, firstName, lastName, country, city,
            },
            className,
        } = props;
        return (
            <div className={cn(className, styles.wrapper)}>
                <Avatar icon={image?.contentUrl} className={styles.avatar} />
                <div className={styles.info}>
                    <span className={styles.name}>
                        {firstName}
                        {" "}
                        {lastName}
                    </span>
                    <span className={styles.address}>
                        {city}
                        {", "}
                        {country}
                    </span>
                </div>
                <img
                    src={messageIcon}
                    alt="message icon"
                    className={styles.messageIcon}
                />
                <HandySvg
                    src={deleteIcon}
                    alt="delete icon"
                    className={styles.deleteIcon}
                />
            </div>
        );
    },
);
