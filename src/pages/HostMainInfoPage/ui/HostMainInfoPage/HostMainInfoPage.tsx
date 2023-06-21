import React, { FC } from "react";

import HostMainInfoForm from "../HostMainInfoForm/HostMainInfoForm";
import styles from "./HostMainInfoPage.module.scss";
import { PageLayout } from "@/widgets/PageLayout";
import { HostPagesSidebarData } from "@/shared/data/host-pages";

const HostMainInfoPage: FC = () => {
    return (
        <PageLayout sidebarContent={HostPagesSidebarData}>
            <div className={styles.wrapper}>
                <HostMainInfoForm />
            </div>
        </PageLayout>
    );
};

export default HostMainInfoPage;
