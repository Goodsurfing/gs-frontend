import React, { FC } from "react";

import { PageLayout } from "@/widgets/PageLayout";
import { HostPagesSidebarData } from "@/shared/data/sidebar/host-pages";
import { VideoForm } from "@/modules/VideoForm";

import styles from "./HostVideoPage.module.scss";

const HostVideoPage: FC = () => (
    <PageLayout sidebarContent={HostPagesSidebarData}>
        <div className={styles.wrapper}>
            <VideoForm />
        </div>
    </PageLayout>
);

export default HostVideoPage;
