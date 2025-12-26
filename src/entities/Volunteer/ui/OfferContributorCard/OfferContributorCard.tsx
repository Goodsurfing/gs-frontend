import React, { FC, memo } from "react";

import { Avatar } from "@/shared/ui/Avatar/Avatar";

import styles from "./OfferContributorCard.module.scss";
import CustomLink from "@/shared/ui/Link/Link";

interface OfferContributorCardProps {
    url: string;
    avatar?: string;
    name: string;
}

export const OfferContributorCard: FC<OfferContributorCardProps> = memo(
    (props: OfferContributorCardProps) => {
        const { avatar, name, url } = props;
        return (
            <CustomLink className={styles.wrapper} to={url} variant="DEFAULT">
                <Avatar icon={avatar} className={styles.avatar} />
                <span className={styles.name}>{name}</span>
            </CustomLink>
        );
    },
);
