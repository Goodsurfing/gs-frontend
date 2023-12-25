import React, { FC } from "react";
import { ReviewAboutVolunteer, ReviewAboutOffers } from "@/widgets/VolunteerReview/";
import { Title } from "./Title/Title";

import styles from "./VolunteerReviewPage.module.scss";

const VolunteerReviewPage: FC = () => (
    <div className={styles.wrapper}>
        <Title />
        <div className={styles.container}>
            <ReviewAboutOffers />
            <ReviewAboutVolunteer />
        </div>
    </div>
);

export default VolunteerReviewPage;
