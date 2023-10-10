import { ReviewAboutVolunteers } from "@/modules/ReviewAboutVolunteers";
import React, { FC } from "react";

import { PageLayout } from "@/widgets/PageLayout";

import { HostPagesSidebarData } from "@/shared/data/host-pages";

import styles from "./HostReviewPage.module.scss";
import { Title } from "./Title/Title";

const HostReviewPage: FC = () => (
    <PageLayout sidebarContent={HostPagesSidebarData}>
        <div className={styles.wrapper}>
            <Title />
            <div className={styles.container}>
                <ReviewAboutVolunteers />
            </div>
        </div>
    </PageLayout>
);

export default HostReviewPage;
