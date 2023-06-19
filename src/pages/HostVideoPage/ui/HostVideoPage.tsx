import React, { FC } from "react";

import { HostPageLayout } from "@/widgets/HostPageLayout";
import { VideoForm } from "@/modules/VideoForm";

import styles from "./HostVideoPage.module.scss";

const HostVideoPage: FC = () => {
    return (
        <HostPageLayout>
            <div className={styles.wrapper}>
                <VideoForm />
            </div>
        </HostPageLayout>
    );
};

export default HostVideoPage;
