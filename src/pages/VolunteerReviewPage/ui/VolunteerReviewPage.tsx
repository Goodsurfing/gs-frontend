import React, { FC } from "react";

import { useLocale } from "@/app/providers/LocaleProvider";

import {
    ReviewAboutOffers,
    ReviewAboutVolunteer,
} from "@/widgets/VolunteerReview/";

import { useGetMyVolunteerQuery } from "@/entities/Volunteer";

import { MiniLoader } from "@/shared/ui/MiniLoader/MiniLoader";

import { Title } from "./Title/Title";
import styles from "./VolunteerReviewPage.module.scss";

const VolunteerReviewPage: FC = () => {
    const { data: volunteerData, isLoading } = useGetMyVolunteerQuery();
    const { locale } = useLocale();

    if (!volunteerData || isLoading) {
        return (
            <div className={styles.wrapper}>
                <MiniLoader />
            </div>
        );
    }

    return (
        <div className={styles.wrapper}>
            <Title />
            <div className={styles.container}>
                <ReviewAboutOffers id={volunteerData.profile.id} locale={locale} />
                <ReviewAboutVolunteer volunteerId={volunteerData.profile.id} />
            </div>
        </div>
    );
};

export default VolunteerReviewPage;
