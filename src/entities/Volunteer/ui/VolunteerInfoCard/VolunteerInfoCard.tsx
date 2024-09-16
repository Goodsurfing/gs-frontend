import cn from "classnames";
import React, { FC, memo } from "react";

import { Host } from "@/entities/Host";

import { VolunteerApi } from "../../model/types/volunteer";
import { VolunteerDesctiptionCard } from "../VolunteerDesctiptionCard/VolunteerDesctiptionCard";
import { VolunteerLanguagesCard } from "../VolunteerLanguagesCard/VolunteerLanguagesCard";
import { VolunteerSkillsCard } from "../VolunteerSkillsCard/VolunteerSkillsCard";
import { VolunteerHostCard } from "../VolunteerHostCard/VolunteerHostCard";
import styles from "./VolunteerInfoCard.module.scss";

interface VolunteerInfoCardProps {
    className?: string;
    volunteer?: VolunteerApi;
    host?: Host;
}

export const VolunteerInfoCard: FC<VolunteerInfoCardProps> = memo(
    (props: VolunteerInfoCardProps) => {
        const { volunteer, className, host } = props;
        return (
            <div className={cn(className)}>
                <VolunteerDesctiptionCard
                    description={volunteer?.externalInfo}
                />
                <VolunteerSkillsCard
                    skills={volunteer?.skills}
                    className={styles.container}
                />
                <VolunteerLanguagesCard
                    languages={volunteer?.languages}
                    className={styles.container}
                />
                {/* <VolunteerOffersCard
                    offers={volunteer.offers}
                    className={styles.container}
                />
                <VolunteerReviewsCard
                    reviews={volunteer.reviews}
                    className={styles.container}
                />
                <VolunteerGalleryCard
                    images={volunteer.gallery?.images}
                    className={styles.container}
                />
                <VolunteerVideoGalleryCard
                    videoGallery={volunteer.videoGallery}
                    className={styles.container}
                />
                <VolunteerCertificatesCard
                    certificates={volunteer.certificates}
                    classname={styles.container}
                />
                <VolunteerArticlesCard
                    articles={volunteer.articles}
                    className={styles.container}
                /> */}
                {host && (
                    <VolunteerHostCard host={host} className={styles.container} />
                )}
            </div>
        );
    },
);
