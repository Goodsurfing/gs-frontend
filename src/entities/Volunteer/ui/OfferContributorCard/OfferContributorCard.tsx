import React, { FC, memo } from "react";

import { Avatar } from "@/shared/ui/Avatar/Avatar";

import styles from "./OfferContributorCard.module.scss";

interface OfferContributorCardProps {
    avatar: string;
    name: string;
}

export const OfferContributorCard: FC<OfferContributorCardProps> = memo(
    (props: OfferContributorCardProps) => {
        const { avatar, name } = props;
        return (
            <div className={styles.wrapper}>
                <Avatar icon={avatar} className={styles.avatar} />
                <span className={styles.name}>{name}</span>
            </div>
        );
    },
);
