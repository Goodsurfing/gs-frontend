import React, { FC } from "react";
import { ReviewAboutVolunteers, ReviewAboutOffers } from "@/widgets/HostReview/";
import { Title } from "./Title/Title";

import styles from "./HostReviewPage.module.scss";

const HostReviewPage: FC = () => (
    <div className={styles.wrapper}>
        <Title />
        <div className={styles.container}>
            <ReviewAboutVolunteers />
            <ReviewAboutOffers />
        </div>
    </div>
);

export default HostReviewPage;
