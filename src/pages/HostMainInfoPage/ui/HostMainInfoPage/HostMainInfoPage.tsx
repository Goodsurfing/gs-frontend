import React, { FC } from "react";

import HostMainInfoForm from "../HostMainInfoForm/HostMainInfoForm";
import styles from "./HostMainInfoPage.module.scss";
import { PageLayout } from "@/widgets/PageLayout";
import { HostPagesSidebarData } from "@/shared/data/host-pages";
import { HostDescriptionForm } from "@/features/HostDescription";

const HostMainInfoPage: FC = () => (
    <PageLayout sidebarContent={HostPagesSidebarData}>
        <div className={styles.wrapper}>
            {/* <HostMainInfoForm /> */}
            <HostDescriptionForm />
        </div>
    </PageLayout>
);

export default HostMainInfoPage;
