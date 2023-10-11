import React, { FC } from "react";
import { ReviewAboutVolunteers } from "@/modules/ReviewAboutVolunteers";

import { PageLayout } from "@/widgets/PageLayout";

import { HostPagesSidebarData } from "@/shared/data/host-pages";

import { Title } from "./Title/Title";
import { ReviewAboutOffers } from "@/modules/ReviewAboutOffers/ui/ReviewAboutOffers/ReviewAboutOffers";

import styles from "./HostReviewPage.module.scss";

const HostReviewPage: FC = () => (
    <PageLayout sidebarContent={HostPagesSidebarData}>
        <div className={styles.wrapper}>
            <Title />
            <div className={styles.container}>
                <ReviewAboutVolunteers />
                <ReviewAboutOffers />
            </div>
        </div>
    </PageLayout>
);

export default HostReviewPage;
