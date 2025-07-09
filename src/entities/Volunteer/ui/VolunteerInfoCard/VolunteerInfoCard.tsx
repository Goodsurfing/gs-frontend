import cn from "classnames";
import React, { FC, memo } from "react";

import { getMediaContentsArray } from "@/shared/lib/getMediaContent";

import { VolunteerApi } from "../../model/types/volunteer";
import { VolunteerDesctiptionCard } from "../VolunteerDesctiptionCard/VolunteerDesctiptionCard";
import { VolunteerGalleryCard } from "../VolunteerGalleryCard/VolunteerGalleryCard";
import { VolunteerLanguagesCard } from "../VolunteerLanguagesCard/VolunteerLanguagesCard";
import { VolunteerReviewsCard } from "../VolunteerReviewsCard/VolunteerReviewsCard";
import { VolunteerSkillsCard } from "../VolunteerSkillsCard/VolunteerSkillsCard";
import { VolunteerVideoGalleryCard } from "../VolunteerVideoGalleryCard/VolunteerVideoGalleryCard";
import styles from "./VolunteerInfoCard.module.scss";
import { VolunteerCertificatesCard } from "../VolunteerCertificatesCard/VolunteerCertificatesCard";
import { VolunteerOffersCard } from "../VolunteerOffersCard/VolunteerOffersCard";

interface VolunteerInfoCardProps {
    className?: string;
    volunteer: VolunteerApi;
}

export const VolunteerInfoCard: FC<VolunteerInfoCardProps> = memo(
    (props: VolunteerInfoCardProps) => {
        const { volunteer, className } = props;
        const showImageGallery = volunteer?.profile.galleryImages
            && volunteer?.profile.galleryImages.length !== 0;
        const showVideoGallery = volunteer?.profile.videoGallery
            && volunteer?.profile.videoGallery.length !== 0;
        const showCertificates = volunteer.certificates.length !== 0;

        return (
            <div className={cn(className)}>
                <VolunteerDesctiptionCard
                    description={volunteer?.externalInfo}
                />
                <VolunteerSkillsCard
                    skills={volunteer.skills}
                    additionalSkills={volunteer.additionalSkills}
                    className={styles.container}
                />
                <VolunteerLanguagesCard
                    languages={volunteer.languages}
                    className={styles.container}
                />
                <VolunteerOffersCard
                    offers={volunteer.participatedVacancies}
                    className={styles.container}
                />
                <VolunteerReviewsCard
                    volunteerId={volunteer.profile.id}
                    className={styles.container}
                />
                {showImageGallery && (
                    <VolunteerGalleryCard
                        images={getMediaContentsArray(
                            volunteer.profile.galleryImages,
                        )}
                        className={styles.container}
                    />
                )}
                {showVideoGallery && (
                    <VolunteerVideoGalleryCard
                        videoGallery={volunteer.profile.videoGallery}
                        className={styles.container}
                    />
                )}
                {showCertificates && (
                    <VolunteerCertificatesCard
                        certificates={volunteer.certificates}
                        classname={styles.container}
                    />
                )}
                {/* <VolunteerArticlesCard
                    articles={volunteer.articles}
                    className={styles.container}
                /> */}
                {/* {host && (
                    <VolunteerHostCard host={host} className={styles.container} />
                )} */}
            </div>
        );
    },
);
