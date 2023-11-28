import cn from "classnames";
import React, { FC, memo } from "react";

import { mockedOffersData } from "@/entities/Offer/model/data/mockedOfferData";

import { FullHost } from "../../model/types/host";
import { HostDescriptionCard } from "../HostDescriptionCard/HostDescriptionCard";
import { HostGalleryCard } from "../HostGalleryCard/HostGalleryCard";
import { HostOffersCard } from "../HostOffersCard/HostOffersCard";
import { HostVideoGalleryCard } from "../HostVideoGalleryCard/HostVideoGalleryCard";
import { HostTeamCard } from "../HostTeamCard/HostTeamCard";
import { HostReviewCard } from "../HostReviewCard/HostReviewCard";
import styles from "./HostInfoCard.module.scss";

interface HostInfoCardProps {
    className?: string;
    host: FullHost;
}

export const HostInfoCard: FC<HostInfoCardProps> = memo(
    (props: HostInfoCardProps) => {
        const { className, host } = props;
        return (
            <div className={cn(className, styles.wrapper)}>
                <HostDescriptionCard
                    host={host.host}
                    className={styles.container}
                />
                <HostOffersCard
                    offers={mockedOffersData}
                    className={styles.container}
                />
                {host.gallery?.images && (
                    <HostGalleryCard
                        images={host.gallery?.images}
                        className={styles.container}
                    />
                )}
                {host?.videoGallery && (
                    <HostVideoGalleryCard
                        videoGallery={host.videoGallery}
                        className={styles.container}
                    />
                )}
                {host?.team && <HostTeamCard team={host.team} className={styles.container} />}
                {host?.review && <HostReviewCard />}
            </div>
        );
    },
);
