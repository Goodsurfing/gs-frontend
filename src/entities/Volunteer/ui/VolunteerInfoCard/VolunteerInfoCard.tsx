import cn from "classnames";
import React, { FC, memo } from "react";

import { Volunteer } from "../../model/types/volunteer";
import { VolunteerDesctiptionCard } from "../VolunteerDesctiptionCard/VolunteerDesctiptionCard";
import { VolunteerGalleryCard } from "../VolunteerGalleryCard/VolunteerGalleryCard";
import { VolunteerLanguagesCard } from "../VolunteerLanguagesCard/VolunteerLanguagesCard";
import { VolunteerOffersCard } from "../VolunteerOffersCard/VolunteerOffersCard";
import { VolunteerReviewsCard } from "../VolunteerReviewsCard/VolunteerReviewsCard";
import { VolunteerSkillsCard } from "../VolunteerSkillsCard/VolunteerSkillsCard";
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
            </div>
        );
    },
);
