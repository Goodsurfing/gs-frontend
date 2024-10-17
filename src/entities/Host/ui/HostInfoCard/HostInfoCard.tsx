import cn from "classnames";
import React, { FC, memo } from "react";

import { Host } from "../../model/types/host";
// import { HostArticleCard } from "../HostArticleCard/HostArticleCard";
import { HostDescriptionCard } from "../HostDescriptionCard/HostDescriptionCard";
// import { HostGalleryCard } from "../HostGalleryCard/HostGalleryCard";
import { HostOffersCard } from "../HostOffersCard/HostOffersCard";
// import { HostReviewCard } from "../HostReviewCard/HostReviewCard";
import { HostTeamCard } from "../HostTeamCard/HostTeamCard";
// import { HostVideoGalleryCard } from "../HostVideoGalleryCard/HostVideoGalleryCard";
import styles from "./HostInfoCard.module.scss";

interface HostInfoCardProps {
    className?: string;
    host: Host;
}

export const HostInfoCard: FC<HostInfoCardProps> = memo(
    (props: HostInfoCardProps) => {
        const { className, host } = props;
        return (
            <div className={cn(className, styles.wrapper)}>
                <HostDescriptionCard
                    host={host}
                    className={styles.container}
                />
                <HostOffersCard
                    hostId={host.id}
                    className={styles.container}
                />
                {/* {host && (
                    <HostGalleryCard
                        images={host.gallery?.images}
                        className={styles.container}
                    />
                )} */}
                {/* {host?.videoGallery && (
                    <HostVideoGalleryCard
                        videoGallery={host.videoGallery}
                        className={styles.container}
                    />
                )} */}
                <HostTeamCard
                    hostId={host.id}
                    className={styles.container}
                />
                {/* {host?.reviews && (
                    <HostReviewCard
                        review={host.reviews}
                        className={styles.container}
                    />
                )} */}
                {/* {host?.articles && (
                    <HostArticleCard
                        articles={host.articles}
                        className={styles.container}
                    />
                )} */}
            </div>
        );
    },
);
