import cn from "classnames";
import React, { FC, memo } from "react";

import { Host } from "../../model/types/host";
// import { HostArticleCard } from "../HostArticleCard/HostArticleCard";
import { HostDescriptionCard } from "../HostDescriptionCard/HostDescriptionCard";
// import { HostGalleryCard } from "../HostGalleryCard/HostGalleryCard";
import { HostOffersCard } from "../HostOffersCard/HostOffersCard";
import { HostTeamCard } from "../HostTeamCard/HostTeamCard";
// import { HostVideoGalleryCard } from "../HostVideoGalleryCard/HostVideoGalleryCard";
import styles from "./HostInfoCard.module.scss";
import { HostGalleryCard } from "../HostGalleryCard/HostGalleryCard";
import { getMediaContentsArray } from "@/shared/lib/getMediaContent";
import { HostVideoGalleryCard } from "../HostVideoGalleryCard/HostVideoGalleryCard";
import { HostReviewCard } from "../HostReviewCard/HostReviewCard";
import { useLocale } from "@/app/providers/LocaleProvider";

interface HostInfoCardProps {
    className?: string;
    host: Host;
}

export const HostInfoCard: FC<HostInfoCardProps> = memo(
    (props: HostInfoCardProps) => {
        const { className, host } = props;
        const { locale } = useLocale();

        return (
            <div className={cn(className, styles.wrapper)}>
                <HostDescriptionCard
                    host={host}
                    className={styles.container}
                />
                <HostOffersCard
                    hostId={host.id}
                    className={styles.container}
                    locale={locale}
                />
                <HostGalleryCard
                    images={getMediaContentsArray(host.galleryImages)}
                    className={styles.container}
                />
                <HostVideoGalleryCard
                    videoGallery={host.videoGallery}
                    className={styles.container}
                />
                <HostTeamCard
                    hostId={host.id}
                    className={styles.container}
                />
                <HostReviewCard
                    hostId={host.id}
                    className={styles.container}
                />
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
