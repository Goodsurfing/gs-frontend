import React, { FC } from "react";

import { PageLayout } from "@/widgets/PageLayout";
import { HostPagesSidebarData } from "@/shared/data/host-pages";
import { VideoForm } from "@/modules/VideoForm";

import styles from "./HostVideoPage.module.scss";

const HostVideoPage: FC = () => {
    return (
        <PageLayout sidebarContent={HostPagesSidebarData}>
            <div className={styles.wrapper}>
                <VideoForm />
            </div>
        </PageLayout>
    );
};

export default HostVideoPage;
