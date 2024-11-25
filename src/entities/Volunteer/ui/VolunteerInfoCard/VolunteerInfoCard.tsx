import cn from "classnames";
import React, { FC, memo } from "react";

import { Host } from "@/entities/Host";

import { VolunteerApi } from "../../model/types/volunteer";
import { VolunteerDesctiptionCard } from "../VolunteerDesctiptionCard/VolunteerDesctiptionCard";
import { VolunteerLanguagesCard } from "../VolunteerLanguagesCard/VolunteerLanguagesCard";
import { VolunteerSkillsCard } from "../VolunteerSkillsCard/VolunteerSkillsCard";
import { VolunteerHostCard } from "../VolunteerHostCard/VolunteerHostCard";
import styles from "./VolunteerInfoCard.module.scss";
import { VolunteerGalleryCard } from "../VolunteerGalleryCard/VolunteerGalleryCard";
import { getMediaContentsArray } from "@/shared/lib/getMediaContent";
import { VolunteerVideoGalleryCard } from "../VolunteerVideoGalleryCard/VolunteerVideoGalleryCard";

interface VolunteerInfoCardProps {
    className?: string;
    volunteer?: VolunteerApi;
    host?: Host;
}

export const VolunteerInfoCard: FC<VolunteerInfoCardProps> = memo(
    (props: VolunteerInfoCardProps) => {
        const { volunteer, className, host } = props;
        const showImageGallery = volunteer?.profile.galleryImages
        && volunteer?.profile.galleryImages.length !== 0;
        const showVideoGallery = volunteer?.profile.videoGallery
        && volunteer?.profile.videoGallery.length !== 0;

        return (
            <div className={cn(className)}>
                <VolunteerDesctiptionCard
                    description={volunteer?.externalInfo}
                />
                <VolunteerSkillsCard
                    skills={volunteer?.skills}
                    additionalSkills={volunteer?.additionalSkills}
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
                /> */}
                {showImageGallery
                && (
                    <VolunteerGalleryCard
                        images={getMediaContentsArray(volunteer?.profile.galleryImages)}
                        className={styles.container}
                    />
                )}
                {showVideoGallery && (
                    <VolunteerVideoGalleryCard
                        videoGallery={volunteer?.profile.videoGallery}
                        className={styles.container}
                    />
                )}
                {/* <VolunteerCertificatesCard
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
