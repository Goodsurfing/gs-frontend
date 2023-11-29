import cn from "classnames";
import React, { FC, memo } from "react";

import { Volunteer } from "../../model/types/volunteer";
import { VolunteerArticlesCard } from "../VolunteerArticlesCard/VolunteerArticlesCard";
import { VolunteerCertificatesCard } from "../VolunteerCertificatesCard/VolunteerCertificatesCard";
import { VolunteerDesctiptionCard } from "../VolunteerDesctiptionCard/VolunteerDesctiptionCard";
import { VolunteerGalleryCard } from "../VolunteerGalleryCard/VolunteerGalleryCard";
import { VolunteerLanguagesCard } from "../VolunteerLanguagesCard/VolunteerLanguagesCard";
import { VolunteerOffersCard } from "../VolunteerOffersCard/VolunteerOffersCard";
import { VolunteerReviewsCard } from "../VolunteerReviewsCard/VolunteerReviewsCard";
import { VolunteerSkillsCard } from "../VolunteerSkillsCard/VolunteerSkillsCard";
import { VolunteerVideoGalleryCard } from "../VolunteerVideoGalleryCard/VolunteerVideoGalleryCard";
import styles from "./VolunteerInfoCard.module.scss";

interface VolunteerInfoCardProps {
    className?: string;
    volunteer: Volunteer;
}

export const VolunteerInfoCard: FC<VolunteerInfoCardProps> = memo(
    (props: VolunteerInfoCardProps) => {
        const { volunteer, className } = props;
        return (
            <div className={cn(className)}>
                <VolunteerDesctiptionCard description={volunteer.aboutMe} />
                <VolunteerSkillsCard
                    skills={volunteer.skills}
                    className={styles.container}
                />
                <VolunteerLanguagesCard
                    languages={volunteer.languages}
                    className={styles.container}
                />
                <VolunteerOffersCard
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
                />
            </div>
        );
    },
);
