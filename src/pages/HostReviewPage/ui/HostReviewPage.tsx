import React, { FC } from "react";

import { PageLayout } from "@/widgets/PageLayout";
import { HostPagesSidebarData } from "@/shared/data/host-pages";
import { Title } from "./Title/Title";
import styles from "./HostReviewPage.module.scss";

const HostReviewPage: FC = () => (
    <PageLayout sidebarContent={HostPagesSidebarData}>
        <div className={styles.wrapper}>
            <Title />
        </div>
    </PageLayout>
);

export default HostReviewPage;
